"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isEmail, MIN_PASSWORD_LENGTH, safeReturnPath, type CustomerProfile } from "@/lib/account";
import { fallbackLoginEmail } from "@/lib/admin/login";
import { isCountryCode } from "@/lib/delivery";
import { site } from "@/lib/site";
import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase/session";

export type AuthState = { error?: string; email?: string; fullName?: string; phone?: string; pending?: boolean };

const text = (formData: FormData, key: string, max = 300) => String(formData.get(key) ?? "").trim().slice(0, max);

function authError(error: { status?: number; code?: string; message: string }): string {
  if (error.status === 429 || error.code === "over_request_rate_limit" || error.code === "over_email_send_rate_limit")
    return "Trop de tentatives. Patientez quelques minutes, puis réessayez.";
  if (error.code === "user_already_exists" || /already registered/i.test(error.message))
    return "Un compte existe déjà avec cette adresse. Connectez-vous.";
  if (error.code === "weak_password") return `Mot de passe trop faible : ${MIN_PASSWORD_LENGTH} caractères minimum, mélangez lettres et chiffres.`;
  if (error.code === "email_not_confirmed") return "Confirmez d'abord votre adresse : ouvrez le lien reçu par e-mail.";
  if (error.code === "signup_disabled") return "La création de compte est momentanément fermée.";
  if (error.code === "email_address_invalid") return "Cette adresse e-mail n'est pas acceptée.";
  return "Nom d'utilisateur, e-mail ou mot de passe incorrect.";
}

/**
 * Connexion unique pour les clients (e-mail) et le propriétaire (e-mail ou nom d'utilisateur).
 * Un administrateur est envoyé vers l'espace propriétaire, un client vers son compte.
 */
export async function signInAccount(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const identifier = text(formData, "identifiant", 120);
  const password = String(formData.get("motdepasse") ?? "");
  if (!identifier || !password) return { error: "Indiquez votre e-mail et votre mot de passe.", email: identifier };
  if (!isSupabaseConfigured()) return { error: "Les comptes ne sont pas encore disponibles.", email: identifier };

  const supabase = await createSessionClient();
  let email = fallbackLoginEmail(identifier);
  if (!identifier.includes("@")) {
    const { data: found } = await supabase.rpc("admin_login_email", { p_username: identifier });
    if (typeof found === "string" && found) email = found;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: error ? authError(error) : authError({ message: "" }), email: identifier };

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  redirect(admin ? "/admin" : safeReturnPath(formData.get("suite")));
}

export async function signUpAccount(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = text(formData, "nom", 120);
  const email = text(formData, "email", 120).toLowerCase();
  const phone = text(formData, "telephone", 30);
  const password = String(formData.get("motdepasse") ?? "");
  const keep = { email, fullName, phone };

  if (fullName.length < 2) return { ...keep, error: "Indiquez votre nom complet." };
  if (!isEmail(email)) return { ...keep, error: "Indiquez une adresse e-mail valide." };
  if (password.length < MIN_PASSWORD_LENGTH) return { ...keep, error: `Mot de passe : ${MIN_PASSWORD_LENGTH} caractères minimum.` };
  if (!isSupabaseConfigured()) return { ...keep, error: "Les comptes ne sont pas encore disponibles." };

  const origin = (await headers()).get("origin") ?? site.url;
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone }, emailRedirectTo: `${origin}/auth/confirmation` },
  });
  if (error) return { ...keep, error: authError(error) };
  // Adresse déjà inscrite : Supabase répond sans erreur mais sans identité, pour ne rien révéler.
  if (data.user && data.user.identities?.length === 0) return { ...keep, error: "Un compte existe déjà avec cette adresse. Connectez-vous." };
  // Confirmation par e-mail activée dans Supabase : pas encore de session.
  if (!data.session) return { ...keep, pending: true };

  redirect(safeReturnPath(formData.get("suite")));
}

export type ResetRequestState = { error?: string; email?: string; sent?: boolean };

/**
 * « Mot de passe oublié » : envoie un lien pour choisir un nouveau mot de passe.
 * Supabase répond pareil que l'adresse ait un compte ou non : rien n'est révélé.
 */
export async function requestPasswordReset(_prev: ResetRequestState, formData: FormData): Promise<ResetRequestState> {
  const email = text(formData, "email", 120).toLowerCase();
  if (!isEmail(email)) return { email, error: "Indiquez l'adresse e-mail de votre compte." };
  if (!isSupabaseConfigured()) return { email, error: "Les comptes ne sont pas encore disponibles." };

  const origin = (await headers()).get("origin") ?? site.url;
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/reinitialisation` });
  if (error) {
    if (error.status === 429 || error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit")
      return { email, error: "Trop de demandes. Patientez quelques minutes, puis réessayez." };
    console.error("Mot de passe oublié :", error.code ?? error.status, error.message);
    return { email, error: "L'e-mail n'a pas pu être envoyé. Réessayez plus tard, ou écrivez-nous sur WhatsApp." };
  }
  return { email, sent: true };
}

export type PasswordState = { error?: string };

/** Nouveau mot de passe, après le lien reçu par e-mail ou depuis « Mon compte ». */
export async function updatePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const password = String(formData.get("motdepasse") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (password.length < MIN_PASSWORD_LENGTH) return { error: `Mot de passe : ${MIN_PASSWORD_LENGTH} caractères minimum.` };
  if (password !== confirmation) return { error: "Les deux mots de passe ne sont pas identiques." };
  if (!isSupabaseConfigured()) return { error: "Les comptes ne sont pas encore disponibles." };

  const supabase = await createSessionClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { error: "Ce lien a expiré. Demandez un nouvel e-mail depuis « Mot de passe oublié »." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.code === "same_password") return { error: "Choisissez un mot de passe différent de l'ancien." };
    if (error.code === "weak_password") return { error: authError(error) };
    console.error("Changement de mot de passe :", error.code ?? error.status, error.message);
    return { error: "Le changement a échoué. Réessayez." };
  }

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  redirect(admin ? "/admin" : "/compte?mdp=modifie");
}

export async function signOutAccount() {
  if (isSupabaseConfigured()) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/compte");
}

export type ProfileState = { ok?: boolean; error?: string };

export async function saveProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  if (!isSupabaseConfigured()) return { error: "Les comptes ne sont pas encore disponibles." };
  const supabase = await createSessionClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { error: "Votre session a expiré. Reconnectez-vous." };

  const country = text(formData, "pays", 10);
  const values = {
    full_name: text(formData, "nom", 120),
    phone: text(formData, "telephone", 30),
    country: isCountryCode(country) ? country : "SN",
    city: text(formData, "ville", 120),
    address: text(formData, "adresse", 300),
  };
  if (values.full_name.length < 2) return { error: "Indiquez votre nom complet." };
  const { error } = await supabase.from("customers").update(values).eq("user_id", userId);
  if (error) return { error: "L'enregistrement a échoué. Réessayez." };
  revalidatePath("/compte");
  return { ok: true };
}

/** Coordonnées du client connecté, pour pré-remplir la commande. Null sans compte. */
export async function getCheckoutProfile(): Promise<CustomerProfile | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSessionClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return null;
  const { data } = await supabase.from("customers").select("full_name, phone, country, city, address").eq("user_id", userId).maybeSingle();
  return {
    email: String(claims?.claims?.email ?? ""),
    fullName: data?.full_name ?? "",
    phone: data?.phone ?? "",
    country: data?.country ?? "SN",
    city: data?.city ?? "",
    address: data?.address ?? "",
  };
}

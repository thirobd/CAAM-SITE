"use server";

import { redirect } from "next/navigation";
import { loginEmail, safeAdminPath } from "@/lib/admin/login";
import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase/session";

export type LoginState = { error?: string; identifier?: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifiant") ?? "").trim();
  const password = String(formData.get("motdepasse") ?? "");
  if (!identifier || !password) return { error: "Indiquez votre nom d'utilisateur et votre mot de passe.", identifier };
  if (!isSupabaseConfigured()) return { error: "La base de données n'est pas configurée.", identifier };

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail(identifier), password });
  if (error || !data.user) {
    const tooMany = error?.status === 429 || error?.code === "over_request_rate_limit";
    return {
      error: tooMany ? "Trop de tentatives. Patientez quelques minutes, puis réessayez." : "Nom d'utilisateur ou mot de passe incorrect.",
      identifier,
    };
  }

  // Un compte Supabase ne suffit pas : il doit figurer parmi les administrateurs.
  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Ce compte n'a pas accès à l'espace propriétaire.", identifier };
  }

  redirect(safeAdminPath(formData.get("suite")));
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/connexion");
}

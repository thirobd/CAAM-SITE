import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, LogOut, ShieldCheck } from "lucide-react";
import { AuthForms } from "@/components/account/auth-forms";
import { ProfileForm } from "@/components/account/profile-form";
import { LocalDate } from "@/components/admin/local-date";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { customerStatusLabels, safeReturnPath, type CustomerOrder, type CustomerProfile } from "@/lib/account";
import { formatXof } from "@/lib/currency";
import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase/session";
import { signOutAccount } from "@/server/account";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ suite?: string; erreur?: string; oubli?: string; mdp?: string }> };

export default async function AccountPage({ searchParams }: Props) {
  const { suite, erreur, oubli, mdp } = await searchParams;
  const next = safeReturnPath(suite);

  const supabase = isSupabaseConfigured() ? await createSessionClient() : null;
  const { data: claims } = supabase ? await supabase.auth.getClaims() : { data: null };
  const userId = claims?.claims?.sub;

  if (!supabase || !userId) {
    return (
      <div className="container-luxe pb-24 pt-14 md:pt-20">
        <SectionHeading
          as="h1"
          eyebrow="Espace client"
          title="Mon compte"
          description="Retrouvez vos commandes et commandez plus vite grâce à vos coordonnées enregistrées."
          align="center"
          className="mb-12"
        />
        {erreur === "confirmation" && (
          <p role="alert" className="mx-auto mb-8 max-w-md bg-danger/10 px-4 py-3 text-sm text-danger">
            Ce lien de confirmation n&apos;est plus valable. Connectez-vous ou créez à nouveau votre compte.
          </p>
        )}
        {erreur === "lien" && (
          <p role="alert" className="mx-auto mb-8 max-w-md bg-danger/10 px-4 py-3 text-sm text-danger">
            Ce lien n&apos;est plus valable : il a peut-être expiré ou déjà servi. Demandez-en un nouveau ci-dessous.
          </p>
        )}
        <AuthForms next={next} initialMode={oubli !== undefined ? "oubli" : "connexion"} />
      </div>
    );
  }

  const [{ data: row }, { data: orders }, { data: admin }] = await Promise.all([
    supabase.from("customers").select("full_name, phone, country, city, address").eq("user_id", userId).maybeSingle(),
    supabase.rpc("my_orders"),
    supabase.from("admins").select("user_id").eq("user_id", userId).maybeSingle(),
  ]);
  const profile: CustomerProfile = {
    email: String(claims?.claims?.email ?? ""),
    fullName: row?.full_name ?? "",
    phone: row?.phone ?? "",
    country: row?.country ?? "SN",
    city: row?.city ?? "",
    address: row?.address ?? "",
  };
  const history = (orders ?? []) as CustomerOrder[];
  const firstName = profile.fullName.split(/\s+/)[0] || "et bienvenue";

  return (
    <div className="container-luxe pb-24 pt-14 md:pt-20">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading as="h1" eyebrow="Mon compte" title={`Bonjour ${firstName}`} description={profile.email} />
        <div className="flex flex-wrap gap-3">
          <Link href="/compte/mot-de-passe" className="inline-flex h-11 items-center gap-2 border border-ink/20 px-4 text-[13px] hover:border-ink">
            <KeyRound className="size-4" strokeWidth={1.5} aria-hidden="true" /> Changer de mot de passe
          </Link>
          <form action={signOutAccount}>
            <button type="submit" className="inline-flex h-11 items-center gap-2 border border-ink/20 px-4 text-[13px] hover:border-ink">
              <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" /> Déconnexion
            </button>
          </form>
        </div>
      </div>

      {mdp === "modifie" && (
        <p role="status" className="mb-12 border border-success/40 bg-success/10 px-5 py-4 text-[15px] text-ink">
          Votre mot de passe a bien été changé.
        </p>
      )}

      {admin && (
        <div className="mb-12 flex flex-col gap-4 border border-champagne bg-ink p-6 text-ivory sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-champagne" strokeWidth={1.25} aria-hidden="true" />
            Vous êtes connecté en tant que propriétaire.
          </p>
          <ButtonLink href="/admin" variant="gold">
            Espace propriétaire
          </ButtonLink>
        </div>
      )}

      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <section aria-labelledby="mes-coordonnees">
          <h2 id="mes-coordonnees" className="eyebrow mb-6 text-gold-deep">
            Mes coordonnées
          </h2>
          <ProfileForm profile={profile} />
        </section>

        <section aria-labelledby="mes-commandes">
          <h2 id="mes-commandes" className="eyebrow mb-6 text-gold-deep">
            Mes commandes
          </h2>
          {history.length === 0 ? (
            <div className="border border-ink/15 bg-paper p-6">
              <p className="text-stone">Vous n&apos;avez pas encore passé de commande avec ce compte.</p>
              <ButtonLink href="/boutique" variant="ink" className="mt-5">
                Découvrir la collection
              </ButtonLink>
            </div>
          ) : (
            <ul className="space-y-4">
              {history.map((o) => (
                <li key={o.reference} className="border border-ink/15 bg-paper p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-serif text-xl tracking-wide lining-nums">{o.reference}</p>
                    <p className="text-[12px] uppercase tracking-[0.16em] text-gold-deep">{customerStatusLabels[o.status]}</p>
                  </div>
                  <p className="text-[13px] text-stone">
                    <LocalDate iso={o.created_at} />
                  </p>
                  <ul className="mt-3 space-y-1 text-[14px]">
                    {o.items.map((item, i) => (
                      <li key={i} className="flex justify-between gap-4">
                        <span>
                          {item.name} · {item.size_ml} ml <span className="text-stone">× {item.quantity}</span>
                        </span>
                        <span className="tabular-nums">{formatXof(item.unit_price_xof * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex justify-between border-t border-ink/10 pt-3 text-[14px]">
                    <span className="text-stone">Total{o.delivery_fee_xof === null ? " (hors livraison)" : ""}</span>
                    <span className="font-serif text-lg tabular-nums lining-nums">{formatXof(o.total_xof)}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

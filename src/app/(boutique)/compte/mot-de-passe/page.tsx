import type { Metadata } from "next";
import { NewPasswordForm } from "@/components/account/new-password-form";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase/session";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  robots: { index: false },
};

export default async function NewPasswordPage() {
  const supabase = isSupabaseConfigured() ? await createSessionClient() : null;
  const { data: claims } = supabase ? await supabase.auth.getClaims() : { data: null };
  const email = claims?.claims?.email;

  return (
    <div className="container-luxe pb-24 pt-14 md:pt-20">
      {claims?.claims?.sub ? (
        <>
          <SectionHeading
            as="h1"
            eyebrow="Mon compte"
            title="Nouveau mot de passe"
            description={email ? `Pour le compte ${email}.` : undefined}
            align="center"
            className="mb-12"
          />
          <NewPasswordForm />
        </>
      ) : (
        <>
          <SectionHeading
            as="h1"
            eyebrow="Mon compte"
            title="Lien expiré"
            description="Ce lien n'est plus valable : il a peut-être déjà servi. Demandez un nouvel e-mail pour choisir votre mot de passe."
            align="center"
            className="mb-10"
          />
          <div className="text-center">
            <ButtonLink href="/compte?oubli" variant="ink" size="lg">
              Recevoir un nouveau lien
            </ButtonLink>
          </div>
        </>
      )}
    </div>
  );
}

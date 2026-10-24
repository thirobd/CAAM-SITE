import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Mentions légales" };

// Modèle à compléter et à faire valider selon le pays d'immatriculation de l'entreprise.
export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        {site.name} — [Forme juridique, ex. SAS / micro-entreprise]
        <br />
        Siège social : [Adresse complète]
        <br />
        Immatriculation : [SIREN / RCS ou équivalent]
        <br />
        N° de TVA intracommunautaire : [À compléter]
        <br />
        Responsable de la publication : [Prénom Nom]
        <br />
        Contact : <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>

      <h2>Hébergement</h2>
      <p>[Nom de l&apos;hébergeur, adresse et téléphone — ex. Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis]</p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus de ce site (textes, photographies, logo {site.name}) est protégé.
        Toute reproduction sans autorisation écrite préalable est interdite.
      </p>
    </LegalPage>
  );
}

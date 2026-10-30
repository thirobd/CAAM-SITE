import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/content-page";

export const metadata: Metadata = { title: "Mentions légales" };

// Modèle à compléter et à faire valider selon le pays d'immatriculation de l'entreprise.
export default function MentionsLegalesPage() {
  return (
    <ContentPage eyebrow="Informations légales" title="Mentions légales" intro="Page à compléter par ĆAAM avant la mise en ligne.">
      <h2>Éditeur du site</h2>
      <p>
        ĆAAM — [Forme juridique]
        <br />
        Siège : [Adresse complète]
        <br />
        Immatriculation : [NINEA / RCCM ou équivalent selon le pays]
        <br />
        Responsable de la publication : [Prénom Nom]
        <br />
        Contact : [Adresse e-mail]
      </p>
      <h2>Hébergement</h2>
      <p>[Nom, adresse et coordonnées de l&apos;hébergeur]</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Le nom ĆAAM, le logo et l&apos;ensemble des contenus de ce site sont protégés. Toute reproduction sans autorisation écrite préalable est
        interdite.
      </p>
    </ContentPage>
  );
}

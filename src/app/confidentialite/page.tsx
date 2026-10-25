import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/content-page";

export const metadata: Metadata = { title: "Politique de confidentialité" };

// Modèle à compléter et à faire valider selon le pays d'immatriculation de l'entreprise.
export default function ConfidentialitePage() {
  return (
    <ContentPage eyebrow="Informations légales" title="Politique de confidentialité" intro="Modèle à compléter et à faire valider avant la mise en ligne.">
      <h2>Données collectées</h2>
      <p>
        Lors d&apos;une commande : nom, téléphone, adresse de livraison et instructions éventuelles. <strong>Dans la version actuelle (prototype), ces
        données ne sont ni enregistrées ni transmises.</strong>
      </p>
      <h2>Stockage dans votre navigateur</h2>
      <p>
        Le contenu de votre panier et votre devise d&apos;affichage sont conservés dans votre navigateur (stockage local) pour les retrouver lors de
        votre prochaine visite. Ce site n&apos;utilise pas de cookies publicitaires.
      </p>
      <h2>Vos droits</h2>
      <p>[Modalités d&apos;accès, de rectification et de suppression des données ; autorité de contrôle compétente.]</p>
    </ContentPage>
  );
}

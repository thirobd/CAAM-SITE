import type { Metadata } from "next";
import { ContentPage } from "@/components/ui/content-page";

export const metadata: Metadata = { title: "Politique de confidentialité" };

// Modèle à compléter et à faire valider selon le pays d'immatriculation de l'entreprise.
export default function ConfidentialitePage() {
  return (
    <ContentPage eyebrow="Informations légales" title="Politique de confidentialité" intro="Modèle à compléter et à faire valider avant la mise en ligne.">
      <h2>Données collectées</h2>
      <p>
        Lors d&apos;une commande : nom, téléphone, adresse de livraison et instructions éventuelles. Ces informations sont enregistrées de façon
        sécurisée, ne sont accessibles qu&apos;à ĆAAM et servent au traitement de votre commande. Elles sont aussi reprises dans le message WhatsApp
        que vous envoyez vous-même à ĆAAM, soumis aux conditions et à la politique de confidentialité de WhatsApp.
      </p>
      <h2>Compte client</h2>
      <p>
        Si vous créez un compte : adresse e-mail, mot de passe (enregistré chiffré, jamais lisible), nom, téléphone et adresse de livraison si
        vous les renseignez, ainsi que l&apos;historique de vos commandes. Ces données ne sont accessibles qu&apos;à vous et à ĆAAM. Pour
        supprimer votre compte, écrivez-nous.
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

import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Politique de confidentialité" };

// Modèle à compléter et à faire valider selon le pays d'immatriculation de l'entreprise.
export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <h2>Données collectées</h2>
      <p>
        Lors d&apos;une commande, nous collectons les informations nécessaires à son traitement : nom,
        adresse de livraison, e-mail et téléphone. Les données de paiement sont traitées directement
        par Stripe et ne transitent jamais par nos serveurs.
      </p>

      <h2>Utilisation</h2>
      <p>
        Ces données servent uniquement à préparer, expédier et suivre votre commande, et à vous
        contacter à son sujet. Elles ne sont ni vendues ni cédées à des tiers.
      </p>

      <h2>Stockage local</h2>
      <p>
        Le contenu de votre panier est conservé dans votre navigateur afin de le retrouver lors de
        votre prochaine visite. Ce site n&apos;utilise pas de cookies publicitaires.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en écrivant
        à <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}

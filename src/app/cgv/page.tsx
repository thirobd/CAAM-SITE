import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ui/content-page";

export const metadata: Metadata = { title: "Conditions générales de vente" };

// Modèle à compléter et à faire valider selon le pays d'immatriculation de l'entreprise.
export default function CgvPage() {
  return (
    <ContentPage eyebrow="Informations légales" title="Conditions générales de vente" intro="Modèle à compléter et à faire valider avant la mise en ligne.">
      <h2>1. Objet</h2>
      <p>Les présentes conditions régissent les ventes de parfums réalisées sur ce site par ĆAAM [raison sociale, adresse].</p>
      <h2>2. Prix</h2>
      <p>
        Les prix sont indiqués en francs CFA (FCFA), toutes taxes comprises, hors frais de livraison. Les montants affichés en euros le sont à titre
        indicatif, sur la base de la parité fixe 1 € = 655,957 FCFA.
      </p>
      <h2>3. Commande et paiement</h2>
      <p>[Modes de paiement acceptés, moment du débit, confirmation de commande.]</p>
      <h2>4. Livraison</h2>
      <p>
        Les zones, délais et frais sont détaillés sur la page <Link href="/livraison">Livraison & retours</Link>.
      </p>
      <h2>5. Retours et rétractation</h2>
      <p>[Délai et conditions de retour ; exclusion des produits descellés pour des raisons d&apos;hygiène.]</p>
      <h2>6. Réclamations</h2>
      <p>[Coordonnées du service client et procédure de réclamation.]</p>
    </ContentPage>
  );
}

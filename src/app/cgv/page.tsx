import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Conditions générales de vente" };

// Modèle à compléter et à faire valider selon le pays d'immatriculation de l'entreprise.
export default function CgvPage() {
  return (
    <LegalPage title="Conditions générales de vente">
      <p>Dernière mise à jour : [date]</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent les ventes de parfums réalisées sur ce site par {site.name}
        [raison sociale, adresse] auprès de clients particuliers.
      </p>

      <h2>2. Prix</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises, hors frais de livraison. Les frais de
        livraison sont précisés avant la validation de la commande. Le paiement peut être présenté dans
        la devise du client ; le taux de conversion est alors indiqué au moment du paiement.
      </p>

      <h2>3. Commande et paiement</h2>
      <p>
        Le paiement s&apos;effectue en ligne par l&apos;intermédiaire de Stripe. La commande est
        définitive après confirmation du paiement ; un e-mail de confirmation est alors envoyé.
      </p>

      <h2>4. Livraison</h2>
      <p>
        Les zones, délais et tarifs sont détaillés sur la page{" "}
        <Link href="/livraison">Livraison & retours</Link>. Pour les envois hors Union européenne, les
        éventuels droits et taxes d&apos;importation sont à la charge du client.
      </p>

      <h2>5. Droit de rétractation</h2>
      <p>
        Le client dispose de 14 jours à compter de la réception pour exercer son droit de rétractation.
        Pour des raisons d&apos;hygiène, ce droit ne s&apos;applique pas aux produits descellés après
        la livraison. [Préciser les modalités de retour et de remboursement.]
      </p>

      <h2>6. Contact et réclamations</h2>
      <p>
        Pour toute question : <a href={`mailto:${site.email}`}>{site.email}</a>. [Indiquer le médiateur
        de la consommation compétent, le cas échéant.]
      </p>
    </LegalPage>
  );
}

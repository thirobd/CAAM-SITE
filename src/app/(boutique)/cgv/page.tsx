import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ui/content-page";
import { paymentMethods } from "@/lib/checkout";
import { XOF_PER_EUR } from "@/lib/currency";
import { sellerName, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Commande, prix, paiement, livraison et retours des parfums ĆAAM.",
};

const parity = XOF_PER_EUR.toLocaleString("fr-FR", { maximumFractionDigits: 3 });

export default function CgvPage() {
  const { contact } = site;
  return (
    <ContentPage eyebrow="Informations légales" title="Conditions générales de vente" intro={`Dernière mise à jour : ${site.legalUpdatedAt}.`}>
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales de vente (CGV) s&apos;appliquent à toute commande de parfums passée sur ce site auprès de{" "}
        <strong>{sellerName}</strong> (voir les <Link href="/mentions-legales">mentions légales</Link>). Passer commande implique leur
        acceptation.
      </p>

      <h2>2. Produits</h2>
      <p>
        Les parfums proposés sont des extraits de parfum, décrits sur leur fiche : notes olfactives, contenance et prix. Les photos sont aussi
        fidèles que possible mais n&apos;ont pas de valeur contractuelle ; la teinte du jus peut légèrement varier d&apos;un lot à
        l&apos;autre. Les produits sont proposés dans la limite des stocks disponibles.
      </p>

      <h2>3. Prix</h2>
      <p>
        Les prix sont indiqués en francs CFA (FCFA), toutes taxes comprises, hors frais de livraison. Les montants affichés en euros le sont à
        titre indicatif, sur la base de la parité fixe 1 € = {parity} FCFA. Le prix appliqué est celui affiché au moment de la commande.
      </p>
      <p>
        Les frais de livraison au Sénégal sont indiqués avant l&apos;envoi de la commande. Pour l&apos;Europe et l&apos;international, ils
        sont communiqués sur devis, avant toute confirmation.
      </p>

      <h2>4. Commande</h2>
      <p>
        Vous choisissez vos parfums, puis indiquez vos coordonnées et votre adresse de livraison. Le site vérifie les prix et les
        disponibilités et vous attribue une référence de commande. Vous envoyez ensuite à ĆAAM le message WhatsApp prérempli qui récapitule
        votre commande.
      </p>
      <p>
        <strong>La vente est conclue à la confirmation de ĆAAM sur WhatsApp</strong>, qui rappelle les articles, le montant total et les
        modalités de livraison et de paiement. ĆAAM peut refuser une commande en cas d&apos;indisponibilité, d&apos;adresse non desservie ou
        de commande anormale ; aucune somme n&apos;est alors due.
      </p>

      <h2>5. Paiement</h2>
      <p>Aucun paiement n&apos;est effectué sur ce site. Les modes de paiement proposés sont :</p>
      <ul className="list-disc space-y-2 pl-5">
        {paymentMethods.map((m) => (
          <li key={m.id}>
            <strong>{m.label}</strong> : {m.detail}
          </li>
        ))}
      </ul>

      <h2>6. Livraison</h2>
      <p>
        Les zones, délais et frais sont détaillés sur la page <Link href="/livraison">Livraison &amp; retours</Link>. Les délais courent à
        partir de la confirmation de la commande. Vérifiez votre colis à la réception et signalez à ĆAAM, dès que possible et photos à
        l&apos;appui, tout dommage ou erreur. Pour les envois hors du Sénégal, d&apos;éventuels droits de douane et taxes locales restent à la
        charge du destinataire.
      </p>

      <h2>7. Retours et remboursements</h2>
      <p>
        Les flacons non ouverts, dans leur emballage d&apos;origine, peuvent être retournés dans les 14 jours suivant leur réception. Pour des
        raisons d&apos;hygiène, un flacon ouvert ou descellé n&apos;est ni repris ni échangé, sauf défaut. Prévenez ĆAAM avant tout retour :
        les modalités (dépôt, enlèvement ou envoi) vous sont alors indiquées. Le remboursement intervient dans les 14 jours suivant la
        réception du produit retourné.
      </p>
      <p>
        Un produit défectueux, endommagé pendant le transport ou différent de votre commande est remplacé ou remboursé, frais de retour à la
        charge de ĆAAM.
      </p>
      <p>
        Les clients résidant dans l&apos;Union européenne bénéficient en outre du droit de rétractation de 14 jours prévu par la loi de leur
        pays, dans les limites qu&apos;elle fixe : il ne s&apos;applique pas à un produit descellé après la livraison pour des raisons
        d&apos;hygiène.
      </p>

      <h2>8. Service client et réclamations</h2>
      <p>
        Pour toute question ou réclamation, écrivez à ĆAAM sur WhatsApp au {contact.phone} ou par e-mail à{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>, en indiquant votre référence de commande.
      </p>

      <h2>9. Données personnelles</h2>
      <p>
        Les informations transmises lors d&apos;une commande servent uniquement à la traiter et à la livrer. Leur utilisation et vos droits
        sont décrits dans la <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>10. Litiges</h2>
      <p>
        En cas de litige, une solution amiable est recherchée en priorité. À défaut, il est porté devant les juridictions compétentes. Les
        consommateurs résidant dans l&apos;Union européenne conservent la protection que leur accordent les dispositions impératives de la loi
        de leur pays de résidence.
      </p>
    </ContentPage>
  );
}

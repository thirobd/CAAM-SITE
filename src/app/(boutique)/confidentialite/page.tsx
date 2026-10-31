import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ui/content-page";
import { sellerName, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Données collectées par ĆAAM, utilisation, conservation et droits des clients.",
};

export default function ConfidentialitePage() {
  const { contact } = site;
  return (
    <ContentPage eyebrow="Informations légales" title="Politique de confidentialité" intro={`Dernière mise à jour : ${site.legalUpdatedAt}.`}>
      <h2>Responsable du traitement</h2>
      <p>
        Vos données sont traitées par <strong>{sellerName}</strong> (voir les <Link href="/mentions-legales">mentions légales</Link>),
        joignable à <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>

      <h2>Données collectées</h2>
      <p>
        <strong>Lors d&apos;une commande</strong> : nom, téléphone, pays, ville, adresse de livraison, instructions éventuelles et articles
        commandés. Ces informations sont aussi reprises dans le message WhatsApp que vous envoyez vous-même à ĆAAM, soumis aux conditions et à
        la politique de confidentialité de WhatsApp.
      </p>
      <p>
        <strong>Si vous créez un compte</strong> : adresse e-mail, mot de passe (enregistré chiffré, illisible par quiconque, ĆAAM compris),
        nom, téléphone et adresse de livraison si vous les renseignez, ainsi que l&apos;historique de vos commandes.
      </p>
      <p>Le site n&apos;utilise aucun outil de mesure d&apos;audience ni de publicité.</p>

      <h2>Utilisation</h2>
      <p>
        Vos données servent uniquement à traiter et livrer vos commandes, à gérer votre compte, à répondre à vos demandes et à respecter les
        obligations légales de ĆAAM, notamment comptables. Elles ne sont jamais vendues ni utilisées à des fins publicitaires.
      </p>

      <h2>Destinataires et hébergement</h2>
      <p>
        Seule ĆAAM a accès à vos données. Des prestataires techniques les hébergent, uniquement pour faire fonctionner le site : Supabase
        (base de données, serveurs en Irlande, Union européenne) et Vercel (hébergement du site). Les e-mails liés à votre compte, comme la
        réinitialisation du mot de passe, sont envoyés depuis la messagerie Gmail de ĆAAM.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les commandes sont conservées le temps de leur suivi, puis aussi longtemps que l&apos;exigent les obligations comptables. Votre
        compte est conservé jusqu&apos;à ce que vous demandiez sa suppression.
      </p>

      <h2>Cookies et stockage dans votre navigateur</h2>
      <p>
        Un cookie de session est déposé uniquement lorsque vous vous connectez à votre compte : il vous garde connecté(e) en toute sécurité.
        Le contenu de votre panier et votre devise d&apos;affichage sont conservés dans votre navigateur (stockage local) pour les retrouver
        à votre prochaine visite. Ces éléments sont strictement nécessaires au fonctionnement du site ; aucun cookie publicitaire ou de
        mesure d&apos;audience n&apos;est utilisé.
      </p>

      <h2>Sécurité</h2>
      <p>
        Les échanges avec le site sont chiffrés (HTTPS). L&apos;accès aux commandes et aux coordonnées des clients est réservé au compte du
        propriétaire de la boutique.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez à tout moment accéder à vos données, les corriger, demander leur suppression ou vous opposer à leur utilisation. Vos
        coordonnées se modifient directement dans <Link href="/compte">Mon compte</Link> ; pour toute autre demande, dont la suppression de
        votre compte, écrivez à <a href={`mailto:${contact.email}`}>{contact.email}</a>. ĆAAM vous répond dans un délai d&apos;un mois
        au plus.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir l&apos;autorité de protection des données compétente : au
        Sénégal, la Commission de protection des données personnelles (
        <a href="https://www.cdp.sn" target="_blank" rel="noopener noreferrer">
          CDP
        </a>
        ) ; dans l&apos;Union européenne, celle de votre pays, par exemple la{" "}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
          CNIL
        </a>{" "}
        en France.
      </p>
    </ContentPage>
  );
}

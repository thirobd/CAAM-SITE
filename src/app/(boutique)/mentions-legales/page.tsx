import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ui/content-page";
import { sellerName, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergement et propriété intellectuelle du site ĆAAM.",
};

export default function MentionsLegalesPage() {
  const { legal, hosting, contact } = site;
  // Lignes d'identité affichées seulement si ĆAAM les a renseignées (src/lib/site.ts).
  const identity = [
    ["Siège", legal.address],
    ["Immatriculation", legal.registration],
    ["Responsable de la publication", legal.publisher],
  ].filter(([, value]) => value);

  return (
    <ContentPage eyebrow="Informations légales" title="Mentions légales" intro={`Dernière mise à jour : ${site.legalUpdatedAt}.`}>
      <h2>Éditeur du site</h2>
      <p>
        Ce site est édité par <strong>{sellerName}</strong>, maison d&apos;extraits de parfum présente à Dakar (Sénégal) et en Europe.
        {identity.map(([label, value]) => (
          <span key={label}>
            <br />
            {label} : {value}
          </span>
        ))}
        <br />
        E-mail : <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <br />
        Téléphone et WhatsApp : {contact.phone}
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par <strong>{hosting.name}</strong>, {hosting.address} (
        <a href={hosting.url} target="_blank" rel="noopener noreferrer">
          vercel.com
        </a>
        ).
      </p>
      <p>
        Le catalogue, les commandes et les comptes clients sont enregistrés dans une base de données Supabase, sur des serveurs situés en
        Irlande (Union européenne).
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Le nom ĆAAM, le logo, les visuels des flacons, les photographies et l&apos;ensemble des textes de ce site sont la propriété de{" "}
        {sellerName}. Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite préalable est interdite.
      </p>

      <h2>Informations sur les produits</h2>
      <p>
        ĆAAM veille à l&apos;exactitude des prix, des disponibilités et des descriptions affichés. En cas d&apos;erreur, la confirmation de
        commande envoyée par ĆAAM sur WhatsApp fait foi. Les conditions de vente sont détaillées dans les{" "}
        <Link href="/cgv">conditions générales de vente</Link>, et le traitement de vos données dans la{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    </ContentPage>
  );
}

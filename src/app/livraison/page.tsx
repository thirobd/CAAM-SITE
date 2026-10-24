import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { shippingZones } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Livraison & retours",
  description: "Tarifs, délais de livraison dans le monde entier et politique de retour ĆAAM.",
};

export default function LivraisonPage() {
  return (
    <section className="section container container--narrow">
      <header className="page-head">
        <span className="eyebrow">Service client</span>
        <h1 className="display display--page">Livraison & retours</h1>
        <p className="lead">
          Chaque commande est préparée à la main et expédiée en colis suivi, partout dans le monde.
        </p>
      </header>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Destination</th>
            <th scope="col">Délai</th>
            <th scope="col">Tarif</th>
          </tr>
        </thead>
        <tbody>
          {shippingZones.map((z) => (
            <tr key={z.id}>
              <td>{z.label}</td>
              <td>
                {z.delay.min} à {z.delay.max} jours ouvrés
              </td>
              <td>
                {formatPrice(z.rate)}
                {z.freeFrom !== undefined && <span className="table__note">Offerte dès {formatPrice(z.freeFrom)}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="prose">
        <h2>Droits et taxes à l&apos;international</h2>
        <p>
          Pour les livraisons hors Union européenne, des droits de douane ou taxes locales peuvent être
          demandés à la réception du colis. Ils restent à la charge du destinataire.
        </p>

        <h2>Retours</h2>
        <p>
          Vous disposez de 14 jours après réception pour nous retourner un flacon non ouvert, dans son
          emballage d&apos;origine. Pour des raisons d&apos;hygiène, les flacons ouverts ne peuvent
          être ni repris ni échangés. Pour toute demande, <Link href="/contact">contactez-nous</Link>.
        </p>
      </div>
    </section>
  );
}

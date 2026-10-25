import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/ui/content-page";
import { formatXof } from "@/lib/currency";
import { deliveryZones } from "@/lib/delivery";

export const metadata: Metadata = {
  title: "Livraison & retours",
  description: "Délais et frais de livraison ĆAAM à Dakar, au Sénégal, en Europe et à l'international. Politique de retour.",
};

export default function LivraisonPage() {
  return (
    <ContentPage eyebrow="Service client" title="Livraison & retours" intro="Chaque commande est préparée avec soin et livrée dans un emballage protecteur.">
      <p className="text-sm italic">Tarifs et délais indicatifs de démonstration, à confirmer par ĆAAM.</p>

      <div>
        <table className="w-full border-collapse text-[15px]">
          <thead>
            <tr className="border-b border-ink text-left">
              <th scope="col" className="eyebrow pb-3 font-normal text-gold-deep">Destination</th>
              <th scope="col" className="eyebrow pb-3 font-normal text-gold-deep">Délai</th>
              <th scope="col" className="eyebrow pb-3 font-normal text-gold-deep">Frais</th>
            </tr>
          </thead>
          <tbody>
            {deliveryZones.map((z) => (
              <tr key={z.zone} className="border-b border-ink/10 text-ink">
                <td className="py-4 pr-4">{z.label}</td>
                <td className="py-4 pr-4">{z.delay}</td>
                <td className="py-4">{z.feeXof === null ? "Sur devis" : formatXof(z.feeXof)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Paiement</h2>
      <p>
        Au Sénégal, le paiement à la livraison est proposé. Le paiement par Mobile Money (Wave, Orange Money) et par carte bancaire sera disponible
        prochainement. <strong>Le paiement en ligne n&apos;est pas encore activé sur ce site.</strong>
      </p>

      <h2>Expéditions internationales</h2>
      <p>
        Pour l&apos;Europe et le reste du monde, les frais d&apos;expédition sont communiqués après la commande, selon la destination. Des droits de
        douane ou taxes locales peuvent s&apos;appliquer à réception et restent à la charge du destinataire.
      </p>

      <h2>Retours</h2>
      <p>
        Les flacons non ouverts, dans leur emballage d&apos;origine, peuvent être retournés sous 14 jours après réception. Pour des raisons
        d&apos;hygiène, les flacons ouverts ne sont ni repris ni échangés. Pour toute demande, <Link href="/contact">contactez-nous</Link>.
      </p>
    </ContentPage>
  );
}

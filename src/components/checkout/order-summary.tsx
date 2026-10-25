"use client";

import { ProductMedia } from "@/components/product/product-media";
import { useCurrency } from "@/components/providers/currency";
import type { CartLine } from "@/lib/cart/store";
import { formatXof } from "@/lib/currency";
import type { DeliveryEstimate } from "@/lib/delivery";

type Props = { lines: CartLine[]; subtotalXof: number; delivery: DeliveryEstimate };

export function OrderSummary({ lines, subtotalXof, delivery }: Props) {
  const { currency, format } = useCurrency();
  const totalXof = subtotalXof + (delivery.feeXof ?? 0);

  return (
    <aside className="bg-paper p-6 md:p-8" aria-label="Récapitulatif de la commande">
      <h2 className="font-serif text-3xl">Récapitulatif</h2>
      <ul className="mt-6 divide-y divide-ink/10">
        {lines.map((l) => (
          <li key={l.variantId} className="flex items-center gap-4 py-4">
            <div className="relative">
              <ProductMedia name={l.name} tint={l.tint} src={l.image} sizes="64px" className="aspect-[4/5] w-16" />
              <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-ink text-[10px] text-ivory">{l.quantity}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-xl leading-tight">{l.name}</p>
              <p className="text-[13px] text-stone">Extrait de parfum · {l.sizeMl} ml</p>
            </div>
            <span className="text-sm tabular-nums">{format(l.unitPriceXof * l.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-3 border-t border-ink/10 pt-5 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-stone">Sous-total</dt>
          <dd className="tabular-nums">{format(subtotalXof)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone">
            Livraison
            <span className="block text-xs">
              {delivery.label} · {delivery.delay}
            </span>
          </dt>
          <dd className="text-right tabular-nums">{delivery.feeXof === null ? "Sur devis" : format(delivery.feeXof)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-ink/10 pt-4">
          <dt className="eyebrow">Total</dt>
          <dd className="font-serif text-3xl tabular-nums lining-nums">{formatXof(totalXof)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-stone">
        Montants facturés en francs CFA.
        {currency === "EUR" && " Les montants en euros sont indicatifs (parité fixe 1 € = 655,957 FCFA)."}
        {delivery.feeXof === null && " Les frais d'expédition internationale vous seront communiqués avant tout paiement."}
      </p>
    </aside>
  );
}

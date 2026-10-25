"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { paymentMethods, type DemoOrder } from "@/lib/checkout";
import { formatXof } from "@/lib/currency";

export function OrderConfirmation({ order }: { order: DemoOrder }) {
  const firstName = order.customerName.split(/\s+/)[0];
  const payment = paymentMethods.find((m) => m.id === order.paymentMethod)?.label;

  return (
    <motion.div
      className="mx-auto max-w-2xl py-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="mx-auto grid size-16 place-items-center rounded-full bg-ink text-champagne"
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
      >
        <Check className="size-7" strokeWidth={1.25} />
      </motion.span>

      <p className="eyebrow mt-8 text-gold-deep">Commande de démonstration</p>
      <h1 className="mt-4 font-serif text-5xl font-light md:text-6xl">Merci, {firstName}.</h1>
      <p className="mt-5 text-stone">Votre référence de commande :</p>
      <p className="mt-2 font-serif text-3xl tracking-wide lining-nums md:text-4xl" data-testid="order-reference">
        {order.reference}
      </p>

      <div role="note" className="mx-auto mt-8 max-w-xl border border-warning/40 bg-warning/5 px-5 py-4 text-left text-sm leading-relaxed text-ink">
        <strong className="font-normal">Ceci est une démonstration.</strong> Aucune commande n&apos;a été transmise à ĆAAM, aucune donnée n&apos;a été
        enregistrée et aucun paiement n&apos;a été effectué.
      </div>

      <div className="mt-10 bg-paper p-6 text-left md:p-8">
        <ul className="divide-y divide-ink/10">
          {order.lines.map((l) => (
            <li key={`${l.name}-${l.sizeMl}`} className="flex justify-between gap-4 py-3 text-[15px]">
              <span>
                {l.name} · {l.sizeMl} ml <span className="text-stone">× {l.quantity}</span>
              </span>
              <span className="tabular-nums">{formatXof(l.unitPriceXof * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-2 border-t border-ink/10 pt-4 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-stone">Livraison ({order.city}, {order.countryLabel})</dt>
            <dd className="tabular-nums">{order.deliveryFeeXof === null ? "Sur devis" : formatXof(order.deliveryFeeXof)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone">Paiement choisi</dt>
            <dd>{payment}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
            <dt className="eyebrow">Total</dt>
            <dd className="font-serif text-2xl tabular-nums lining-nums">{formatXof(order.totalXof)}</dd>
          </div>
        </dl>
      </div>

      <ButtonLink href="/boutique" variant="ink" size="lg" className="mt-10">
        Retour à la boutique
      </ButtonLink>
    </motion.div>
  );
}

"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { WhatsAppIcon } from "@/components/brand/social-icons";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { orderMessage, paymentMethods, type Order } from "@/lib/checkout";
import { formatXof } from "@/lib/currency";
import { site, whatsappUrl } from "@/lib/site";

/** Dernière étape : la commande vérifiée est envoyée à ĆAAM par le client, via WhatsApp. */
export function OrderConfirmation({ order, onSend }: { order: Order; onSend: () => void }) {
  const [sent, setSent] = useState(false);
  const firstName = order.customerName.split(/\s+/)[0];
  const payment = paymentMethods.find((m) => m.id === order.paymentMethod)?.label;

  function handleSend() {
    setSent(true);
    onSend();
  }

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
        {sent ? <Check className="size-7" strokeWidth={1.25} /> : <WhatsAppIcon className="size-7" strokeWidth={1.1} />}
      </motion.span>

      <p className="eyebrow mt-8 text-gold-deep">{sent ? "Message prêt" : "Dernière étape"}</p>
      <h1 className="mt-4 font-serif text-5xl font-light md:text-6xl">
        {sent ? `Merci, ${firstName}.` : `Envoyez votre commande, ${firstName}.`}
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-stone">
        {sent
          ? "Envoyez le message dans WhatsApp : ĆAAM vous répond pour confirmer la disponibilité, le paiement et la livraison."
          : "Votre commande est vérifiée. Ouvrez WhatsApp : le message est déjà rédigé, il ne vous reste qu'à l'envoyer."}
      </p>
      <p className="mt-6 text-stone">Référence de commande :</p>
      <p className="mt-2 font-serif text-3xl tracking-wide lining-nums md:text-4xl" data-testid="order-reference">
        {order.reference}
      </p>

      <div className="mt-8">
        <a
          href={whatsappUrl(orderMessage(order))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSend}
          className={buttonClasses(sent ? "outline-dark" : "ink", "lg")}
        >
          <WhatsAppIcon className="size-4" /> {sent ? "Rouvrir WhatsApp" : "Envoyer sur WhatsApp"}
        </a>
      </div>

      <div role="note" className="mx-auto mt-8 max-w-xl border border-ink/15 bg-paper px-5 py-4 text-left text-sm leading-relaxed text-ink">
        Votre commande n&apos;est transmise à ĆAAM qu&apos;une fois le message <strong className="font-normal">envoyé dans WhatsApp</strong>. Aucun
        paiement n&apos;a été effectué sur ce site. WhatsApp ne s&apos;ouvre pas ? Écrivez au {site.contact.phone} en indiquant la référence{" "}
        {order.reference}.
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
            <dt className="text-stone">Paiement souhaité</dt>
            <dd>{payment}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
            <dt className="eyebrow">Total</dt>
            <dd className="font-serif text-2xl tabular-nums lining-nums">{formatXof(order.totalXof)}</dd>
          </div>
        </dl>
      </div>

      <ButtonLink href="/boutique" variant="outline-dark" size="lg" className="mt-10">
        Retour à la boutique
      </ButtonLink>
    </motion.div>
  );
}

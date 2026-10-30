"use client";

import { LoaderCircle, MapPin, Phone } from "lucide-react";
import { useState, useTransition } from "react";
import { WhatsAppIcon } from "@/components/brand/social-icons";
import { inputClass } from "@/components/checkout/field";
import { buttonClasses } from "@/components/ui/button";
import { customerWhatsappUrl, orderStatuses, type AdminOrder, type OrderStatus } from "@/lib/admin/orders";
import { paymentMethods } from "@/lib/checkout";
import { formatMoney, formatXof } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { saveOrderNote, setOrderStatus } from "@/server/admin/orders";
import { LocalDate } from "./local-date";

const statusTone: Record<OrderStatus, string> = {
  nouvelle: "border-champagne bg-champagne/25 text-ink",
  confirmee: "border-success/50 bg-success/10 text-success",
  livree: "border-ink/30 bg-ink/5 text-ink",
  annulee: "border-danger/40 bg-danger/10 text-danger",
};

export function OrderCard({ order }: { order: AdminOrder }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [note, setNote] = useState(order.admin_note);
  const [savedNote, setSavedNote] = useState(order.admin_note);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const whatsapp = customerWhatsappUrl(order);
  const payment = paymentMethods.find((m) => m.id === order.payment_method)?.label ?? order.payment_method;

  function changeStatus(next: OrderStatus) {
    if (next === status) return;
    const previous = status;
    setStatus(next);
    setMessage(null);
    startTransition(async () => {
      const result = await setOrderStatus(order.id, next);
      if (!result.ok) {
        setStatus(previous);
        setMessage(result.message);
      }
    });
  }

  function saveNote() {
    startTransition(async () => {
      const result = await saveOrderNote(order.id, note);
      if (result.ok) setSavedNote(note);
      else setMessage(result.message);
    });
  }

  return (
    <article className="border border-ink/15 bg-paper">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink/10 px-5 py-4">
        <div>
          <p className="font-serif text-2xl tracking-wide lining-nums">{order.reference}</p>
          <p className="text-[13px] text-stone">
            <LocalDate iso={order.created_at} /> · {order.customer_name}
          </p>
        </div>
        <span className={cn("border px-3 py-1 text-[11px] uppercase tracking-[0.18em]", statusTone[status])}>
          {orderStatuses.find((s) => s.id === status)?.label}
        </span>
      </header>

      <div className="grid gap-6 px-5 py-5 md:grid-cols-2">
        <div className="space-y-2 text-[14px]">
          <p className="flex items-start gap-2">
            <Phone className="mt-0.5 size-4 shrink-0 text-gold-deep" strokeWidth={1.25} aria-hidden="true" />
            <a href={`tel:${order.phone.replace(/[^\d+]/g, "")}`} className="underline-offset-4 hover:underline">
              {order.phone}
            </a>
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-gold-deep" strokeWidth={1.25} aria-hidden="true" />
            <span>
              {order.address}, {order.city}, {order.country}
            </span>
          </p>
          {order.notes && <p className="text-stone">Instructions : {order.notes}</p>}
          <p className="text-stone">Paiement souhaité : {payment}</p>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={cn(buttonClasses("outline-dark"), "mt-2")}>
              <WhatsAppIcon className="size-4" /> Écrire au client
            </a>
          )}
        </div>

        <div>
          <ul className="divide-y divide-ink/10 text-[14px]">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-2">
                <span>
                  {item.product_name} · {item.size_ml} ml <span className="text-stone">× {item.quantity}</span>
                </span>
                <span className="tabular-nums">{formatXof(item.unit_price_xof * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-2 space-y-1 border-t border-ink/10 pt-3 text-[14px]">
            <div className="flex justify-between text-stone">
              <dt>Livraison{order.delivery_label && ` (${order.delivery_label})`}</dt>
              <dd className="tabular-nums">{order.delivery_fee_xof === null ? "Sur devis" : formatXof(order.delivery_fee_xof)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="eyebrow">Total</dt>
              <dd className="font-serif text-xl tabular-nums lining-nums">
                {formatXof(order.total_xof)} <span className="font-sans text-[12px] text-stone">≈ {formatMoney(order.total_xof, "EUR")}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <footer className="space-y-4 border-t border-ink/10 px-5 py-4">
        <div>
          <p className="mb-2 text-[12px] text-stone">Statut</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={`Statut de la commande ${order.reference}`}>
            {orderStatuses.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => changeStatus(s.id)}
                disabled={pending}
                aria-pressed={status === s.id}
                title={s.hint}
                className={cn(
                  "inline-flex h-10 items-center gap-2 border px-4 text-[12px] uppercase tracking-[0.16em] transition-colors disabled:cursor-wait",
                  status === s.id ? "border-ink bg-ink text-ivory" : "border-ink/20 hover:border-ink",
                )}
              >
                {pending && status === s.id && <LoaderCircle className="size-3.5 animate-spin" strokeWidth={1.5} aria-hidden="true" />}
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-stone">{orderStatuses.find((s) => s.id === status)?.hint}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1.5 text-[12px] text-stone">
            Note interne (visible uniquement ici)
            <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} className={cn(inputClass, "h-11 border-ink/20")} />
          </label>
          <button
            type="button"
            onClick={saveNote}
            disabled={pending || note === savedNote}
            className="inline-flex h-11 items-center justify-center bg-ink px-4 text-[11px] uppercase tracking-[0.2em] text-ivory hover:bg-gold-deep disabled:opacity-35"
          >
            Enregistrer la note
          </button>
        </div>
        {message && (
          <p role="alert" className="text-sm text-danger">
            {message}
          </p>
        )}
      </footer>
    </article>
  );
}

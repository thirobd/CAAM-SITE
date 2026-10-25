"use client";

import { AlertCircle, Banknote, CreditCard, Info, LoaderCircle, ShoppingBag, Smartphone } from "lucide-react";
import { useState, useTransition } from "react";
import { useCart } from "@/components/providers/cart";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  emptyCheckout,
  paymentMethods,
  validateCheckout,
  type CheckoutFields,
  type DemoOrder,
  type FieldErrors,
  type PaymentMethod,
} from "@/lib/checkout";
import { countries, estimateDelivery } from "@/lib/delivery";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { placeDemoOrder } from "@/server/orders";
import { Field } from "./field";
import { OrderConfirmation } from "./order-confirmation";
import { OrderSummary } from "./order-summary";

const paymentIcons: Record<PaymentMethod, React.ElementType> = {
  cash: Banknote,
  "mobile-money": Smartphone,
  card: CreditCard,
};

const fieldOrder: (keyof CheckoutFields)[] = ["fullName", "phone", "country", "city", "address", "notes", "paymentMethod"];

export function CheckoutView() {
  const { lines, subtotalXof, clear } = useCart();
  const [fields, setFields] = useState<CheckoutFields>(emptyCheckout);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [pending, startTransition] = useTransition();
  const hydrated = useHydrated();

  const delivery = estimateDelivery(fields.country, fields.city);

  function set<K extends keyof CheckoutFields>(key: K, value: CheckoutFields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
    setFormError(null);
    // Le mode de paiement dépend du pays (paiement à la livraison réservé au Sénégal).
    const stale: (keyof CheckoutFields)[] = key === "country" ? [key, "paymentMethod"] : [key];
    if (stale.some((k) => errors[k])) {
      setErrors((prev) => {
        const next = { ...prev };
        stale.forEach((k) => delete next[k]);
        return next;
      });
    }
  }

  function focusFirstError(errs: FieldErrors) {
    const first = fieldOrder.find((k) => errs[k]);
    if (first) document.getElementById(first === "paymentMethod" ? "payment-cash" : `checkout-${first}`)?.focus();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const errs = validateCheckout(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setFormError("Merci de compléter les champs indiqués.");
      focusFirstError(errs);
      return;
    }
    startTransition(async () => {
      try {
        const result = await placeDemoOrder(
          fields,
          lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        );
        if (result.ok) {
          setOrder(result.order);
          clear();
          window.scrollTo({ top: 0 });
        } else {
          setErrors(result.fieldErrors ?? {});
          setFormError(result.message);
          if (result.fieldErrors) focusFirstError(result.fieldErrors);
        }
      } catch {
        setFormError("Une erreur est survenue. Vérifiez votre connexion et réessayez.");
      }
    });
  }

  if (order) return <OrderConfirmation order={order} />;

  // Le panier vit dans le navigateur : on attend de l'avoir lu avant de conclure qu'il est vide.
  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]" aria-busy="true" aria-label="Chargement de votre panier">
        <div className="space-y-5">
          <div className="h-14 w-64 animate-pulse bg-ink/10" />
          <div className="h-12 animate-pulse bg-ink/5" />
          <div className="h-12 animate-pulse bg-ink/5" />
          <div className="h-12 animate-pulse bg-ink/5" />
        </div>
        <div className="h-80 animate-pulse bg-ink/5" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-20 text-center">
        <ShoppingBag className="size-10 text-gold" strokeWidth={1} aria-hidden="true" />
        <h1 className="font-serif text-4xl">Votre panier est vide</h1>
        <p className="text-stone">Ajoutez un parfum pour passer commande.</p>
        <ButtonLink href="/boutique" variant="ink" size="lg">
          Découvrir la collection
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-serif text-5xl font-light md:text-6xl">Commande</h1>
      <div role="note" className="mt-6 flex gap-3 border border-warning/40 bg-warning/5 px-5 py-4 text-sm leading-relaxed">
        <Info className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.5} aria-hidden="true" />
        <p>
          <strong className="font-normal">Version de démonstration.</strong> Le paiement en ligne n&apos;est pas encore connecté : aucune commande ne sera
          transmise et aucune somme ne sera débitée.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <form onSubmit={submit} noValidate className="space-y-12" aria-describedby={formError ? "checkout-form-error" : undefined}>
          <fieldset className="space-y-5">
            <legend className="eyebrow mb-5 text-gold-deep">1 · Coordonnées</legend>
            <Field id="checkout-fullName" label="Nom complet" required error={errors.fullName}>
              {(p) => (
                <input {...p} className={cn(p.className, "h-12")} autoComplete="name" value={fields.fullName} onChange={(e) => set("fullName", e.target.value)} />
              )}
            </Field>
            <Field id="checkout-phone" label="Téléphone" required error={errors.phone} hint="Avec l'indicatif pays, ex. +221 77 123 45 67">
              {(p) => (
                <input {...p} className={cn(p.className, "h-12")} type="tel" autoComplete="tel" inputMode="tel" value={fields.phone} onChange={(e) => set("phone", e.target.value)} />
              )}
            </Field>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="eyebrow mb-5 text-gold-deep">2 · Livraison</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="checkout-country" label="Pays" required error={errors.country}>
                {(p) => (
                  <select {...p} className={cn(p.className, "h-12")} autoComplete="country" value={fields.country} onChange={(e) => set("country", e.target.value)}>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field id="checkout-city" label="Ville" required error={errors.city}>
                {(p) => (
                  <input {...p} className={cn(p.className, "h-12")} autoComplete="address-level2" value={fields.city} onChange={(e) => set("city", e.target.value)} />
                )}
              </Field>
            </div>
            <Field id="checkout-address" label="Adresse" required error={errors.address} hint="Quartier, rue, numéro, points de repère">
              {(p) => (
                <input {...p} className={cn(p.className, "h-12")} autoComplete="street-address" value={fields.address} onChange={(e) => set("address", e.target.value)} />
              )}
            </Field>
            <Field id="checkout-notes" label="Instructions de livraison" error={errors.notes}>
              {(p) => (
                <textarea {...p} className={cn(p.className, "min-h-28 py-3")} maxLength={500} value={fields.notes} onChange={(e) => set("notes", e.target.value)} />
              )}
            </Field>
          </fieldset>

          <fieldset aria-describedby={errors.paymentMethod ? "payment-error" : undefined}>
            <legend className="eyebrow mb-5 text-gold-deep">3 · Paiement</legend>
            <div className="space-y-3" role="radiogroup" aria-required="true" aria-invalid={!!errors.paymentMethod}>
              {paymentMethods.map((m) => {
                const Icon = paymentIcons[m.id];
                const selected = fields.paymentMethod === m.id;
                return (
                  <label
                    key={m.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-4 border px-5 py-4 transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2",
                      selected ? "border-ink bg-paper" : errors.paymentMethod ? "border-danger/60" : "border-ink/20 hover:border-ink/50",
                    )}
                  >
                    <input
                      id={`payment-${m.id}`}
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={selected}
                      onChange={() => set("paymentMethod", m.id)}
                      className="mt-1 accent-ink"
                    />
                    <Icon className="mt-0.5 size-5 shrink-0 text-gold-deep" strokeWidth={1.25} aria-hidden="true" />
                    <span>
                      <span className="block text-[15px]">{m.label}</span>
                      <span className="block text-[13px] text-stone">{m.detail}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.paymentMethod && (
              <p id="payment-error" className="mt-3 text-sm text-danger">
                {errors.paymentMethod}
              </p>
            )}
          </fieldset>

          <div className="space-y-4">
            {formError && (
              <p id="checkout-form-error" role="alert" className="flex items-start gap-3 bg-danger/10 px-4 py-3 text-sm text-danger">
                <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {formError}
              </p>
            )}
            <Button type="submit" variant="ink" size="lg" full disabled={pending}>
              {pending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" /> Validation en cours…
                </>
              ) : (
                "Valider la commande (démo)"
              )}
            </Button>
            <p className="text-center text-xs text-stone">Aucun paiement ne sera demandé à cette étape.</p>
          </div>
        </form>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary lines={lines} subtotalXof={subtotalXof} delivery={delivery} />
        </div>
      </div>
    </>
  );
}

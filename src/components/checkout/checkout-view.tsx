"use client";

import Link from "next/link";
import { AlertCircle, Banknote, CreditCard, LoaderCircle, ShoppingBag, Smartphone, User } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { WhatsAppIcon } from "@/components/brand/social-icons";
import { useCart } from "@/components/providers/cart";
import { Button, ButtonLink } from "@/components/ui/button";
import type { CustomerProfile } from "@/lib/account";
import {
  emptyCheckout,
  paymentMethods,
  validateCheckout,
  type CheckoutFields,
  type FieldErrors,
  type Order,
  type PaymentMethod,
} from "@/lib/checkout";
import { countries, estimateDelivery } from "@/lib/delivery";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";
import { getCheckoutProfile } from "@/server/account";
import { placeOrder } from "@/server/orders";
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
  const [order, setOrder] = useState<Order | null>(null);
  const [pending, startTransition] = useTransition();
  const hydrated = useHydrated();
  // Client connecté : ses coordonnées enregistrées pré-remplissent les champs encore vides.
  const [account, setAccount] = useState<CustomerProfile | null>(null);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    let active = true;
    getCheckoutProfile()
      .then((profile) => {
        if (!active || !profile) return;
        setAccount(profile);
        setFields((f) => ({
          ...f,
          fullName: f.fullName || profile.fullName,
          phone: f.phone || profile.phone,
          country: f.city || f.address ? f.country : profile.country || f.country,
          city: f.city || profile.city,
          address: f.address || profile.address,
        }));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
        const result = await placeOrder(
          fields,
          lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
          account !== null && remember,
        );
        if (result.ok) {
          // Le panier est vidé seulement quand le client ouvre WhatsApp pour envoyer la commande.
          setOrder(result.order);
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

  if (order) return <OrderConfirmation order={order} onSend={clear} />;

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
      <div role="note" className="mt-6 flex gap-3 border border-ink/15 bg-paper px-5 py-4 text-sm leading-relaxed">
        <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-gold-deep" />
        <p>
          <strong className="font-normal">Commande par WhatsApp.</strong> Après vérification, votre commande s&apos;ouvre dans WhatsApp, déjà rédigée :
          il vous suffit de l&apos;envoyer. ĆAAM vous répond pour confirmer la disponibilité, le paiement et la livraison. Aucun paiement n&apos;est
          demandé sur ce site.
        </p>
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-stone">
        <User className="size-4 shrink-0 text-gold-deep" strokeWidth={1.25} aria-hidden="true" />
        {account ? (
          <span>
            Connecté : {account.email}. La commande sera ajoutée à <Link href="/compte" className="underline underline-offset-4">votre compte</Link>.
          </span>
        ) : (
          <span>
            Vous avez un compte ?{" "}
            <Link href="/compte?suite=/commande" className="text-ink underline underline-offset-4">
              Connectez-vous
            </Link>{" "}
            pour retrouver vos coordonnées et suivre vos commandes.
          </span>
        )}
      </p>

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
            {account && (
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-ink" />
                Mémoriser ces coordonnées dans mon compte
              </label>
            )}
            {formError && (
              <p id="checkout-form-error" role="alert" className="flex items-start gap-3 bg-danger/10 px-4 py-3 text-sm text-danger">
                <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                {formError}
              </p>
            )}
            <Button type="submit" variant="ink" size="lg" full disabled={pending}>
              {pending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" /> Vérification en cours…
                </>
              ) : (
                "Continuer vers WhatsApp"
              )}
            </Button>
            <p className="text-center text-xs text-stone">Vous relirez votre commande avant de l&apos;envoyer.</p>
          </div>
        </form>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary lines={lines} subtotalXof={subtotalXof} delivery={delivery} />
        </div>
      </div>
    </>
  );
}

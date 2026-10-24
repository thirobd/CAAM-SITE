"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BottleArt } from "@/components/BottleArt";
import { MAX_QUANTITY } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { getZone, shippingCost, shippingZones } from "@/lib/shipping";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { lines, count, subtotal, zoneId, setZoneId, setQuantity, remove, isOpen, close } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const zone = getZone(zoneId) ?? shippingZones[0];
  const shipping = shippingCost(zone, subtotal);
  const remainingForFree = zone.freeFrom !== undefined ? zone.freeFrom - subtotal : null;

  useEffect(() => {
    if (!isOpen) return;
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  async function checkout() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map(({ slug, variantId, quantity }) => ({ slug, variantId, quantity })),
          zone: zoneId,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Le paiement n'a pas pu démarrer.");
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Le paiement n'a pas pu démarrer.");
      setPending(false);
    }
  }

  return (
    <div className={`drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen} inert={!isOpen}>
      <div className="drawer__backdrop" onClick={close} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Votre panier">
        <header className="drawer__header">
          <h2 className="drawer__title">
            Panier <span className="drawer__count">({count})</span>
          </h2>
          <button ref={closeButton} className="icon-button" onClick={close} aria-label="Fermer le panier">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Votre panier est vide.</p>
            <Link href="/boutique" className="button button--outline" onClick={close}>
              Découvrir la collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer__lines">
              {lines.map((line) => (
                <li key={line.variantId} className="cart-line">
                  <div className="cart-line__visual">
                    <BottleArt tint={line.product.tint} />
                  </div>
                  <div className="cart-line__info">
                    <Link href={`/parfums/${line.slug}`} className="cart-line__name" onClick={close}>
                      {line.product.name}
                    </Link>
                    <span className="cart-line__meta">Eau de parfum · {line.variant.volumeMl} ml</span>
                    <div className="cart-line__actions">
                      <div className="stepper">
                        <button
                          onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                          aria-label={`Retirer un ${line.product.name}`}
                        >
                          −
                        </button>
                        <span aria-live="polite">{line.quantity}</span>
                        <button
                          onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                          disabled={line.quantity >= MAX_QUANTITY}
                          aria-label={`Ajouter un ${line.product.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button className="link-button" onClick={() => remove(line.variantId)}>
                        Retirer
                      </button>
                    </div>
                  </div>
                  <span className="cart-line__price">{formatPrice(line.variant.price * line.quantity)}</span>
                </li>
              ))}
            </ul>

            <footer className="drawer__footer">
              <fieldset className="zone-picker">
                <legend>Livraison</legend>
                {shippingZones.map((z) => (
                  <label key={z.id} className="zone-picker__option">
                    <input
                      type="radio"
                      name="zone"
                      value={z.id}
                      checked={zoneId === z.id}
                      onChange={() => setZoneId(z.id)}
                    />
                    <span>{z.label}</span>
                    <span className="zone-picker__price">
                      {shippingCost(z, subtotal) === 0 ? "Offerte" : formatPrice(z.rate)}
                    </span>
                  </label>
                ))}
              </fieldset>

              {remainingForFree !== null && remainingForFree > 0 && (
                <p className="drawer__hint">
                  Plus que {formatPrice(remainingForFree)} pour profiter de la livraison offerte.
                </p>
              )}

              <dl className="totals">
                <div>
                  <dt>Sous-total</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div>
                  <dt>Livraison</dt>
                  <dd>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</dd>
                </div>
                <div className="totals__grand">
                  <dt>Total</dt>
                  <dd>{formatPrice(subtotal + shipping)}</dd>
                </div>
              </dl>

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <button className="button button--full" onClick={checkout} disabled={pending}>
                {pending ? "Redirection…" : "Passer au paiement"}
              </button>
              <p className="drawer__secure">Paiement sécurisé par Stripe · Carte, Apple Pay, Google Pay</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

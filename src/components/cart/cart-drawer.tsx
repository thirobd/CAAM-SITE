"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { ProductMedia } from "@/components/product/product-media";
import { useCart } from "@/components/providers/cart";
import { Price, useCurrency } from "@/components/providers/currency";
import { ButtonLink } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatXof } from "@/lib/currency";

const ease = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const { lines, count, subtotalXof, isOpen, closeCart, setQuantity, remove } = useCart();
  const { currency } = useCurrency();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
      // Garde le focus clavier à l'intérieur du panier.
      if (e.key === "Tab" && panel.current) {
        const focusables = panel.current.querySelectorAll<HTMLElement>("a[href], button:not(:disabled), input, select");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-ivory shadow-2xl outline-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease }}
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 id="cart-title" className="font-serif text-2xl">
                Votre panier <span className="text-lg text-stone lining-nums">({count})</span>
              </h2>
              <button type="button" onClick={closeCart} className="grid size-10 place-items-center" aria-label="Fermer le panier">
                <X className="size-5" strokeWidth={1.25} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <ShoppingBag className="size-9 text-gold" strokeWidth={1} aria-hidden="true" />
                <p className="font-serif text-2xl">Votre panier est vide</p>
                <p className="text-stone">Laissez-vous guider par nos signatures olfactives.</p>
                <ButtonLink href="/boutique" variant="ink" onClick={closeCart}>
                  Découvrir la collection
                </ButtonLink>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.variantId}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
                        transition={{ duration: 0.45, ease }}
                        className="grid grid-cols-[80px_1fr_auto] gap-4 border-b border-ink/10 py-5"
                      >
                        <ProductMedia name={line.name} tint={line.tint} src={line.image} sizes="80px" className="aspect-[4/5]" />
                        <div className="flex min-w-0 flex-col">
                          <Link href={`/parfums/${line.slug}`} onClick={closeCart} className="font-serif text-xl leading-tight hover:text-gold-deep">
                            {line.name}
                          </Link>
                          <span className="text-[13px] text-stone">Extrait de parfum · {line.sizeMl} ml</span>
                          <div className="mt-auto flex items-center gap-4 pt-3">
                            <QuantityStepper
                              size="sm"
                              value={line.quantity}
                              max={line.maxQuantity}
                              min={1}
                              onChange={(q) => setQuantity(line.variantId, q)}
                              label={`Quantité de ${line.name}`}
                            />
                            <button
                              type="button"
                              onClick={() => remove(line.variantId)}
                              className="grid size-8 place-items-center text-stone hover:text-danger"
                              aria-label={`Retirer ${line.name} du panier`}
                            >
                              <Trash2 className="size-4" strokeWidth={1.25} />
                            </button>
                          </div>
                        </div>
                        <Price amountXof={line.unitPriceXof * line.quantity} className="text-sm" />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="space-y-4 border-t border-ink/10 bg-paper px-6 pb-6 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow text-stone">Sous-total</span>
                    <Price amountXof={subtotalXof} className="font-serif text-2xl" />
                  </div>
                  {currency === "EUR" && (
                    <p className="text-xs text-stone">
                      Montant facturé : {formatXof(subtotalXof)}. Conversion en euros indicative (parité fixe).
                    </p>
                  )}
                  <p className="text-[13px] text-stone">Frais de livraison calculés à l&apos;étape suivante.</p>
                  <ButtonLink href="/commande" variant="ink" size="lg" full onClick={closeCart}>
                    Passer commande
                  </ButtonLink>
                  <button type="button" onClick={closeCart} className="w-full text-center text-[13px] text-stone underline underline-offset-4 hover:text-ink">
                    Continuer mes achats
                  </button>
                </footer>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

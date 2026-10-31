"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Banknote, Check, Globe, Truck } from "lucide-react";
import { useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/brand/social-icons";
import { useCart } from "@/components/providers/cart";
import { Price, useCurrency } from "@/components/providers/currency";
import { Button, buttonClasses } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { defaultVariant, isAvailable, maxOrderable, stockStatus } from "@/lib/catalog/stock";
import type { Product } from "@/lib/catalog/types";
import { formatXof } from "@/lib/currency";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { StockBadge } from "./stock-badge";

export function ProductPurchase({ product }: { product: Product }) {
  const { add, quantityOf } = useCart();
  const { currency } = useCurrency();
  const [variantId, setVariantId] = useState(() => defaultVariant(product).id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const remaining = Math.max(0, maxOrderable(variant) - quantityOf(variant.id));
  const out = variant.stock <= 0;
  const qty = Math.max(1, Math.min(quantity, remaining || 1));

  // Commande ou demande de disponibilité par WhatsApp, message prérempli avec le choix en cours.
  const whatsappLink = (
    <a
      href={whatsappUrl(
        out
          ? `Bonjour ĆAAM, je souhaite être prévenu(e) du retour de ${product.name} (${variant.sizeMl} ml).`
          : `Bonjour ĆAAM, je souhaite commander ${qty} × ${product.name} (${variant.sizeMl} ml).`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses("outline-dark", "lg", true)}
    >
      <WhatsAppIcon className="size-4" /> {out ? "Demander sur WhatsApp" : "Commander sur WhatsApp"}
    </a>
  );

  function selectVariant(id: string) {
    setVariantId(id);
    setQuantity(1);
  }

  function handleAdd() {
    if (add(product, variant, qty) > 0) {
      setQuantity(1);
      setAdded(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setAdded(false), 2200);
    }
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="flex items-baseline gap-3">
          <Price amountXof={variant.priceXof} className="font-serif text-4xl" />
          <span className="text-sm text-stone">{variant.sizeMl} ml</span>
        </div>
        {currency === "EUR" && <p className="mt-1 text-xs text-stone">Facturé {formatXof(variant.priceXof)} · conversion indicative</p>}
      </div>

      <fieldset>
        <legend className="eyebrow text-gold-deep">Contenance</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {product.variants.map((v) => {
            const selected = v.id === variant.id;
            const vOut = stockStatus(v.stock) === "out";
            return (
              <label
                key={v.id}
                className={cn(
                  "relative flex cursor-pointer flex-col gap-1 border px-4 py-4 transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2",
                  selected ? "border-ink bg-paper" : "border-ink/20 hover:border-ink/60",
                )}
              >
                <input type="radio" name="variant" value={v.id} checked={selected} onChange={() => selectVariant(v.id)} className="sr-only" />
                <span className={cn("font-serif text-2xl leading-none", vOut && "text-stone line-through decoration-1")}>{v.sizeMl} ml</span>
                <Price amountXof={v.priceXof} className="text-sm text-stone" />
                {vOut && <span className="text-xs text-stone">Épuisé</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      <StockBadge stock={variant.stock} />

      {out ? (
        <div className="space-y-3">
          <Button variant="ink" size="lg" full disabled>
            Épuisé
          </Button>
          {whatsappLink}
          <p className="text-sm text-stone">
            {isAvailable(product)
              ? "Cette contenance est épuisée. Essayez l'autre format."
              : "Ce parfum est momentanément épuisé. Il sera bientôt de retour."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-3">
            <QuantityStepper value={qty} max={Math.max(1, remaining)} onChange={setQuantity} label="Quantité" />
            <Button variant="ink" size="lg" full onClick={handleAdd} disabled={remaining === 0} className="relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={added ? "added" : "add"}
                  className="inline-flex items-center gap-3"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {added ? (
                    <>
                      <Check className="size-4" strokeWidth={1.5} /> Ajouté au panier
                    </>
                  ) : (
                    "Ajouter au panier"
                  )}
                </m.span>
              </AnimatePresence>
            </Button>
          </div>
          {whatsappLink}
          {remaining === 0 && <p className="text-sm text-stone">Vous avez déjà la quantité maximale disponible dans votre panier.</p>}
        </div>
      )}

      <ul className="space-y-3 border-t border-ink/10 pt-6 text-sm text-stone">
        <li className="flex items-center gap-3">
          <Truck className="size-4 text-gold-deep" strokeWidth={1.25} aria-hidden="true" /> Livraison à Dakar en 24 à 48 h
        </li>
        <li className="flex items-center gap-3">
          <Banknote className="size-4 text-gold-deep" strokeWidth={1.25} aria-hidden="true" /> Paiement à la livraison au Sénégal
        </li>
        <li className="flex items-center gap-3">
          <Globe className="size-4 text-gold-deep" strokeWidth={1.25} aria-hidden="true" /> Expédition en Europe et à l&apos;international sur devis
        </li>
      </ul>
    </div>
  );
}

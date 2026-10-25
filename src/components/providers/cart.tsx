"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { cartStore, type CartLine } from "@/lib/cart/store";
import { maxOrderable } from "@/lib/catalog/stock";
import type { Product, Variant } from "@/lib/catalog/types";

type CartUI = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** Incrémenté à chaque ajout : déclenche l'animation du compteur. */
  pulse: number;
  notifyAdded: () => void;
};

const CartUIContext = createContext<CartUI | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  const value = useMemo<CartUI>(
    () => ({
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      pulse,
      notifyAdded: () => {
        setPulse((p) => p + 1);
        setIsOpen(true);
      },
    }),
    [isOpen, pulse],
  );

  return <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>;
}

export function useCart() {
  const ui = useContext(CartUIContext);
  if (!ui) throw new Error("useCart doit être utilisé dans <CartProvider>");
  const lines: CartLine[] = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const { notifyAdded } = ui;

  const add = useCallback(
    (product: Product, variant: Variant, quantity: number) => {
      const added = cartStore.add(
        {
          variantId: variant.id,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          sizeMl: variant.sizeMl,
          unitPriceXof: variant.priceXof,
          maxQuantity: maxOrderable(variant),
          tint: product.tint,
          image: product.images[0],
        },
        quantity,
      );
      if (added > 0) notifyAdded();
      return added;
    },
    [notifyAdded],
  );

  return {
    ...ui,
    lines,
    count: lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotalXof: lines.reduce((sum, l) => sum + l.quantity * l.unitPriceXof, 0),
    quantityOf: (variantId: string) => lines.find((l) => l.variantId === variantId)?.quantity ?? 0,
    add,
    setQuantity: cartStore.setQuantity,
    remove: cartStore.remove,
    clear: cartStore.clear,
  };
}

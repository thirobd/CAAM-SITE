"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { findVariant, MAX_QUANTITY, type Product, type Variant } from "@/lib/catalog";
import type { ShippingZone } from "@/lib/shipping";

export type CartLine = { slug: string; variantId: string; quantity: number };
export type ResolvedLine = CartLine & { product: Product; variant: Variant };

const STORAGE_KEY = "caam-cart-v1";

type CartContextValue = {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  zoneId: ShippingZone["id"];
  isOpen: boolean;
  add: (slug: string, variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  setZoneId: (zone: ShippingZone["id"]) => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

type Stored = { lines: CartLine[]; zoneId: ShippingZone["id"] };

function readStorage(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

function writeStorage(value: Stored) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Stockage indisponible (navigation privée…) : le panier reste en mémoire.
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawLines, setRawLines] = useState<CartLine[]>([]);
  const [zoneId, setZoneId] = useState<ShippingZone["id"]>("france");
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage();
    if (stored) {
      setRawLines(Array.isArray(stored.lines) ? stored.lines : []);
      if (stored.zoneId) setZoneId(stored.zoneId);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage({ lines: rawLines, zoneId });
  }, [rawLines, zoneId, hydrated]);

  // Les lignes dont le parfum n'existe plus dans le catalogue sont ignorées.
  const lines = useMemo(
    () =>
      rawLines.flatMap((line) => {
        const found = findVariant(line.slug, line.variantId);
        return found ? [{ ...line, ...found }] : [];
      }),
    [rawLines],
  );

  const add = useCallback((slug: string, variantId: string, quantity = 1) => {
    setRawLines((current) => {
      const existing = current.find((l) => l.variantId === variantId);
      if (existing) {
        return current.map((l) =>
          l.variantId === variantId
            ? { ...l, quantity: Math.min(MAX_QUANTITY, l.quantity + quantity) }
            : l,
        );
      }
      return [...current, { slug, variantId, quantity: Math.min(MAX_QUANTITY, quantity) }];
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setRawLines((current) =>
      quantity <= 0
        ? current.filter((l) => l.variantId !== variantId)
        : current.map((l) =>
            l.variantId === variantId ? { ...l, quantity: Math.min(MAX_QUANTITY, quantity) } : l,
          ),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setRawLines((current) => current.filter((l) => l.variantId !== variantId));
  }, []);

  // Écrit aussi le stockage tout de suite : appelé au montage (page de confirmation),
  // l'effet de relecture ci-dessus ne doit pas restaurer l'ancien panier.
  const clear = useCallback(() => {
    setRawLines([]);
    const stored = readStorage();
    if (stored) writeStorage({ ...stored, lines: [] });
  }, []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: lines.reduce((sum, l) => sum + l.quantity * l.variant.price, 0),
      zoneId,
      isOpen,
      add,
      setQuantity,
      remove,
      clear,
      setZoneId,
      open,
      close,
    }),
    [lines, zoneId, isOpen, add, setQuantity, remove, clear, open, close],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}

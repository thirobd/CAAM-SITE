import type { Product, Variant } from "./types";

/** En dessous (ou égal) de ce seuil, on affiche « Plus que N ». */
export const LOW_STOCK_THRESHOLD = 3;
/** Quantité maximale d'une même variante par commande. */
export const MAX_PER_ORDER = 10;

export type StockStatus = "in" | "low" | "out";

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export function productStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export function isAvailable(product: Product): boolean {
  return productStock(product) > 0;
}

export function startingPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.priceXof));
}

/** Variante proposée par défaut : la première disponible, sinon la première. */
export function defaultVariant(product: Product): Variant {
  return product.variants.find((v) => v.stock > 0) ?? product.variants[0];
}

export function maxOrderable(variant: Variant): number {
  return Math.max(0, Math.min(variant.stock, MAX_PER_ORDER));
}

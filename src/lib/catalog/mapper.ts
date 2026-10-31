// Conversion entre les lignes Supabase (snake_case) et le modèle du site (Product).

import { isCollectionId, isFamilyId } from "./taxonomy";
import type { Product } from "./types";

export const PRODUCT_SELECT =
  "id, slug, name, brand, concentration, collection, also_in, family, tagline, description, notes_top, notes_heart, notes_base, tint, images, featured, best_seller_rank, is_new, added_at, product_variants (id, sku, size_ml, price_xof, stock)";

export type VariantRow = { id: string; sku: string; size_ml: number; price_xof: number; stock: number };

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  concentration: string;
  collection: string;
  also_in: string[] | null;
  family: string;
  tagline: string;
  description: string;
  notes_top: string[];
  notes_heart: string[];
  notes_base: string[];
  tint: string;
  images: string[];
  featured: boolean;
  best_seller_rank: number | null;
  is_new: boolean;
  added_at: string;
  product_variants: VariantRow[];
};

/** Chemin du compartiment « products » → URL publique. Les URL complètes et chemins locaux (/…) sont gardés tels quels. */
export function imageUrl(path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${path.replace(/^\/+/, "")}`;
}

/** Renvoie null pour une ligne inexploitable (taxonomie inconnue, aucune contenance) : elle est ignorée. */
export function fromRow(row: ProductRow): Product | null {
  if (!isCollectionId(row.collection) || !isFamilyId(row.family) || row.product_variants.length === 0) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    concentration: row.concentration,
    collection: row.collection,
    alsoIn: (row.also_in ?? []).filter(isCollectionId).filter((c) => c !== row.collection),
    family: row.family,
    tagline: row.tagline,
    description: row.description,
    notes: { top: row.notes_top, heart: row.notes_heart, base: row.notes_base },
    variants: [...row.product_variants]
      .sort((a, b) => a.size_ml - b.size_ml)
      .map((v) => ({ id: v.id, sku: v.sku, sizeMl: v.size_ml, priceXof: v.price_xof, stock: v.stock })),
    tint: row.tint,
    images: row.images.map(imageUrl),
    featured: row.featured,
    bestSellerRank: row.best_seller_rank ?? undefined,
    isNew: row.is_new,
    addedAt: row.added_at,
  };
}

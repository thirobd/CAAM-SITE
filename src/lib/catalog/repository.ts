import "server-only";
import { cache } from "react";
import { getSupabase } from "@/lib/supabase/server";
import { demoProducts } from "./data";
import { fromRow, PRODUCT_SELECT, type ProductRow } from "./mapper";
import type { Product } from "./types";

// Point d'accès unique aux données produits, côté serveur.
// Source : Supabase si configuré (.env.local), sinon le catalogue de démonstration.
// CATALOG_SOURCE=demo force la démonstration (utile pour travailler hors ligne).

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function catalogClient() {
  return process.env.CATALOG_SOURCE === "demo" ? null : getSupabase();
}

/** Tous les parfums publiés. Mémorisé pendant un rendu : une seule requête par page. */
export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = catalogClient();
  if (!supabase) return demoProducts;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("position", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(`Catalogue Supabase indisponible : ${error.message}`);

  return (data as unknown as ProductRow[]).map(fromRow).filter((p): p is Product => p !== null);
});

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.featured).slice(0, limit);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  return (await getProducts())
    .filter((p) => p.bestSellerRank !== undefined)
    .sort((a, b) => a.bestSellerRank! - b.bestSellerRank!)
    .slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const others = (await getProducts()).filter((p) => p.id !== product.id);
  const score = (p: Product) => (p.family === product.family ? 2 : 0) + (p.collection === product.collection ? 1 : 0);
  return others.sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/**
 * Recherche d'une contenance par son identifiant, toujours lue en direct (sans cache) :
 * sert à valider une commande avec le prix et le stock actuels.
 */
export async function findVariant(variantId: string) {
  const supabase = catalogClient();
  if (!supabase) {
    for (const product of demoProducts) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) return { product, variant };
    }
    return undefined;
  }

  if (!UUID.test(variantId)) return undefined;
  const { data: match, error: matchError } = await supabase
    .from("product_variants")
    .select("product_id")
    .eq("id", variantId)
    .maybeSingle();
  if (matchError) throw new Error(`Catalogue Supabase indisponible : ${matchError.message}`);
  if (!match) return undefined;

  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", match.product_id).maybeSingle();
  if (error) throw new Error(`Catalogue Supabase indisponible : ${error.message}`);
  const product = data ? fromRow(data as unknown as ProductRow) : null;
  const variant = product?.variants.find((v) => v.id === variantId);
  return product && variant ? { product, variant } : undefined;
}

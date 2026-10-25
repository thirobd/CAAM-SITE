import "server-only";
import { demoProducts } from "./data";
import type { Product } from "./types";

// Point d'accès unique aux données produits, côté serveur.
// Phase 1 : données locales. Phase 2 : remplacer le contenu de ces fonctions par des
// requêtes Supabase (les signatures asynchrones restent identiques pour les pages).

export async function getProducts(): Promise<Product[]> {
  return demoProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return demoProducts.find((p) => p.slug === slug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return demoProducts.filter((p) => p.featured).slice(0, limit);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  return demoProducts
    .filter((p) => p.bestSellerRank !== undefined)
    .sort((a, b) => a.bestSellerRank! - b.bestSellerRank!)
    .slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const others = demoProducts.filter((p) => p.id !== product.id);
  const score = (p: Product) => (p.family === product.family ? 2 : 0) + (p.collection === product.collection ? 1 : 0);
  return others.sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** Recherche d'une variante par son identifiant (utilisée pour valider une commande). */
export async function findVariant(variantId: string) {
  for (const product of demoProducts) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return undefined;
}

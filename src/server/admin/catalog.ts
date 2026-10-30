import "server-only";
import type { ProductInput } from "@/lib/admin/product-input";
import type { CollectionId, FamilyId } from "@/lib/catalog/types";
import type { AdminSession } from "./session";

// Lecture du catalogue complet (parfums masqués compris) pour l'espace propriétaire.

export type AdminVariant = { id: string; sku: string; size_ml: number; price_xof: number; stock: number };

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  concentration: string;
  collection: CollectionId;
  family: FamilyId;
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
  is_published: boolean;
  position: number;
  updated_at: string;
  product_variants: AdminVariant[];
};

const SELECT =
  "id, slug, name, brand, concentration, collection, family, tagline, description, notes_top, notes_heart, notes_base, tint, images, featured, best_seller_rank, is_new, is_published, position, updated_at, product_variants (id, sku, size_ml, price_xof, stock)";

function sortVariants(p: AdminProduct): AdminProduct {
  return { ...p, product_variants: [...p.product_variants].sort((a, b) => a.size_ml - b.size_ml) };
}

export async function listAdminProducts({ supabase }: AdminSession): Promise<AdminProduct[]> {
  // Parfums publiés d'abord, puis dans l'ordre d'affichage de la boutique.
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .order("is_published", { ascending: false })
    .order("position", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(`Catalogue indisponible : ${error.message}`);
  return (data as unknown as AdminProduct[]).map(sortVariants);
}

export async function getAdminProduct({ supabase }: AdminSession, id: string): Promise<AdminProduct | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await supabase.from("products").select(SELECT).eq("id", id).maybeSingle();
  if (error) throw new Error(`Catalogue indisponible : ${error.message}`);
  return data ? sortVariants(data as unknown as AdminProduct) : null;
}

export function toProductInput(p: AdminProduct): ProductInput {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    concentration: p.concentration,
    collection: p.collection,
    family: p.family,
    tagline: p.tagline,
    description: p.description,
    notesTop: p.notes_top,
    notesHeart: p.notes_heart,
    notesBase: p.notes_base,
    tint: p.tint,
    images: p.images,
    featured: p.featured,
    isNew: p.is_new,
    bestSellerRank: p.best_seller_rank,
    isPublished: p.is_published,
    position: p.position,
    variants: p.product_variants.map((v) => ({ id: v.id, sizeMl: v.size_ml, priceXof: v.price_xof, stock: v.stock, sku: v.sku })),
  };
}

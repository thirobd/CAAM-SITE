"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasErrors, validateProduct, type ProductErrors, type ProductInput } from "@/lib/admin/product-input";
import { requireAdmin } from "./session";

export type SaveProductResult = { ok: true; id: string } | { ok: false; errors: ProductErrors };

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const int = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : Number.NaN);
const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => str(x, 80)).filter(Boolean).slice(0, 12) : []);

/** Les arguments d'une action serveur viennent du navigateur : on les normalise avant tout. */
function normalize(raw: ProductInput): ProductInput {
  return {
    id: typeof raw?.id === "string" ? raw.id : undefined,
    name: str(raw?.name, 120),
    slug: str(raw?.slug, 120).toLowerCase(),
    brand: str(raw?.brand, 60),
    concentration: str(raw?.concentration, 60),
    collection: raw?.collection,
    family: raw?.family,
    tagline: str(raw?.tagline, 300),
    description: str(raw?.description, 4000),
    notesTop: list(raw?.notesTop),
    notesHeart: list(raw?.notesHeart),
    notesBase: list(raw?.notesBase),
    tint: str(raw?.tint, 7),
    images: Array.isArray(raw?.images) ? raw.images.map((x) => str(x, 500)).filter(Boolean) : [],
    featured: raw?.featured === true,
    isNew: raw?.isNew === true,
    bestSellerRank: raw?.bestSellerRank === null || raw?.bestSellerRank === undefined ? null : int(raw.bestSellerRank),
    isPublished: raw?.isPublished === true,
    position: int(raw?.position),
    variants: Array.isArray(raw?.variants)
      ? raw.variants.slice(0, 10).map((v) => ({
          id: typeof v?.id === "string" ? v.id : undefined,
          sizeMl: int(v?.sizeMl),
          priceXof: int(v?.priceXof),
          stock: int(v?.stock),
          sku: str(v?.sku, 40).toUpperCase(),
        }))
      : [],
  };
}

/** Message lisible pour une violation de contrainte d'unicité. */
function uniqueError(message: string): ProductErrors {
  if (message.includes("products_slug_key")) return { slug: "Cette adresse est déjà utilisée par un autre parfum." };
  if (message.includes("sku")) return { variants: "Une de ces références est déjà utilisée par un autre parfum." };
  if (message.includes("size_ml")) return { variants: "Deux contenances identiques pour ce parfum." };
  return { form: "Une valeur est déjà utilisée." };
}

function refreshShop() {
  // La boutique et l'espace propriétaire affichent aussitôt les changements.
  revalidatePath("/", "layout");
}

export async function saveProduct(raw: ProductInput): Promise<SaveProductResult> {
  const { supabase } = await requireAdmin();
  const input = normalize(raw);
  const errors = validateProduct(input);
  if (hasErrors(errors)) return { ok: false, errors };

  const row = {
    slug: input.slug,
    name: input.name,
    brand: input.brand,
    concentration: input.concentration,
    collection: input.collection,
    family: input.family,
    tagline: input.tagline,
    description: input.description,
    notes_top: input.notesTop,
    notes_heart: input.notesHeart,
    notes_base: input.notesBase,
    tint: input.tint,
    images: input.images,
    featured: input.featured,
    is_new: input.isNew,
    best_seller_rank: input.bestSellerRank,
    is_published: input.isPublished,
    position: input.position,
  };

  const saved = input.id
    ? await supabase.from("products").update(row).eq("id", input.id).select("id").single()
    : await supabase.from("products").insert(row).select("id").single();
  if (saved.error) {
    return { ok: false, errors: saved.error.code === "23505" ? uniqueError(saved.error.message) : { form: saved.error.message } };
  }
  const productId = saved.data.id as string;

  // Contenances : suppression de celles retirées, mise à jour des existantes, ajout des nouvelles.
  const { data: existing, error: listError } = await supabase.from("product_variants").select("id").eq("product_id", productId);
  if (listError) return { ok: false, errors: { form: listError.message } };
  const kept = new Set(input.variants.map((v) => v.id).filter(Boolean));
  const removed = (existing ?? []).map((v) => v.id as string).filter((id) => !kept.has(id));
  if (removed.length > 0) {
    const { error } = await supabase.from("product_variants").delete().in("id", removed);
    if (error) return { ok: false, errors: { variants: error.message } };
  }
  for (const v of input.variants) {
    const values = { size_ml: v.sizeMl, price_xof: v.priceXof, stock: v.stock, sku: v.sku };
    const { error } = v.id
      ? await supabase.from("product_variants").update(values).eq("id", v.id).eq("product_id", productId)
      : await supabase.from("product_variants").insert({ ...values, product_id: productId });
    if (error) return { ok: false, errors: error.code === "23505" ? uniqueError(error.message) : { variants: error.message } };
  }

  refreshShop();
  return { ok: true, id: productId };
}

export async function deleteProduct(id: string): Promise<{ ok: false; message: string } | never> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", String(id));
  if (error) return { ok: false, message: error.message };
  refreshShop();
  redirect("/admin/parfums");
}

export async function setPublished(id: string, published: boolean): Promise<{ ok: boolean; message?: string }> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").update({ is_published: published === true }).eq("id", String(id));
  if (error) return { ok: false, message: error.message };
  refreshShop();
  return { ok: true };
}

/** Mise à jour rapide depuis le tableau « Stocks & prix ». */
export async function updateVariant(id: string, values: { priceXof: number; stock: number }): Promise<{ ok: boolean; message?: string }> {
  const { supabase } = await requireAdmin();
  const priceXof = int(values?.priceXof);
  const stock = int(values?.stock);
  if (!(priceXof >= 0) || !(stock >= 0)) return { ok: false, message: "Prix et stock doivent être des nombres positifs." };
  const { error } = await supabase.from("product_variants").update({ price_xof: priceXof, stock }).eq("id", String(id));
  if (error) return { ok: false, message: error.message };
  refreshShop();
  return { ok: true };
}

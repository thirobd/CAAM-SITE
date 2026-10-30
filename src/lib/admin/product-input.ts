// Saisie d'un parfum dans l'espace propriétaire : types, valeurs par défaut et validation,
// partagés entre le formulaire (navigateur) et l'action serveur. Les règles reprennent
// les contraintes de la base (supabase/migrations/20261030120000_catalog.sql).

import { isCollectionId, isFamilyId } from "@/lib/catalog/taxonomy";
import type { CollectionId, FamilyId } from "@/lib/catalog/types";

export type VariantInput = {
  /** Absent pour une nouvelle contenance. */
  id?: string;
  sizeMl: number;
  priceXof: number;
  stock: number;
  sku: string;
};

export type ProductInput = {
  /** Absent pour un nouveau parfum. */
  id?: string;
  name: string;
  slug: string;
  brand: string;
  concentration: string;
  collection: CollectionId;
  family: FamilyId;
  tagline: string;
  description: string;
  notesTop: string[];
  notesHeart: string[];
  notesBase: string[];
  tint: string;
  images: string[];
  featured: boolean;
  isNew: boolean;
  bestSellerRank: number | null;
  isPublished: boolean;
  position: number;
  variants: VariantInput[];
};

export type VariantErrors = Partial<Record<keyof VariantInput, string>>;
export type ProductErrors = Partial<Record<Exclude<keyof ProductInput, "variants">, string>> & {
  variants?: string;
  variantRows?: Record<number, VariantErrors>;
  form?: string;
};

export const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  brand: "ĆAAM",
  concentration: "Extrait de parfum",
  collection: "esprits-libres",
  family: "ambre",
  tagline: "",
  description: "",
  notesTop: [],
  notesHeart: [],
  notesBase: [],
  tint: "#b88a3e",
  images: [],
  featured: false,
  isNew: true,
  bestSellerRank: null,
  isPublished: false,
  position: 0,
  variants: [{ sizeMl: 50, priceXof: 0, stock: 0, sku: "" }],
};

/** « Nuit à Dakar » → « nuit-a-dakar » (adresse de la page du parfum). */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Référence proposée pour une contenance : « GHOST », 50 ml → « CAAM-GHO-50 ». */
export function suggestSku(name: string, sizeMl: number): string {
  const code = slugify(name).replace(/-/g, "").slice(0, 3).toUpperCase() || "PAR";
  return `CAAM-${code}-${sizeMl || ""}`;
}

/** Notes saisies « Bergamote, Cardamome » → ["Bergamote", "Cardamome"]. */
export function parseNotes(text: string): string[] {
  return text
    .split(/[,;\n]/)
    .map((n) => n.trim())
    .filter(Boolean);
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const HEX = /^#[0-9a-fA-F]{6}$/;
const isInt = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n);

export function validateProduct(p: ProductInput): ProductErrors {
  const errors: ProductErrors = {};
  if (!p.name.trim()) errors.name = "Indiquez le nom du parfum.";
  else if (p.name.length > 80) errors.name = "80 caractères maximum.";
  if (!SLUG.test(p.slug)) errors.slug = "Lettres minuscules, chiffres et tirets uniquement (ex. nuit-a-dakar).";
  if (!p.brand.trim()) errors.brand = "Indiquez la marque.";
  if (!p.concentration.trim()) errors.concentration = "Indiquez la concentration.";
  if (!isCollectionId(p.collection)) errors.collection = "Choisissez une collection.";
  if (!isFamilyId(p.family)) errors.family = "Choisissez une famille olfactive.";
  if (p.tagline.length > 160) errors.tagline = "160 caractères maximum.";
  if (p.description.length > 2000) errors.description = "2 000 caractères maximum.";
  if (!HEX.test(p.tint)) errors.tint = "Couleur au format #RRGGBB.";
  if (p.images.length > 8) errors.images = "8 photos maximum.";
  if (p.bestSellerRank !== null && (!isInt(p.bestSellerRank) || p.bestSellerRank < 1))
    errors.bestSellerRank = "Un nombre entier à partir de 1, ou vide.";
  if (!isInt(p.position) || p.position < 0) errors.position = "Un nombre entier à partir de 0.";

  if (p.variants.length === 0) errors.variants = "Ajoutez au moins une contenance.";
  const rows: Record<number, VariantErrors> = {};
  const sizes = new Set<number>();
  const skus = new Set<string>();
  p.variants.forEach((v, i) => {
    const e: VariantErrors = {};
    if (!isInt(v.sizeMl) || v.sizeMl <= 0) e.sizeMl = "Contenance en ml.";
    else if (sizes.has(v.sizeMl)) e.sizeMl = "Contenance en double.";
    if (!isInt(v.priceXof) || v.priceXof < 0) e.priceXof = "Prix invalide.";
    if (!isInt(v.stock) || v.stock < 0) e.stock = "Stock invalide.";
    const sku = v.sku.trim().toUpperCase();
    if (!sku) e.sku = "Référence requise.";
    else if (skus.has(sku)) e.sku = "Référence en double.";
    sizes.add(v.sizeMl);
    skus.add(sku);
    if (Object.keys(e).length > 0) rows[i] = e;
  });
  if (Object.keys(rows).length > 0) {
    errors.variantRows = rows;
    errors.variants ??= "Vérifiez les contenances.";
  }
  return errors;
}

export function hasErrors(errors: ProductErrors): boolean {
  return Object.keys(errors).length > 0;
}

// Modèle du catalogue. Il reflète les futures tables Supabase :
// products (1) — (n) product_variants, avec le stock porté par chaque variante.

export type CollectionId = "elle" | "lui" | "esprits-libres";
export type FamilyId = "ambre" | "boise" | "floral" | "cuir" | "epice" | "frais";

export type Collection = {
  id: CollectionId;
  label: string;
  tagline: string;
  description: string;
};

export type Family = {
  id: FamilyId;
  label: string;
  description: string;
  /** Couleur d'ambiance de la famille (visuels). */
  tint: string;
};

export type Variant = {
  id: string;
  sku: string;
  sizeMl: number;
  /** Prix en francs CFA (XOF), sans décimales. */
  priceXof: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  concentration: string;
  collection: CollectionId;
  family: FamilyId;
  tagline: string;
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  variants: Variant[];
  /** Couleur du jus, utilisée par les visuels générés tant qu'il n'y a pas de photos. */
  tint: string;
  /** Photos réelles (chemins dans /public ou URL Supabase Storage). Vide = visuels générés. */
  images: string[];
  featured?: boolean;
  bestSellerRank?: number;
  isNew?: boolean;
  /** Date d'ajout au catalogue (ISO), pour le tri « Nouveautés ». */
  addedAt: string;
};

export type SortKey = "recommandes" | "nouveautes" | "prix-asc" | "prix-desc" | "nom";

export type CatalogFilters = {
  query: string;
  collection: CollectionId | null;
  family: FamilyId | null;
  inStockOnly: boolean;
  sort: SortKey;
};

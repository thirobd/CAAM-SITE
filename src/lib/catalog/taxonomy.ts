import type { Collection, CollectionId, Family, FamilyId, Product, SortKey } from "./types";

export const collections: Collection[] = [
  {
    id: "elle",
    label: "Pour elle",
    tagline: "Féminité affirmée",
    description: "Des sillages doux et enveloppants, entre vanille et muscs, pour une élégance qui ne passe pas inaperçue.",
  },
  {
    id: "lui",
    label: "Pour lui",
    tagline: "Caractère et profondeur",
    description: "Épices fraîches, bois précieux et ambre : des signatures intenses, taillées pour durer.",
  },
  {
    id: "esprits-libres",
    label: "Esprits libres",
    tagline: "Au-delà des codes",
    description: "Des créations à partager, qui se jouent des frontières entre masculin et féminin.",
  },
];

export const families: Family[] = [
  { id: "ambre", label: "Ambré", description: "Chaleur, vanille, résines dorées.", tint: "#b8742e" },
  { id: "boise", label: "Boisé", description: "Oud, santal, cèdre : la noblesse des bois.", tint: "#5b4330" },
  { id: "floral", label: "Floral", description: "Rose, jasmin, fleurs solaires.", tint: "#b8737a" },
  { id: "cuir", label: "Cuiré", description: "Cuir fumé, tabac, profondeur.", tint: "#3d2a22" },
  { id: "epice", label: "Épicé", description: "Safran, encens, poivres rares.", tint: "#9a4a2a" },
  { id: "frais", label: "Frais", description: "Agrumes, néroli, brise marine.", tint: "#7f9c98" },
];

export const sortOptions: { id: SortKey; label: string }[] = [
  { id: "recommandes", label: "Recommandés" },
  { id: "nouveautes", label: "Nouveautés" },
  { id: "prix-asc", label: "Prix croissant" },
  { id: "prix-desc", label: "Prix décroissant" },
  { id: "nom", label: "Nom (A–Z)" },
];

export function getCollection(id: CollectionId): Collection {
  return collections.find((c) => c.id === id)!;
}

export function getFamily(id: FamilyId): Family {
  return families.find((f) => f.id === id)!;
}

type InCollections = Pick<Product, "collection" | "alsoIn">;

/** Collections où le parfum apparaît : la sienne d'abord, puis celles où il est aussi proposé. */
export function productCollections(p: InCollections): CollectionId[] {
  return [p.collection, ...(p.alsoIn ?? []).filter((c) => c !== p.collection)];
}

export function inCollection(p: InCollections, id: CollectionId): boolean {
  return p.collection === id || (p.alsoIn?.includes(id) ?? false);
}

/** Familles représentées dans le catalogue, dans l'ordre de référence : les familles vides ne sont pas proposées. */
export function familiesIn(products: Pick<Product, "family">[]): Family[] {
  return families.filter((f) => products.some((p) => p.family === f.id));
}

export function isCollectionId(value: unknown): value is CollectionId {
  return collections.some((c) => c.id === value);
}

export function isFamilyId(value: unknown): value is FamilyId {
  return families.some((f) => f.id === value);
}

export function isSortKey(value: unknown): value is SortKey {
  return sortOptions.some((s) => s.id === value);
}

import { getCollection, getFamily } from "./taxonomy";
import { isAvailable, startingPrice } from "./stock";
import type { CatalogFilters, Product } from "./types";

export const defaultFilters: CatalogFilters = {
  query: "",
  collection: null,
  family: null,
  inStockOnly: false,
  sort: "recommandes",
};

/** Normalise un texte pour la recherche : minuscules, sans accents. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/** Texte indexé pour la recherche : nom, accroche, collection, famille et notes. */
export function searchText(p: Product): string {
  return normalize(
    [
      p.name,
      p.tagline,
      getCollection(p.collection).label,
      getFamily(p.family).label,
      ...p.notes.top,
      ...p.notes.heart,
      ...p.notes.base,
    ].join(" "),
  );
}

function matchesText(text: string, query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return terms.every((t) => text.includes(t));
}

export function matchesQuery(product: Product, query: string): boolean {
  return matchesText(searchText(product), query);
}

/** Entrée légère envoyée au navigateur pour la recherche instantanée de l'en-tête. */
export type SearchEntry = {
  slug: string;
  name: string;
  meta: string;
  tint: string;
  image?: string;
  priceFromXof: number;
  available: boolean;
  text: string;
};

export function toSearchEntry(p: Product): SearchEntry {
  return {
    slug: p.slug,
    name: p.name,
    meta: `${getCollection(p.collection).label} · ${getFamily(p.family).label}`,
    tint: p.tint,
    image: p.images[0],
    priceFromXof: startingPrice(p),
    available: isAvailable(p),
    text: searchText(p),
  };
}

export function searchEntries(entries: SearchEntry[], query: string): SearchEntry[] {
  return normalize(query) ? entries.filter((e) => matchesText(e.text, query)) : [];
}

export function filterProducts(products: Product[], f: CatalogFilters): Product[] {
  const result = products.filter(
    (p) =>
      matchesQuery(p, f.query) &&
      (!f.collection || p.collection === f.collection) &&
      (!f.family || p.family === f.family) &&
      (!f.inStockOnly || isAvailable(p)),
  );

  const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, "fr");
  switch (f.sort) {
    case "prix-asc":
      return result.sort((a, b) => startingPrice(a) - startingPrice(b));
    case "prix-desc":
      return result.sort((a, b) => startingPrice(b) - startingPrice(a));
    case "nom":
      return result.sort(byName);
    case "nouveautes":
      return result.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    default:
      // Recommandés : mis en avant, puis meilleures ventes, puis disponibles d'abord.
      return result.sort(
        (a, b) =>
          Number(isAvailable(b)) - Number(isAvailable(a)) ||
          Number(!!b.featured) - Number(!!a.featured) ||
          (a.bestSellerRank ?? 99) - (b.bestSellerRank ?? 99) ||
          byName(a, b),
      );
  }
}

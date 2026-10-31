import type { Metadata } from "next";
import { ShopExplorer } from "@/components/shop/shop-explorer";
import { SectionHeading } from "@/components/ui/section-heading";
import { defaultFilters } from "@/lib/catalog/filter";
import { getProducts } from "@/lib/catalog/repository";
import { isCollectionId, isFamilyId, isSortKey } from "@/lib/catalog/taxonomy";
import type { CatalogFilters } from "@/lib/catalog/types";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Tous les extraits de parfum ĆAAM : pour elle, pour lui et pour les esprits libres. Recherche, familles olfactives et disponibilités.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const products = await getProducts();

  const collection = first(params.collection);
  const family = first(params.famille);
  const sort = first(params.tri);
  const initial: CatalogFilters = {
    query: first(params.q) ?? "",
    collection: isCollectionId(collection) ? collection : null,
    family: isFamilyId(family) ? family : null,
    inStockOnly: first(params.dispo) === "1",
    sort: isSortKey(sort) ? sort : defaultFilters.sort,
  };

  // Contenances réellement en vente (« 50 ml », « 50 ml et 100 ml »…), d'après le catalogue.
  const sizes = [...new Set(products.flatMap((p) => p.variants.map((v) => v.sizeMl)))].sort((a, b) => a - b).map((s) => `${s} ml`);
  const sizeText = sizes.length > 1 ? `${sizes.slice(0, -1).join(", ")} et ${sizes.at(-1)}` : sizes[0];

  return (
    <div className="container-luxe pb-24 pt-14 md:pt-20">
      <SectionHeading
        as="h1"
        eyebrow="Boutique"
        title="La collection"
        description={`Extraits de parfum${sizeText ? ` en ${sizeText}` : ""}. Prix en francs CFA.`}
        className="mb-10 md:mb-14"
      />
      {/* La clé remonte l'explorateur quand on arrive avec d'autres filtres (lien du menu, recherche). */}
      <ShopExplorer key={JSON.stringify(initial)} products={products} initial={initial} />
    </div>
  );
}

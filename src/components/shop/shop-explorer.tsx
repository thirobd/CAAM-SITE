"use client";

import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { defaultFilters, filterProducts } from "@/lib/catalog/filter";
import { collections, families, sortOptions } from "@/lib/catalog/taxonomy";
import type { CatalogFilters, CollectionId, FamilyId, Product, SortKey } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const selectClass =
  "h-11 w-full appearance-none border border-ink/20 bg-paper bg-[length:12px] bg-[right_14px_center] bg-no-repeat pl-4 pr-10 text-sm outline-none transition-colors focus:border-ink";
const chevron = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%230c0a08' stroke-width='1.2'><path d='M2 4l4 4 4-4'/></svg>\")",
};

function toSearchParams(f: CatalogFilters): string {
  const params = new URLSearchParams();
  if (f.query.trim()) params.set("q", f.query.trim());
  if (f.collection) params.set("collection", f.collection);
  if (f.family) params.set("famille", f.family);
  if (f.inStockOnly) params.set("dispo", "1");
  if (f.sort !== defaultFilters.sort) params.set("tri", f.sort);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function ShopExplorer({ products, initial }: { products: Product[]; initial: CatalogFilters }) {
  const [filters, setFilters] = useState(initial);
  const results = useMemo(() => filterProducts(products, filters), [products, filters]);
  const isFiltered =
    filters.query.trim() !== "" || filters.collection !== null || filters.family !== null || filters.inStockOnly;

  // Garde l'URL synchronisée (lien partageable) sans recharger la page.
  useEffect(() => {
    window.history.replaceState(null, "", `/boutique${toSearchParams(filters)}`);
  }, [filters]);

  const update = (patch: Partial<CatalogFilters>) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 border-y border-ink/10 bg-ivory/95 px-4 py-4 backdrop-blur-md md:top-[76px] md:mx-0 md:px-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="group" aria-label="Collection">
              {[{ id: null, label: "Tous" }, ...collections].map((c) => {
                const active = filters.collection === c.id;
                return (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => update({ collection: c.id as CollectionId | null })}
                    aria-pressed={active}
                    className={cn(
                      "h-10 shrink-0 border px-5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300",
                      active ? "border-ink bg-ink text-ivory" : "border-ink/20 hover:border-ink",
                    )}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="relative lg:w-80">
              <label htmlFor="shop-search" className="sr-only">
                Rechercher dans la boutique
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone" strokeWidth={1.25} />
              <input
                id="shop-search"
                type="search"
                value={filters.query}
                onChange={(e) => update({ query: e.target.value })}
                placeholder="Parfum, note, famille…"
                className="h-11 w-full border border-ink/20 bg-paper pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-stone/70 focus:border-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:flex md:items-center">
            <div className="md:w-56">
              <label htmlFor="shop-family" className="sr-only">
                Famille olfactive
              </label>
              <select
                id="shop-family"
                value={filters.family ?? ""}
                onChange={(e) => update({ family: (e.target.value || null) as FamilyId | null })}
                className={selectClass}
                style={chevron}
              >
                <option value="">Toutes les familles</option>
                {families.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:w-56">
              <label htmlFor="shop-sort" className="sr-only">
                Trier
              </label>
              <select
                id="shop-sort"
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as SortKey })}
                className={selectClass}
                style={chevron}
              >
                {sortOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    Trier : {s.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="col-span-2 inline-flex cursor-pointer items-center gap-3 text-sm md:ml-2">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => update({ inStockOnly: e.target.checked })}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative h-5 w-9 rounded-full bg-ink/20 transition-colors peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-paper after:transition-transform peer-checked:after:translate-x-4"
              />
              En stock uniquement
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-stone" aria-live="polite">
        <span>
          {results.length} parfum{results.length > 1 ? "s" : ""}
        </span>
        {isFiltered && (
          <button
            type="button"
            onClick={() => setFilters({ ...defaultFilters, sort: filters.sort })}
            className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-ink"
          >
            <X className="size-3.5" strokeWidth={1.5} /> Réinitialiser les filtres
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-24 text-center">
          <p className="font-serif text-3xl">Aucun parfum ne correspond</p>
          <p className="max-w-md text-stone">Essayez une autre note, une autre famille, ou élargissez votre recherche.</p>
          <button
            type="button"
            onClick={() => setFilters(defaultFilters)}
            className="mt-2 h-12 border border-ink/30 px-7 text-[11px] uppercase tracking-[0.24em] transition-colors hover:bg-ink hover:text-ivory"
          >
            Voir tous les parfums
          </button>
        </div>
      ) : (
        <motion.ul layout className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} priority={i < 4} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight, Search, X } from "lucide-react";
import { useState } from "react";
import { ProductMedia } from "@/components/product/product-media";
import { Price } from "@/components/providers/currency";
import { searchEntries, searchSuggestions, type SearchEntry } from "@/lib/catalog/filter";
import { useOverlay } from "./use-overlay";

const chipClass =
  "border border-ivory/20 px-4 py-2 text-sm text-ivory/80 transition-colors hover:border-champagne hover:text-ivory";

type Props = { open: boolean; onClose: () => void; entries: SearchEntry[] };

export function SearchOverlay({ open, onClose, entries }: Props) {
  useOverlay(open, onClose);
  return (
    <AnimatePresence>
      {open && <SearchPanel onClose={onClose} entries={entries} />}
    </AnimatePresence>
  );
}

function SearchPanel({ onClose, entries }: Omit<Props, "open">) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const results = searchEntries(entries, query);
  const shown = results.slice(0, 6);
  const suggestions = searchSuggestions(entries);
  const examples = suggestions.notes.slice(0, 3).map((n) => `« ${n.toLowerCase()} »`);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/boutique?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <m.div
      className="fixed inset-0 z-[70] overflow-y-auto bg-ink/[0.97] text-ivory backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Rechercher un parfum"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="container-luxe py-6">
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="grid size-11 place-items-center" aria-label="Fermer la recherche">
            <X className="size-6" strokeWidth={1.1} />
          </button>
        </div>

        <m.form
          onSubmit={submit}
          role="search"
          className="mx-auto mt-6 max-w-3xl"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <label htmlFor="site-search" className="eyebrow text-champagne">
            Rechercher
          </label>
          <div className="mt-4 flex items-center gap-4 border-b border-ivory/30 pb-3 focus-within:border-champagne">
            <Search className="size-6 shrink-0 text-ivory/60" strokeWidth={1.1} aria-hidden="true" />
            <input
              id="site-search"
              type="search"
              autoFocus
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Un parfum, une note, une famille…"
              className="w-full bg-transparent font-serif text-3xl font-light text-ivory outline-none placeholder:text-ivory/35 md:text-5xl"
            />
          </div>
        </m.form>

        <div className="mx-auto mt-10 max-w-3xl pb-16" aria-live="polite">
          {!query.trim() ? (
            <div className="space-y-8">
              {entries.length > 0 && (
                <div>
                  <p className="eyebrow text-mist">Nos parfums</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entries.map((e) => (
                      <Link key={e.slug} href={`/parfums/${e.slug}`} onClick={onClose} className={chipClass}>
                        {e.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {suggestions.tags.length + suggestions.notes.length > 0 && (
                <div>
                  <p className="eyebrow text-mist">Suggestions</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[...suggestions.tags, ...suggestions.notes].map((s) => (
                      <button key={s} type="button" onClick={() => setQuery(s)} className={chipClass}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : shown.length === 0 ? (
            <p className="text-mist">
              Aucun parfum ne correspond à « {query} ».
              {examples.length > 0 && ` Essayez une note comme ${examples.join(", ")}.`}
            </p>
          ) : (
            <>
              <p className="eyebrow text-mist">
                {results.length} résultat{results.length > 1 ? "s" : ""}
              </p>
              <ul className="mt-4 divide-y divide-ivory/10">
                {shown.map((entry) => (
                  <li key={entry.slug}>
                    <Link href={`/parfums/${entry.slug}`} onClick={onClose} className="group flex items-center gap-5 py-4">
                      <ProductMedia name={entry.name} tint={entry.tint} src={entry.image} tone="dark" sizes="64px" className="aspect-[4/5] w-16 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-2xl leading-tight group-hover:text-champagne">{entry.name}</p>
                        <p className="text-sm text-mist">
                          {entry.meta}
                          {!entry.available && " · Épuisé"}
                        </p>
                      </div>
                      <Price amountXof={entry.priceFromXof} className="hidden text-sm text-ivory/80 sm:block" />
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={submit}
                className="mt-6 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-champagne hover:text-ivory"
              >
                Voir tous les résultats <ArrowRight className="size-4" strokeWidth={1.25} />
              </button>
            </>
          )}
        </div>
      </div>
    </m.div>
  );
}

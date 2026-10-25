import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { BottleArt } from "@/components/product/bottle-art";
import { sceneBackground } from "@/components/product/scene";
import { collections } from "@/lib/catalog/taxonomy";
import type { CollectionId, Product } from "@/lib/catalog/types";

/** Trois grandes entrées : Pour elle, Pour lui, Esprits libres. */
export function CollectionsTriptych({ products }: { products: Product[] }) {
  const cover = (id: CollectionId) => products.find((p) => p.collection === id && p.featured) ?? products.find((p) => p.collection === id);

  return (
    <RevealGroup className="grid gap-4 md:grid-cols-3">
      {collections.map((c) => {
        const p = cover(c.id);
        return (
          <RevealItem key={c.id}>
            <Link
              href={`/boutique?collection=${c.id}`}
              className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-7 text-ivory md:aspect-[3/4.2]"
              style={sceneBackground(p?.tint ?? "#b88a3e", "dark")}
            >
              <div className="relative z-10">
                <p className="eyebrow text-champagne">{c.tagline}</p>
                <h3 className="mt-3 font-serif text-4xl font-light md:text-5xl">{c.label}</h3>
              </div>
              {p && (
                <BottleArt
                  tint={p.tint}
                  decorative
                  className="absolute -bottom-[6%] -right-[12%] h-[58%] w-auto opacity-90 transition-transform duration-1000 ease-luxe group-hover:-translate-y-3 group-hover:-rotate-3"
                />
              )}
              <div className="relative z-10 max-w-[54%]">
                <p className="text-[15px] leading-relaxed text-ivory/75">{c.description}</p>
                <span className="mt-5 inline-flex items-center gap-3 border-b border-champagne pb-1 text-[11px] uppercase tracking-[0.24em] text-champagne">
                  Explorer <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

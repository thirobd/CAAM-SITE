import Image from "next/image";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { BottleArt } from "@/components/product/bottle-art";
import { sceneBackground } from "@/components/product/scene";
import { collections, inCollection } from "@/lib/catalog/taxonomy";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/** Trois grandes entrées : Pour elle, Pour lui, Esprits libres. */
export function CollectionsTriptych({ products }: { products: Product[] }) {
  // Un parfum proposé dans deux collections ne passe au premier plan que d'une seule carte.
  const fronted = new Set<string>();
  return (
    <RevealGroup className="grid gap-4 md:grid-cols-3">
      {collections.map((c) => {
        const all = products.filter((p) => inCollection(p, c.id));
        const items = [...all.filter((p) => !fronted.has(p.id)), ...all.filter((p) => fronted.has(p.id))];
        const cover = items.find((p) => p.featured && !fronted.has(p.id)) ?? items[0];
        if (cover) {
          items.splice(items.indexOf(cover), 1);
          items.unshift(cover);
          fronted.add(cover.id);
        }
        // Jusqu'à deux photos en éventail ; la première passe devant.
        const photos = items.filter((p) => p.images[0]).slice(0, 2);
        return (
          <RevealItem key={c.id}>
            <Link
              href={`/boutique?collection=${c.id}`}
              className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-7 text-ivory md:aspect-[3/4.2]"
              style={sceneBackground(cover?.tint ?? "#b88a3e", "dark")}
            >
              <div className="relative z-10">
                <p className="eyebrow text-champagne">{c.tagline}</p>
                <h3 className="mt-3 font-serif text-4xl font-light md:text-5xl">{c.label}</h3>
              </div>
              {photos.length > 0 ? (
                // Entre le titre et le texte, pour ne jamais masquer la description.
                <div aria-hidden="true" className="absolute inset-x-[10%] bottom-[31%] top-[27%]">
                  {photos.map((p, i) => (
                    <div
                      key={p.id}
                      className={cn(
                        "absolute bottom-0 aspect-[4/5] h-[92%] overflow-hidden shadow-[0_24px_40px_-12px_rgba(0,0,0,0.7)] ring-1 ring-ivory/15 transition-transform duration-1000 ease-luxe",
                        photos.length === 1
                          ? "left-1/2 -translate-x-1/2 rotate-[3deg] group-hover:-translate-y-3 group-hover:rotate-0"
                          : i === 0
                            ? "right-[6%] z-[1] rotate-[5deg] group-hover:-translate-y-3 group-hover:rotate-[2deg]"
                            : "left-[6%] -rotate-[6deg] group-hover:-translate-x-2 group-hover:-rotate-[10deg]",
                      )}
                    >
                      <Image src={p.images[0]} alt="" fill sizes="(max-width: 768px) 40vw, 180px" className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                cover && (
                  <BottleArt
                    tint={cover.tint}
                    decorative
                    className="absolute -bottom-[6%] -right-[12%] h-[58%] w-auto opacity-90 transition-transform duration-1000 ease-luxe group-hover:-translate-y-3 group-hover:-rotate-3"
                  />
                )
              )}
              <div className="relative z-10 max-w-[54%]">
                <p className="text-[15px] leading-relaxed text-ivory/75">{c.description}</p>
                <span className="mt-5 inline-flex items-center gap-3 border-b border-champagne pb-1 text-[11px] uppercase tracking-[0.24em] text-champagne">
                  {items.length > 0 ? "Explorer" : "Bientôt"}{" "}
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import { ProductMedia } from "./product-media";
import { sceneBackground } from "./scene";

type View = { key: string; label: string; render: (thumb: boolean) => React.ReactNode };

function buildViews(product: Product): View[] {
  // Photos réelles si elles existent ; sinon trois vues générées.
  if (product.images.length > 0) {
    return product.images.map((src, i) => ({
      key: src,
      label: `Photo ${i + 1}`,
      render: (thumb) => (
        <ProductMedia name={product.name} tint={product.tint} src={src} sizes={thumb ? "96px" : "(max-width: 1024px) 100vw, 50vw"} priority={!thumb && i === 0} fill />
      ),
    }));
  }
  return [
    {
      key: "studio",
      label: "Flacon, fond ivoire",
      render: () => <ProductMedia name={product.name} tint={product.tint} fill />,
    },
    {
      key: "nuit",
      label: "Flacon, fond noir",
      render: () => <ProductMedia name={product.name} tint={product.tint} tone="dark" fill />,
    },
    {
      key: "notes",
      label: "Notes olfactives",
      render: (thumb) => (
        <div className="absolute inset-0 flex flex-col justify-center p-[10%] text-ivory" style={sceneBackground(product.tint, "dark")}>
          {thumb ? (
            <span className="text-center font-serif text-2xl">Notes</span>
          ) : (
            <>
              <p className="eyebrow text-champagne">Pyramide olfactive</p>
              <p className="mt-4 font-serif text-4xl font-light md:text-5xl">{product.name}</p>
              <dl className="mt-10 space-y-6">
                {[
                  ["Tête", product.notes.top],
                  ["Cœur", product.notes.heart],
                  ["Fond", product.notes.base],
                ].map(([label, notes]) => (
                  <div key={label as string} className="border-t border-ivory/15 pt-4">
                    <dt className="eyebrow text-mist">{label as string}</dt>
                    <dd className="mt-2 font-serif text-2xl">{(notes as string[]).join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
      ),
    },
  ];
}

export function ProductGallery({ product }: { product: Product }) {
  const views = buildViews(product);
  const [index, setIndex] = useState(0);
  const go = (i: number) => setIndex((i + views.length) % views.length);

  return (
    <div
      className="flex flex-col gap-3"
      role="region"
      aria-roledescription="galerie"
      aria-label={`Visuels de ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div className="group relative aspect-[4/5] overflow-hidden bg-ivory-deep">
        <AnimatePresence initial={false}>
          <m.div
            key={views[index].key}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`${views[index].label} (${index + 1} sur ${views.length})`}
            role="img"
          >
            {views[index].render(false)}
          </m.div>
        </AnimatePresence>

        {views.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Visuel précédent"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center bg-ivory/80 text-ink opacity-100 backdrop-blur transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            >
              <ChevronLeft className="size-5" strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Visuel suivant"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center bg-ivory/80 text-ink opacity-100 backdrop-blur transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            >
              <ChevronRight className="size-5" strokeWidth={1.25} />
            </button>
          </>
        )}
      </div>

      {views.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5" role="group" aria-label="Choisir un visuel">
          {views.map((view, i) => (
            <button
              key={view.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={view.label}
              aria-current={i === index}
              className={cn(
                "relative aspect-[4/5] overflow-hidden border transition-colors duration-300",
                i === index ? "border-ink" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              {view.render(true)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { BottleArt } from "@/components/product/bottle-art";
import { ArrowLink, ButtonLink } from "@/components/ui/button";
import type { Product } from "@/lib/catalog/types";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
const ROTATE_MS = 6000;
const PHOTO_SIZES = "(max-width: 1024px) 60vw, 340px";

const lines = [
  { text: "Caractère.", accent: false },
  { text: "Élégance.", accent: false },
  { text: "Intensité.", accent: true },
];

export function Hero({ products }: { products: Product[] }) {
  return (
    <section className="grain relative overflow-hidden bg-ink text-ivory">
      <div className="container-luxe grid min-h-[calc(100svh-104px)] items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="relative z-10 max-w-xl">
          <motion.p
            className="eyebrow text-champagne"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Extraits de parfum · Dakar — Europe
          </motion.p>

          <h1 className="mt-6 font-serif text-[3.6rem] font-light leading-[0.98] tracking-[-0.015em] sm:text-7xl xl:text-[6.2rem]">
            {lines.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={cn("block", line.accent && "italic text-champagne")}
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease, delay: 0.1 + i * 0.12 }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-md text-base leading-relaxed text-mist md:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.35 }}
          >
            Des signatures olfactives intenses, pour elle, pour lui et pour les esprits libres. Des parfums pensés pour laisser une empreinte.
          </motion.p>

          {/* L'appel à l'action principal apparaît presque immédiatement. */}
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <ButtonLink href="/boutique" variant="gold" size="lg">
              Découvrir la collection
            </ButtonLink>
            <ArrowLink href="/maison" className="text-ivory/85 hover:text-ivory">
              Notre histoire
            </ArrowLink>
          </motion.div>
        </div>

        <HeroVisual products={products} />
      </div>
    </section>
  );
}

function HeroVisual({ products }: { products: Product[] }) {
  const reduce = useReducedMotion();
  // La préférence « réduire les animations » n'est connue qu'après hydratation :
  // la fumée reste statique jusque-là, pour que serveur et navigateur rendent la même chose.
  const hydrated = useHydrated();
  const [index, setIndex] = useState(0);
  const product = products[index];

  useEffect(() => {
    if (reduce || products.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % products.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [reduce, products.length]);

  if (!product) return null;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[470px]"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease }}
    >
      <div className="relative aspect-[4/5] max-h-[60svh] min-h-[380px] w-full overflow-hidden rounded-t-full border border-ivory/10">
        {/* Halo coloré qui suit le parfum affiché */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `radial-gradient(ellipse at 50% 58%, color-mix(in srgb, ${product.tint} 55%, transparent) 0%, transparent 62%)`,
          }}
          transition={{ duration: 1.6 }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(216,191,138,0.22),transparent_70%)]" />

        <Smoke animated={hydrated && !reduce} />

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={product.id}
            className="absolute inset-0 flex items-end justify-center pb-[7%]"
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 1.1, ease }}
          >
            {product.images[0] ? (
              <div className="relative aspect-[4/5] h-[72%] overflow-hidden shadow-[0_40px_60px_-12px_rgba(0,0,0,0.75)] ring-1 ring-ivory/15">
                <Image src={product.images[0]} alt={product.name} fill sizes={PHOTO_SIZES} priority={index === 0} className="object-cover" />
              </div>
            ) : (
              <BottleArt tint={product.tint} name={product.name} className="h-[64%] w-auto drop-shadow-[0_40px_50px_rgba(0,0,0,0.55)]" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Photos suivantes chargées à l'avance : le fondu enchaîné reste fluide. */}
        <div aria-hidden="true" className="pointer-events-none absolute size-px overflow-hidden opacity-0">
          {products.map((p) =>
            p.images[0] && p.id !== product.id ? (
              <div key={p.id} className="relative size-px">
                <Image src={p.images[0]} alt="" fill sizes={PHOTO_SIZES} loading="eager" />
              </div>
            ) : null,
          )}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-6">
        <div aria-live="polite">
          <Link href={`/parfums/${product.slug}`} className="block font-serif text-3xl hover:text-champagne">
            {product.name}
          </Link>
        </div>
        <div className="flex gap-1" role="group" aria-label="Choisir le parfum affiché">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Afficher ${p.name}`}
              aria-pressed={i === index}
              className="grid h-8 w-10 place-items-center"
            >
              <span className={cn("block h-px transition-all duration-500", i === index ? "w-8 bg-champagne" : "w-4 bg-ivory/35")} />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/** Volutes de fumée, en écho à celles du logo ĆAAM. */
function Smoke({ animated }: { animated: boolean }) {
  const paths = [
    "M50 150 C 34 124, 66 104, 50 78 S 36 32, 54 6",
    "M58 150 C 44 128, 72 110, 58 86 S 46 46, 62 20",
  ];
  return (
    <svg viewBox="0 0 100 160" className="pointer-events-none absolute left-1/2 top-[4%] h-[30%] -translate-x-1/2" aria-hidden="true">
      <defs>
        <linearGradient id="hero-smoke" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d8bf8a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#d8bf8a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {paths.map((d, i) =>
        animated ? (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="url(#hero-smoke)"
            strokeWidth={1.2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
            transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: i * 2.2 }}
          />
        ) : (
          <path key={d} d={d} fill="none" stroke="url(#hero-smoke)" strokeWidth={1.2} strokeLinecap="round" opacity={0.6} />
        ),
      )}
    </svg>
  );
}

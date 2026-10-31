"use client";

import Link from "next/link";
import * as m from "motion/react-m";
import { Price } from "@/components/providers/currency";
import { productStock, startingPrice, stockStatus } from "@/lib/catalog/stock";
import { getCollection, getFamily } from "@/lib/catalog/taxonomy";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import { ProductMedia } from "./product-media";
import { StockBadge } from "./stock-badge";

type Props = {
  product: Product;
  tone?: "light" | "dark";
  rank?: number;
  priority?: boolean;
};

export function ProductCard({ product, tone = "light", rank, priority }: Props) {
  const stock = productStock(product);
  const status = stockStatus(stock);
  const dark = tone === "dark";
  const badge =
    status === "out" ? "Épuisé" : product.isNew ? "Nouveau" : product.bestSellerRank && !rank ? "Best-seller" : null;

  return (
    <m.article
      className="group relative h-full"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/parfums/${product.slug}`} className="flex h-full flex-col">
        <div className="relative">
          <ProductMedia
            name={product.name}
            tint={product.tint}
            src={product.images[0]}
            tone={tone}
            priority={priority}
            className={cn("aspect-[4/5]", status === "out" && "opacity-70")}
            bottleClassName="transition-[translate,scale] duration-700 ease-luxe group-hover:-translate-y-2 group-hover:scale-[1.03]"
          />
          {badge && (
            <span
              className={cn(
                "eyebrow absolute left-3 top-3 px-2.5 py-1.5 text-[10px]",
                status === "out" ? "bg-ink/80 text-ivory" : "bg-ivory/90 text-ink",
              )}
            >
              {badge}
            </span>
          )}
          {rank && (
            <span className="absolute right-4 top-2 font-serif text-5xl font-light text-ivory/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
              {String(rank).padStart(2, "0")}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <p className={cn("eyebrow text-[10px]", dark ? "text-champagne" : "text-gold-deep")}>
            {getCollection(product.collection).label} · {getFamily(product.family).label}
          </p>
          <h3 className={cn("mt-2 font-serif text-[1.4rem] leading-tight md:text-[1.7rem]", dark ? "text-ivory" : "text-ink")}>
            {product.name}
          </h3>
          <p className={cn("mt-1 hidden text-[15px] leading-snug sm:block", dark ? "text-mist" : "text-stone")}>{product.tagline}</p>
          <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-4">
            <p className={cn("text-[13px] tracking-wide", dark ? "text-ivory" : "text-ink")}>
              <span className={dark ? "text-mist" : "text-stone"}>Dès </span>
              <Price amountXof={startingPrice(product)} className="font-normal" />
            </p>
            {status !== "in" && <StockBadge stock={stock} tone={tone} />}
          </div>
        </div>
      </Link>
    </m.article>
  );
}

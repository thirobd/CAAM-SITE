"use client";

import { useState } from "react";
import { families, products, type Family } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

export function ShopGrid() {
  const [family, setFamily] = useState<Family | null>(null);
  const visible = family ? products.filter((p) => p.family === family) : products;

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrer par famille olfactive">
        <button className={`chip ${family === null ? "is-active" : ""}`} onClick={() => setFamily(null)} aria-pressed={family === null}>
          Tous
        </button>
        {families.map((f) => (
          <button key={f} className={`chip ${family === f ? "is-active" : ""}`} onClick={() => setFamily(f)} aria-pressed={family === f}>
            {f}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {visible.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}

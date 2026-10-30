// Génère supabase/seed.sql à partir du catalogue de démonstration (src/lib/catalog/data.ts).
// Usage : node scripts/generate-demo-seed.mjs   (Node 22.18+ : lit le TypeScript directement)

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { demoProducts } from "../src/lib/catalog/data.ts";

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const arr = (a) => (a.length ? `array[${a.map(q).join(", ")}]` : `'{}'::text[]`);
const opt = (v) => (v === undefined || v === null ? "null" : String(v));

const products = demoProducts
  .map(
    (p, i) =>
      `  (${[
        q(p.slug),
        q(p.name),
        q(p.brand),
        q(p.concentration),
        q(p.collection),
        q(p.family),
        q(p.tagline),
        q(p.description),
        arr(p.notes.top),
        arr(p.notes.heart),
        arr(p.notes.base),
        q(p.tint),
        arr(p.images),
        String(!!p.featured),
        opt(p.bestSellerRank),
        String(!!p.isNew),
        String(i + 1),
        `${q(p.addedAt)}::date`,
      ].join(", ")})`,
  )
  .join(",\n");

const variants = demoProducts
  .flatMap((p) => p.variants.map((v) => `  (${[q(p.slug), q(v.sku), v.sizeMl, v.priceXof, v.stock].join(", ")})`))
  .join(",\n");

const sql = `-- ============================================================
-- ĆAAM — DONNÉES DE DÉMONSTRATION (parfums, prix et stocks FICTIFS)
-- Généré par scripts/generate-demo-seed.mjs depuis src/lib/catalog/data.ts.
-- Ne pas modifier à la main : relancer le script.
--
-- À exécuter APRÈS la migration, dans Supabase > SQL Editor.
-- Peut être relancé sans risque : met à jour les parfums existants.
-- ============================================================

insert into public.products
  (slug, name, brand, concentration, collection, family, tagline, description,
   notes_top, notes_heart, notes_base, tint, images, featured, best_seller_rank, is_new, position, added_at)
values
${products}
on conflict (slug) do update set
  name = excluded.name,
  brand = excluded.brand,
  concentration = excluded.concentration,
  collection = excluded.collection,
  family = excluded.family,
  tagline = excluded.tagline,
  description = excluded.description,
  notes_top = excluded.notes_top,
  notes_heart = excluded.notes_heart,
  notes_base = excluded.notes_base,
  tint = excluded.tint,
  images = excluded.images,
  featured = excluded.featured,
  best_seller_rank = excluded.best_seller_rank,
  is_new = excluded.is_new,
  position = excluded.position,
  added_at = excluded.added_at;

insert into public.product_variants (product_id, sku, size_ml, price_xof, stock)
select p.id, v.sku, v.size_ml, v.price_xof, v.stock
from (values
${variants}
) as v (slug, sku, size_ml, price_xof, stock)
join public.products p on p.slug = v.slug
on conflict (sku) do update set
  size_ml = excluded.size_ml,
  price_xof = excluded.price_xof,
  stock = excluded.stock;
`;

const out = join(import.meta.dirname, "..", "supabase", "seed.sql");
writeFileSync(out, sql, "utf8");
console.log(`seed.sql : ${demoProducts.length} parfums, ${demoProducts.reduce((n, p) => n + p.variants.length, 0)} contenances → ${out}`);

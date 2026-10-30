"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { inputClass } from "@/components/checkout/field";
import { LOW_STOCK_THRESHOLD } from "@/lib/catalog/stock";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { updateVariant } from "@/server/admin/products";

export type StockRow = { id: string; productName: string; published: boolean; sizeMl: number; sku: string; priceXof: number; stock: number };

function Row({ row }: { row: StockRow }) {
  const [saved, setSaved] = useState({ price: row.priceXof, stock: row.stock });
  const [price, setPrice] = useState(String(row.priceXof));
  const [stock, setStock] = useState(String(row.stock));
  const [status, setStatus] = useState<"idle" | "saved" | string>("idle");
  const [pending, startTransition] = useTransition();

  const priceValue = Number(price);
  const stockValue = Number(stock);
  const valid = price.trim() !== "" && stock.trim() !== "" && Number.isInteger(priceValue) && priceValue >= 0 && Number.isInteger(stockValue) && stockValue >= 0;
  const dirty = priceValue !== saved.price || stockValue !== saved.stock;

  function save() {
    if (!valid) return;
    startTransition(async () => {
      const result = await updateVariant(row.id, { priceXof: priceValue, stock: stockValue });
      if (result.ok) {
        setSaved({ price: priceValue, stock: stockValue });
        setStatus("saved");
      } else {
        setStatus(result.message ?? "Échec de l'enregistrement.");
      }
    });
  }

  const cell = cn(inputClass, "h-11 border-ink/20");

  return (
    <li className="grid grid-cols-2 items-end gap-x-3 gap-y-6 border-b border-ink/10 pb-8 pt-4 sm:grid-cols-[1.6fr_1fr_0.7fr_auto]">
      <div className="col-span-2 sm:col-span-1">
        <p className="font-serif text-xl leading-tight">
          {row.productName} <span className="font-sans text-[13px] text-stone">· {row.sizeMl} ml</span>
        </p>
        <p className="text-[12px] text-stone">
          {row.sku}
          {!row.published && " · masqué"}
          {saved.stock === 0 ? <span className="text-danger"> · épuisé</span> : saved.stock <= LOW_STOCK_THRESHOLD && <span className="text-warning"> · stock faible</span>}
        </p>
      </div>
      <label className="relative flex flex-col gap-1.5 text-[12px] text-stone">
        Prix (FCFA)
        <input
          inputMode="numeric"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className={cell}
          aria-label={`Prix de ${row.productName} ${row.sizeMl} ml en FCFA`}
        />
        {/* Sous le champ, hors du flux : les champs prix et stock restent alignés. */}
        {valid && <span className="absolute -bottom-5 left-0 text-[11px]">≈ {formatMoney(priceValue, "EUR")}</span>}
      </label>
      <label className="flex flex-col gap-1.5 text-[12px] text-stone">
        Stock
        <input
          inputMode="numeric"
          value={stock}
          onChange={(e) => {
            setStock(e.target.value);
            setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className={cell}
          aria-label={`Stock de ${row.productName} ${row.sizeMl} ml`}
        />
      </label>
      <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || !valid || pending}
          className="inline-flex h-11 min-w-32 items-center justify-center gap-2 bg-ink px-4 text-[11px] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-35"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" /> : "Enregistrer"}
        </button>
        <span role="status" className="text-[12px]">
          {status === "saved" && !dirty && (
            <span className="inline-flex items-center gap-1 text-success">
              <Check className="size-3.5" strokeWidth={2} aria-hidden="true" /> Enregistré
            </span>
          )}
          {status !== "idle" && status !== "saved" && <span className="text-danger">{status}</span>}
          {!valid && <span className="text-danger">Nombres entiers positifs.</span>}
        </span>
      </div>
    </li>
  );
}

export function StockTable({ rows }: { rows: StockRow[] }) {
  return (
    <ul className="border-t border-ink/10">
      {rows.map((row) => (
        <Row key={row.id} row={row} />
      ))}
    </ul>
  );
}

import { stockStatus } from "@/lib/catalog/stock";
import { cn } from "@/lib/utils";

const dots = { in: "bg-success", low: "bg-warning", out: "bg-stone/50" };

/** Indicateur de disponibilité : En stock / Plus que N / Épuisé. */
export function StockBadge({ stock, tone = "light", className }: { stock: number; tone?: "light" | "dark"; className?: string }) {
  const status = stockStatus(stock);
  const label = status === "out" ? "Épuisé" : status === "low" ? `Plus que ${stock} en stock` : "En stock";
  const color = tone === "dark" ? "text-mist" : status === "out" ? "text-stone" : "text-ink";
  return (
    <span className={cn("inline-flex items-center gap-2 text-[13px]", color, className)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", dots[status])} />
      {label}
    </span>
  );
}

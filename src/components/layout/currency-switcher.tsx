"use client";

import { useCurrency } from "@/components/providers/currency";
import { currencies } from "@/lib/currency";
import { cn } from "@/lib/utils";

/** Sélecteur FCFA / € (affichage). Les commandes restent facturées en FCFA. */
export function CurrencySwitcher({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const { currency, setCurrency } = useCurrency();
  const dark = tone === "dark";
  return (
    <div
      role="group"
      aria-label="Devise d'affichage"
      title="Prix facturés en FCFA. Conversion en euros à la parité fixe 1 € = 655,957 FCFA."
      className={cn("inline-flex border", dark ? "border-ivory/20" : "border-ink/20", className)}
    >
      {currencies.map((c) => {
        const active = c.code === currency;
        return (
          <button
            key={c.code}
            type="button"
            onClick={() => setCurrency(c.code)}
            aria-pressed={active}
            aria-label={c.label}
            className={cn(
              "h-8 min-w-11 px-2.5 text-[10px] font-normal tracking-[0.18em] transition-colors duration-300",
              active
                ? dark
                  ? "bg-ivory text-ink"
                  : "bg-ink text-ivory"
                : dark
                  ? "text-ivory/70 hover:text-ivory"
                  : "text-ink/60 hover:text-ink",
            )}
          >
            {c.short}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
};

export function QuantityStepper({ value, min = 1, max, onChange, label, size = "md", className }: Props) {
  const box = size === "sm" ? "size-8" : "size-11";
  return (
    <div className={cn("inline-flex items-center border border-ink/20", className)} role="group" aria-label={label}>
      <button
        type="button"
        className={cn(box, "grid place-items-center transition-colors hover:bg-ink/5 disabled:opacity-30")}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
      >
        <Minus className="size-3.5" strokeWidth={1.5} />
      </button>
      <span className={cn("min-w-8 text-center tabular-nums", size === "sm" ? "text-sm" : "text-base")} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={cn(box, "grid place-items-center transition-colors hover:bg-ink/5 disabled:opacity-30")}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
      >
        <Plus className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

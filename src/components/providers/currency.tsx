"use client";

import { useCallback, useSyncExternalStore } from "react";
import { formatMoney, isCurrencyCode, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

const KEY = "caam-currency";
const listeners = new Set<() => void>();
let memory: CurrencyCode | null = null;

function getSnapshot(): CurrencyCode {
  if (memory) return memory;
  try {
    const stored = window.localStorage.getItem(KEY);
    return isCurrencyCode(stored) ? stored : "XOF";
  } catch {
    return "XOF";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function setCurrency(code: CurrencyCode) {
  memory = code;
  try {
    window.localStorage.setItem(KEY, code);
  } catch {
    // Préférence conservée en mémoire seulement.
  }
  listeners.forEach((l) => l());
}

/** Devise d'affichage choisie par le visiteur (FCFA par défaut, € à titre indicatif). */
export function useCurrency() {
  const currency = useSyncExternalStore(subscribe, getSnapshot, () => "XOF" as CurrencyCode);
  const format = useCallback((amountXof: number) => formatMoney(amountXof, currency), [currency]);
  return { currency, setCurrency, format };
}

export function Price({ amountXof, className }: { amountXof: number; className?: string }) {
  const { format } = useCurrency();
  return <span className={cn("tabular-nums lining-nums", className)}>{format(amountXof)}</span>;
}

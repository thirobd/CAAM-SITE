"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { setPublished } from "@/server/admin/products";

/** Publier ou masquer un parfum depuis la liste, en un geste. */
export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [value, setValue] = useState(published);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !value;
    setValue(next);
    setError(null);
    startTransition(async () => {
      const result = await setPublished(id, next);
      if (!result.ok) {
        setValue(!next);
        setError(result.message ?? "Échec de l'enregistrement.");
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={toggle}
        disabled={pending}
        className={cn(
          "inline-flex h-9 items-center gap-2 border px-3 text-[12px] uppercase tracking-[0.16em] transition-colors disabled:opacity-60",
          value ? "border-success/50 bg-success/10 text-success" : "border-ink/20 text-stone",
        )}
      >
        <span className={cn("size-2 rounded-full", value ? "bg-success" : "bg-stone/50")} aria-hidden="true" />
        {value ? "Publié" : "Masqué"}
      </button>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}

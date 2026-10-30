"use client";

import { useHydrated } from "@/lib/use-hydrated";

const formatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

/** Date affichée dans le fuseau horaire de l'appareil du propriétaire. */
export function LocalDate({ iso }: { iso: string }) {
  const hydrated = useHydrated();
  return <time dateTime={iso}>{hydrated ? formatter.format(new Date(iso)) : iso.slice(0, 10)}</time>;
}

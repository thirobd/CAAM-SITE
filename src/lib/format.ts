import { site } from "./site";

const wholeFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: site.currency,
  maximumFractionDigits: 0,
});

const centsFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: site.currency,
  minimumFractionDigits: 2,
});

/** Formate un montant exprimé en centimes, ex. 9500 → « 95 € », 1490 → « 14,90 € ». */
export function formatPrice(cents: number): string {
  return (cents % 100 === 0 ? wholeFormatter : centsFormatter).format(cents / 100);
}

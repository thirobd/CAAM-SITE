// Monnaies. Les prix sont stockés et facturés en francs CFA (XOF).
// L'euro est affiché à titre indicatif via la parité FIXE officielle XOF/EUR
// (ce n'est pas un taux de change en temps réel).

export type CurrencyCode = "XOF" | "EUR";

export const currencies: { code: CurrencyCode; label: string; short: string }[] = [
  { code: "XOF", label: "Franc CFA (FCFA)", short: "FCFA" },
  { code: "EUR", label: "Euro (€)", short: "€" },
];

export const XOF_PER_EUR = 655.957;

const xofNumber = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const eurFormatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function formatXof(amount: number): string {
  return `${xofNumber.format(Math.round(amount))} FCFA`;
}

export function formatMoney(amountXof: number, currency: CurrencyCode): string {
  return currency === "EUR" ? eurFormatter.format(amountXof / XOF_PER_EUR) : formatXof(amountXof);
}

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return value === "XOF" || value === "EUR";
}

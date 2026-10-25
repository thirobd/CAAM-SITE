// Zones de livraison — VALEURS DE DÉMONSTRATION. La phase 6 remplacera ce module par des
// zones et tarifs gérés en base (avec suivi de commande).

export type Country = { code: string; label: string };

export const countries: Country[] = [
  { code: "SN", label: "Sénégal" },
  { code: "FR", label: "France" },
  { code: "BE", label: "Belgique" },
  { code: "CH", label: "Suisse" },
  { code: "IT", label: "Italie" },
  { code: "ES", label: "Espagne" },
  { code: "DE", label: "Allemagne" },
  { code: "GB", label: "Royaume-Uni" },
  { code: "CI", label: "Côte d'Ivoire" },
  { code: "ML", label: "Mali" },
  { code: "MR", label: "Mauritanie" },
  { code: "GM", label: "Gambie" },
  { code: "GN", label: "Guinée" },
  { code: "MA", label: "Maroc" },
  { code: "US", label: "États-Unis" },
  { code: "CA", label: "Canada" },
  { code: "OTHER", label: "Autre pays" },
];

export type DeliveryEstimate = {
  zone: "dakar" | "senegal" | "international";
  label: string;
  /** null = tarif communiqué après la commande (international). */
  feeXof: number | null;
  delay: string;
};

export const deliveryZones: DeliveryEstimate[] = [
  { zone: "dakar", label: "Dakar et environs", feeXof: 2000, delay: "24 à 48 h" },
  { zone: "senegal", label: "Autres régions du Sénégal", feeXof: 4000, delay: "2 à 4 jours" },
  { zone: "international", label: "Europe et international", feeXof: null, delay: "Délai à confirmer" },
];

export function isCountryCode(value: unknown): boolean {
  return countries.some((c) => c.code === value);
}

export function estimateDelivery(countryCode: string, city: string): DeliveryEstimate {
  if (countryCode !== "SN") return deliveryZones[2];
  const isDakar = /dakar|pikine|gu[eé]diawaye|rufisque|keur massar/i.test(city);
  return isDakar ? deliveryZones[0] : deliveryZones[1];
}

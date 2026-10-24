// Zones et tarifs de livraison. Montants en centimes. TARIFS PROVISOIRES à ajuster.
// Les codes pays sont ceux d'ISO 3166 (FR, US, SN…) acceptés par Stripe.

import type Stripe from "stripe";

type Country = Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry;

export type ShippingZone = {
  id: "france" | "europe" | "monde";
  label: string;
  rate: number;
  /** Livraison offerte à partir de ce sous-total (facultatif). */
  freeFrom?: number;
  /** Délai en jours ouvrés. */
  delay: { min: number; max: number };
  countries: Country[];
};

export const shippingZones: ShippingZone[] = [
  {
    id: "france",
    label: "France métropolitaine & Monaco",
    rate: 690,
    freeFrom: 10000,
    delay: { min: 2, max: 4 },
    countries: ["FR", "MC"],
  },
  {
    id: "europe",
    label: "Europe",
    rate: 1490,
    delay: { min: 4, max: 7 },
    countries: [
      "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "DE", "GR", "HU", "IE", "IT",
      "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
      "CH", "GB", "NO", "IS", "LI", "AD",
    ],
  },
  {
    id: "monde",
    label: "Reste du monde",
    rate: 2490,
    delay: { min: 7, max: 15 },
    countries: [
      // Amériques
      "US", "CA", "MX", "BR", "AR", "CL", "CO",
      // Moyen-Orient
      "AE", "SA", "QA", "KW", "BH", "OM", "JO", "LB", "IL", "TR",
      // Afrique
      "MA", "TN", "DZ", "EG", "SN", "CI", "CM", "GA", "ML", "BF", "BJ", "TG", "GN", "NE",
      "CG", "CD", "MG", "MU", "NG", "GH", "KE", "ZA",
      // Asie & Océanie
      "JP", "KR", "CN", "HK", "SG", "MY", "TH", "IN", "ID", "PH", "VN", "TW", "AU", "NZ",
      // Outre-mer
      "RE", "GP", "MQ", "GF", "YT", "NC", "PF",
    ],
  },
];

export function getZone(id: string): ShippingZone | undefined {
  return shippingZones.find((z) => z.id === id);
}

export function shippingCost(zone: ShippingZone, subtotal: number): number {
  return zone.freeFrom !== undefined && subtotal >= zone.freeFrom ? 0 : zone.rate;
}

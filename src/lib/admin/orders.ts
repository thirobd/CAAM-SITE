// Suivi des commandes dans l'espace propriétaire : statuts et libellés.

export type OrderStatus = "nouvelle" | "confirmee" | "livree" | "annulee";

export const orderStatuses: { id: OrderStatus; label: string; hint: string }[] = [
  { id: "nouvelle", label: "Nouvelle", hint: "Passée sur le site, à confirmer avec le client sur WhatsApp." },
  { id: "confirmee", label: "Confirmée", hint: "Le stock a été retiré." },
  { id: "livree", label: "Livrée", hint: "Remise au client." },
  { id: "annulee", label: "Annulée", hint: "Le stock éventuellement retiré a été rendu." },
];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return orderStatuses.some((s) => s.id === value);
}

export type AdminOrderItem = { id: string; product_name: string; size_ml: number; quantity: number; unit_price_xof: number };

export type AdminOrder = {
  id: string;
  reference: string;
  status: OrderStatus;
  /** Compte client ayant passé la commande, null pour une commande sans compte. */
  user_id: string | null;
  customer_name: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  notes: string;
  payment_method: string;
  subtotal_xof: number;
  delivery_label: string;
  delivery_fee_xof: number | null;
  total_xof: number;
  stock_applied: boolean;
  admin_note: string;
  created_at: string;
  order_items: AdminOrderItem[];
};

// Indicatifs des pays proposés à la commande (src/lib/delivery.ts), pour les numéros saisis sans indicatif.
const dialCodes: Record<string, string> = {
  Sénégal: "221",
  France: "33",
  Belgique: "32",
  Suisse: "41",
  Italie: "39",
  Espagne: "34",
  Allemagne: "49",
  "Royaume-Uni": "44",
  "Côte d'Ivoire": "225",
  Mali: "223",
  Mauritanie: "222",
  Gambie: "220",
  Guinée: "224",
  Maroc: "212",
  "États-Unis": "1",
  Canada: "1",
};

/** Numéro au format international sans « + », ou null s'il ne peut pas être deviné. */
export function internationalNumber(phone: string, country: string): string | null {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  const code = dialCodes[country];
  if (!code) return null;
  // Le 0 initial des numéros nationaux disparaît au format international (sauf en Italie).
  return code + (country !== "Italie" ? digits.replace(/^0/, "") : digits);
}

/** Lien WhatsApp vers le client, avec un message d'accroche. */
export function customerWhatsappUrl(order: Pick<AdminOrder, "phone" | "country" | "reference">): string | null {
  const number = internationalNumber(order.phone, order.country);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(`Bonjour, ici ĆAAM, au sujet de votre commande ${order.reference}.`)}`;
}

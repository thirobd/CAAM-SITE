// Types et validation du formulaire de commande, partagés entre navigateur et serveur.

import { formatMoney, formatXof } from "./currency";
import { isCountryCode } from "./delivery";

export type PaymentMethod = "cash" | "mobile-money" | "card";

export const paymentMethods: { id: PaymentMethod; label: string; detail: string }[] = [
  {
    id: "cash",
    label: "Paiement à la livraison",
    detail: "En espèces, à la réception du colis (Sénégal uniquement).",
  },
  {
    id: "mobile-money",
    label: "Mobile Money",
    detail: "Wave ou Orange Money. ĆAAM vous indique la marche à suivre sur WhatsApp.",
  },
  {
    id: "card",
    label: "Carte bancaire",
    detail: "Visa, Mastercard. Pas de paiement sur le site : ĆAAM vous indique la marche à suivre.",
  },
];

export type CheckoutFields = {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethod | "";
};

export type CheckoutItem = { variantId: string; quantity: number };

export type FieldErrors = Partial<Record<keyof CheckoutFields, string>>;

export const emptyCheckout: CheckoutFields = {
  fullName: "",
  phone: "",
  country: "SN",
  city: "",
  address: "",
  notes: "",
  paymentMethod: "",
};

export function validateCheckout(f: CheckoutFields): FieldErrors {
  const errors: FieldErrors = {};
  if (f.fullName.trim().length < 2) errors.fullName = "Indiquez votre nom complet.";
  const digits = f.phone.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15 || !/^[+\d\s().-]+$/.test(f.phone.trim()))
    errors.phone = "Indiquez un numéro de téléphone valide, avec l'indicatif si vous êtes à l'étranger.";
  if (!isCountryCode(f.country)) errors.country = "Choisissez un pays.";
  if (f.city.trim().length < 2) errors.city = "Indiquez votre ville.";
  if (f.address.trim().length < 5) errors.address = "Indiquez une adresse de livraison précise.";
  if (f.notes.length > 500) errors.notes = "500 caractères maximum.";
  if (!paymentMethods.some((m) => m.id === f.paymentMethod)) errors.paymentMethod = "Choisissez un mode de paiement.";
  else if (f.paymentMethod === "cash" && f.country !== "SN")
    errors.paymentMethod = "Le paiement à la livraison est réservé aux livraisons au Sénégal.";
  return errors;
}

export type OrderLine = { name: string; sizeMl: number; quantity: number; unitPriceXof: number };

/** Commande vérifiée par le serveur, transmise à ĆAAM par le client via WhatsApp. */
export type Order = {
  reference: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  countryLabel: string;
  notes: string;
  paymentMethod: PaymentMethod;
  lines: OrderLine[];
  subtotalXof: number;
  deliveryLabel: string;
  deliveryFeeXof: number | null;
  totalXof: number;
};

export type PlaceOrderResult =
  | { ok: true; order: Order }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

/** Texte du message WhatsApp envoyé à ĆAAM (gras WhatsApp entre astérisques). */
export function orderMessage(order: Order): string {
  const payment = paymentMethods.find((m) => m.id === order.paymentMethod)?.label ?? order.paymentMethod;
  const delivery = order.deliveryFeeXof === null ? "sur devis" : formatXof(order.deliveryFeeXof);
  const total = `${formatXof(order.totalXof)} (≈ ${formatMoney(order.totalXof, "EUR")})${order.deliveryFeeXof === null ? ", hors livraison" : ""}`;

  return [
    "Bonjour ĆAAM, je souhaite passer commande.",
    "",
    `*Référence : ${order.reference}*`,
    "",
    ...order.lines.map((l) => `• ${l.quantity} × ${l.name} (${l.sizeMl} ml) : ${formatXof(l.unitPriceXof * l.quantity)}`),
    "",
    `Sous-total : ${formatXof(order.subtotalXof)}`,
    `Livraison (${order.deliveryLabel}) : ${delivery}`,
    `*Total : ${total}*`,
    "",
    `Paiement souhaité : ${payment}`,
    "",
    `Nom : ${order.customerName}`,
    `Téléphone : ${order.phone}`,
    `Adresse : ${order.address}, ${order.city}, ${order.countryLabel}`,
    ...(order.notes ? [`Instructions : ${order.notes}`] : []),
  ].join("\n");
}

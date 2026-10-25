// Types et validation du formulaire de commande, partagés entre navigateur et serveur.

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
    detail: "Wave ou Orange Money. Le lien de paiement n'est pas encore activé.",
  },
  {
    id: "card",
    label: "Carte bancaire",
    detail: "Visa, Mastercard. Le paiement en ligne n'est pas encore activé.",
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

export type DemoOrderLine = { name: string; sizeMl: number; quantity: number; unitPriceXof: number };

export type DemoOrder = {
  reference: string;
  createdAt: string;
  customerName: string;
  city: string;
  countryLabel: string;
  paymentMethod: PaymentMethod;
  lines: DemoOrderLine[];
  subtotalXof: number;
  deliveryFeeXof: number | null;
  totalXof: number;
};

export type PlaceOrderResult =
  | { ok: true; order: DemoOrder }
  | { ok: false; message: string; fieldErrors?: FieldErrors };

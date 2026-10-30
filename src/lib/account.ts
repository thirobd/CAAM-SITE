// Comptes clients : règles partagées entre le navigateur et le serveur.

export const MIN_PASSWORD_LENGTH = 8;

export type CustomerProfile = {
  email: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  address: string;
};

export type CustomerOrder = {
  reference: string;
  status: "nouvelle" | "confirmee" | "livree" | "annulee";
  created_at: string;
  delivery_fee_xof: number | null;
  total_xof: number;
  items: { name: string; size_ml: number; quantity: number; unit_price_xof: number }[];
};

/** Statuts vus par le client (le libellé « nouvelle » de l'admin devient « en attente »). */
export const customerStatusLabels: Record<CustomerOrder["status"], string> = {
  nouvelle: "En attente de confirmation",
  confirmee: "Confirmée",
  livree: "Livrée",
  annulee: "Annulée",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return EMAIL.test(value.trim());
}

/** Page de retour après connexion : uniquement une adresse interne du site. */
export function safeReturnPath(value: unknown, fallback = "/compte"): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\") ? value : fallback;
}

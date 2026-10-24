import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

/** Renvoie le client Stripe, ou null si la clé secrète n'est pas configurée. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "sk_test_xxx") return null;
  client ??= new Stripe(key);
  return client;
}

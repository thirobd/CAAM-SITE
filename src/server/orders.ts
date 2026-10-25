"use server";

import { findVariant } from "@/lib/catalog/repository";
import { MAX_PER_ORDER } from "@/lib/catalog/stock";
import {
  validateCheckout,
  type CheckoutFields,
  type CheckoutItem,
  type DemoOrderLine,
  type PaymentMethod,
  type PlaceOrderResult,
} from "@/lib/checkout";
import { countries, estimateDelivery } from "@/lib/delivery";

/**
 * Commande de DÉMONSTRATION.
 * Valide le formulaire et vérifie les prix et le stock à partir du catalogue côté serveur,
 * puis renvoie une référence. RIEN n'est enregistré, envoyé ni débité.
 *
 * Phase 4 : remplacer la fin de cette fonction par une transaction Supabase
 * (insertion de la commande + décrément du stock), puis brancher le prestataire de paiement.
 */
export async function placeDemoOrder(input: CheckoutFields, items: CheckoutItem[]): Promise<PlaceOrderResult> {
  // Les arguments d'une action serveur viennent du navigateur : on les normalise avant tout.
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const fields: CheckoutFields = {
    fullName: str(input?.fullName),
    phone: str(input?.phone),
    country: str(input?.country),
    city: str(input?.city),
    address: str(input?.address),
    notes: str(input?.notes),
    paymentMethod: str(input?.paymentMethod) as PaymentMethod | "",
  };
  const fieldErrors = validateCheckout(fields);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Certains champs sont à corriger.", fieldErrors };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, message: "Votre panier est vide." };
  }

  const lines: DemoOrderLine[] = [];
  for (const item of items) {
    const found = await findVariant(String(item.variantId));
    const quantity = Number(item.quantity);
    if (!found || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_PER_ORDER) {
      return { ok: false, message: "Un article de votre panier n'est plus disponible. Merci de le retirer." };
    }
    if (quantity > found.variant.stock) {
      return {
        ok: false,
        message:
          found.variant.stock === 0
            ? `${found.product.name} (${found.variant.sizeMl} ml) est épuisé. Merci de le retirer du panier.`
            : `Il ne reste que ${found.variant.stock} ${found.product.name} (${found.variant.sizeMl} ml). Merci d'ajuster la quantité.`,
      };
    }
    lines.push({
      name: found.product.name,
      sizeMl: found.variant.sizeMl,
      quantity,
      unitPriceXof: found.variant.priceXof,
    });
  }

  const subtotalXof = lines.reduce((sum, l) => sum + l.unitPriceXof * l.quantity, 0);
  const delivery = estimateDelivery(fields.country, fields.city);

  // Petit délai pour rendre perceptible l'état « traitement en cours » de la démo.
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    ok: true,
    order: {
      reference: `CAAM-DEMO-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customerName: fields.fullName.trim(),
      city: fields.city.trim(),
      countryLabel: countries.find((c) => c.code === fields.country)?.label ?? fields.country,
      paymentMethod: fields.paymentMethod as PaymentMethod,
      lines,
      subtotalXof,
      deliveryFeeXof: delivery.feeXof,
      totalXof: subtotalXof + (delivery.feeXof ?? 0),
    },
  };
}

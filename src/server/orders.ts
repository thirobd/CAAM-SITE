"use server";

import { findVariant } from "@/lib/catalog/repository";
import { MAX_PER_ORDER } from "@/lib/catalog/stock";
import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase/session";
import {
  validateCheckout,
  type CheckoutFields,
  type CheckoutItem,
  type OrderLine,
  type PaymentMethod,
  type PlaceOrderResult,
} from "@/lib/checkout";
import { countries, estimateDelivery } from "@/lib/delivery";

/**
 * Prépare une commande à envoyer par WhatsApp.
 * Valide le formulaire, vérifie les prix et le stock en direct dans le catalogue, enregistre la
 * commande (statut « nouvelle », visible dans /admin/commandes) puis renvoie la commande et sa
 * référence. Rien n'est débité : le client transmet la commande en envoyant le message WhatsApp,
 * et le stock n'est retiré que lorsque ĆAAM confirme la commande.
 * Client connecté : la commande est rattachée à son compte et, s'il le souhaite (remember),
 * ses coordonnées sont mémorisées pour la prochaine fois.
 */
export async function placeOrder(input: CheckoutFields, items: CheckoutItem[], remember = false): Promise<PlaceOrderResult> {
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

  const lines: OrderLine[] = [];
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
  const countryLabel = countries.find((c) => c.code === fields.country)?.label ?? fields.country;

  // Enregistrement pour l'espace propriétaire. La base relit elle-même prix et stock.
  let reference = `CAAM-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  // Session du client (s'il est connecté) : la base rattache la commande à son compte.
  const supabase = process.env.CATALOG_SOURCE === "demo" || !isSupabaseConfigured() ? null : await createSessionClient();
  if (supabase) {
    const { data, error } = await supabase.rpc("place_order", {
      p_customer: {
        name: fields.fullName,
        phone: fields.phone,
        country: countryLabel,
        city: fields.city,
        address: fields.address,
        notes: fields.notes,
        payment_method: fields.paymentMethod,
      },
      p_items: items.map((i) => ({ variant_id: String(i.variantId), quantity: Number(i.quantity) })),
      p_delivery_label: delivery.label,
      p_delivery_fee_xof: delivery.feeXof,
    });
    if (error) {
      if (/Stock insuffisant|Article indisponible/.test(error.message)) {
        return { ok: false, message: "Un article vient d'être épuisé. Actualisez la page et vérifiez votre panier." };
      }
      if (/Trop de commandes/.test(error.message)) {
        return { ok: false, message: "Trop de commandes en peu de temps. Réessayez un peu plus tard, ou écrivez-nous directement sur WhatsApp." };
      }
      // La commande reste possible par WhatsApp même si l'enregistrement échoue.
      console.error("Commande non enregistrée :", error.message);
    } else if (typeof data === "string") {
      reference = data;
    }

    if (remember === true) {
      const { data: claims } = await supabase.auth.getClaims();
      const userId = claims?.claims?.sub;
      if (userId) {
        await supabase
          .from("customers")
          .update({
            full_name: fields.fullName.trim(),
            phone: fields.phone.trim(),
            country: fields.country,
            city: fields.city.trim(),
            address: fields.address.trim(),
          })
          .eq("user_id", userId);
      }
    }
  }

  return {
    ok: true,
    order: {
      reference,
      createdAt: new Date().toISOString(),
      customerName: fields.fullName.trim(),
      phone: fields.phone.trim(),
      address: fields.address.trim(),
      city: fields.city.trim(),
      countryLabel,
      notes: fields.notes.trim(),
      paymentMethod: fields.paymentMethod as PaymentMethod,
      lines,
      subtotalXof,
      deliveryLabel: delivery.label,
      deliveryFeeXof: delivery.feeXof,
      totalXof: subtotalXof + (delivery.feeXof ?? 0),
    },
  };
}

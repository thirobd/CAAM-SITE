import type Stripe from "stripe";
import { findVariant, MAX_QUANTITY } from "@/lib/catalog";
import { getZone, shippingCost } from "@/lib/shipping";
import { site } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

type Body = {
  items?: { slug?: unknown; variantId?: unknown; quantity?: unknown }[];
  zone?: unknown;
};

function fail(error: string, status = 400) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return fail(
      "Le paiement n'est pas encore configuré. Ajoutez STRIPE_SECRET_KEY dans le fichier .env.local.",
      503,
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return fail("Requête invalide.");
  }

  const zone = typeof body.zone === "string" ? getZone(body.zone) : undefined;
  if (!zone) return fail("Zone de livraison inconnue.");
  if (!Array.isArray(body.items) || body.items.length === 0) return fail("Votre panier est vide.");

  // Les prix viennent toujours du catalogue côté serveur, jamais du navigateur.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;
  for (const item of body.items) {
    const quantity = Number(item.quantity);
    const found =
      typeof item.slug === "string" && typeof item.variantId === "string"
        ? findVariant(item.slug, item.variantId)
        : undefined;
    if (!found || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return fail("Un article de votre panier n'est plus disponible. Merci de le retirer.");
    }
    subtotal += found.variant.price * quantity;
    lineItems.push({
      quantity,
      price_data: {
        currency: site.currency.toLowerCase(),
        unit_amount: found.variant.price,
        product_data: {
          name: `${found.product.name} — Eau de parfum ${found.variant.volumeMl} ml`,
          metadata: { slug: found.product.slug, variant: found.variant.id },
        },
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      line_items: lineItems,
      adaptive_pricing: { enabled: true },
      shipping_address_collection: { allowed_countries: zone.countries },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: `Livraison ${zone.label}`,
            fixed_amount: { amount: shippingCost(zone, subtotal), currency: site.currency.toLowerCase() },
            delivery_estimate: {
              minimum: { unit: "business_day", value: zone.delay.min },
              maximum: { unit: "business_day", value: zone.delay.max },
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      metadata: { zone: zone.id },
      success_url: `${site.url}/commande/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/boutique`,
    });

    if (!session.url) return fail("Le paiement n'a pas pu démarrer.", 502);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("[checkout]", error);
    return fail("Le paiement n'a pas pu démarrer. Merci de réessayer dans un instant.", 502);
  }
}

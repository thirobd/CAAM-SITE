import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/cart/ClearCart";
import { formatPrice } from "@/lib/format";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Merci pour votre commande",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ session_id?: string | string[] }> };

async function loadSession(sessionId: string | undefined) {
  const stripe = getStripe();
  if (!stripe || !sessionId) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.status === "complete" ? session : null;
  } catch {
    return null;
  }
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const session = await loadSession(typeof session_id === "string" ? session_id : undefined);

  if (!session) {
    return (
      <section className="section container container--narrow center">
        <span className="eyebrow">Commande</span>
        <h1 className="display display--page">Commande introuvable</h1>
        <p className="lead">
          Nous n&apos;avons pas pu retrouver cette commande. Si vous avez été débité, vous recevrez un
          e-mail de confirmation sous peu.
        </p>
        <Link href="/contact" className="button button--outline">
          Nous contacter
        </Link>
      </section>
    );
  }

  const firstName = session.customer_details?.name?.split(" ")[0];

  return (
    <section className="section container container--narrow center">
      <ClearCart />
      <span className="eyebrow">Commande confirmée</span>
      <h1 className="display display--page">Merci{firstName ? `, ${firstName}` : ""}.</h1>
      <p className="lead">
        Votre commande de {formatPrice(session.amount_total ?? 0)} est confirmée. Un reçu a été envoyé à{" "}
        {session.customer_details?.email ?? "votre adresse e-mail"}. Nous préparons votre colis avec soin.
      </p>
      <Link href="/boutique" className="button button--outline">
        Retour à la boutique
      </Link>
    </section>
  );
}

import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-luxe pb-24 pt-12 md:pt-16">
      <CheckoutView />
    </div>
  );
}

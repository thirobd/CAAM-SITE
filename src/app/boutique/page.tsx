import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Découvrez toutes les eaux de parfum ĆAAM, disponibles en 30, 50 et 100 ml.",
};

export default function ShopPage() {
  return (
    <section className="section container">
      <header className="page-head">
        <span className="eyebrow">Boutique</span>
        <h1 className="display display--page">La collection</h1>
        <p className="lead">Des eaux de parfum composées à deux, disponibles en 30, 50 et 100 ml.</p>
      </header>
      <ShopGrid />
    </section>
  );
}

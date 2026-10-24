import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import { getProduct, products } from "@/lib/catalog";
import { shippingZones } from "@/lib/shipping";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return { title: product.name, description: `${product.tagline}. ${product.description}` };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const pyramid = [
    { label: "Notes de tête", notes: product.notes.top },
    { label: "Notes de cœur", notes: product.notes.heart },
    { label: "Notes de fond", notes: product.notes.base },
  ];

  return (
    <>
      <section className="product container">
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link href="/boutique">Boutique</Link> <span aria-hidden="true">/</span> {product.name}
        </nav>

        <div className="product__visual">
          <ProductVisual product={product} sizes="(max-width: 900px) 100vw, 50vw" priority />
        </div>

        <div className="product__info">
          <span className="eyebrow">{product.family} · Eau de parfum</span>
          <h1 className="display display--product">{product.name}</h1>
          <p className="product__tagline">{product.tagline}</p>
          <p>{product.description}</p>

          <AddToCart product={product} />

          <div className="pyramid">
            {pyramid.map((tier) => (
              <div key={tier.label} className="pyramid__tier">
                <span className="eyebrow">{tier.label}</span>
                <span>{tier.notes.join(" · ")}</span>
              </div>
            ))}
          </div>

          <details className="accordion">
            <summary>Livraison & retours</summary>
            <ul>
              {shippingZones.map((z) => (
                <li key={z.id}>
                  {z.label} : {z.delay.min} à {z.delay.max} jours ouvrés
                </li>
              ))}
            </ul>
            <p>
              Retours acceptés sous 14 jours pour les flacons non ouverts.{" "}
              <Link href="/livraison">En savoir plus</Link>
            </p>
          </details>
          <details className="accordion">
            <summary>Conseils d&apos;application</summary>
            <p>
              Vaporisez à 15 cm de la peau, sur les points de chaleur : poignets, cou, creux du coude.
              Évitez de frotter, pour laisser le parfum se révéler à son rythme.
            </p>
          </details>
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2 className="heading">Vous aimerez aussi</h2>
        </div>
        <div className="product-grid product-grid--three">
          {others.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}

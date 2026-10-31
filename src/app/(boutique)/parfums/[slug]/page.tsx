import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog/repository";
import { getCollection, getFamily, productCollections } from "@/lib/catalog/taxonomy";
import { deliveryZones } from "@/lib/delivery";
import { formatXof } from "@/lib/currency";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return { title: "Parfum introuvable" };
  const title = `${product.name} — ${product.concentration}`;
  const description = `${product.tagline}. ${product.description}`;
  const path = `/parfums/${product.slug}`;
  // Partage (WhatsApp, Instagram…) : la photo du parfum plutôt que le logo.
  const images = product.images[0] ? [{ url: absoluteUrl(product.images[0]), alt: product.name }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: site.name, locale: "fr_SN", type: "website", images },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}

/** Données produit lisibles par Google (prix, disponibilité) : https://schema.org/Product */
function productJsonLd(product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>) {
  const url = absoluteUrl(`/parfums/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.tagline,
    image: product.images.map(absoluteUrl),
    brand: { "@type": "Brand", name: product.brand },
    category: product.concentration,
    url,
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      sku: v.sku,
      name: `${product.name} ${v.sizeMl} ml`,
      price: v.priceXof,
      priceCurrency: "XOF",
      availability: v.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
    })),
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const collection = getCollection(product.collection);
  const family = getFamily(product.family);
  const pyramid = [
    { label: "Notes de tête", notes: product.notes.top },
    { label: "Notes de cœur", notes: product.notes.heart },
    { label: "Notes de fond", notes: product.notes.base },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // Les « < » sont échappés : le contenu ne peut pas refermer la balise script.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c") }}
      />
      <div className="container-luxe pt-6 md:pt-10">
        <nav aria-label="Fil d'Ariane" className="text-[11px] uppercase tracking-[0.2em] text-stone">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/boutique" className="hover:text-ink">Boutique</Link> <span aria-hidden="true">/</span>
            </li>
            <li>
              <Link href={`/boutique?collection=${collection.id}`} className="hover:text-ink">{collection.label}</Link>{" "}
              <span aria-hidden="true">/</span>
            </li>
            <li aria-current="page" className="text-ink">{product.name}</li>
          </ol>
        </nav>
      </div>

      <section className="container-luxe grid gap-10 pb-20 pt-6 md:pt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery product={product} />
        </div>

        <div className="flex flex-col gap-8">
          <Reveal y={16}>
            <p className="eyebrow text-gold-deep">
              {product.brand} · {product.concentration}
            </p>
            <h1 className="mt-4 font-serif text-5xl font-light leading-none md:text-7xl">{product.name}</h1>
            <p className="mt-3 text-sm text-stone">
              {productCollections(product).map((id) => (
                <Fragment key={id}>
                  <Link href={`/boutique?collection=${id}`} className="underline-offset-4 hover:underline">{getCollection(id).label}</Link>
                  {" · "}
                </Fragment>
              ))}
              <Link href={`/boutique?famille=${family.id}`} className="underline-offset-4 hover:underline">{family.label}</Link>
            </p>
            <p className="mt-6 font-serif text-2xl italic leading-snug">{product.tagline}</p>
            <p className="mt-4 leading-relaxed text-stone">{product.description}</p>
          </Reveal>

          <ProductPurchase product={product} />

          <div className="border-t border-ink/10">
            {pyramid.map((tier) => (
              <div key={tier.label} className="grid gap-1 border-b border-ink/10 py-4 sm:grid-cols-[150px_1fr] sm:gap-4">
                <span className="eyebrow pt-1 text-gold-deep">{tier.label}</span>
                <span className="font-serif text-xl">{tier.notes.join(" · ")}</span>
              </div>
            ))}
          </div>

          <div>
            {[
              {
                title: "Livraison & retours",
                body: (
                  <>
                    <ul className="space-y-1">
                      {deliveryZones.map((z) => (
                        <li key={z.zone}>
                          {z.label} : {z.delay}
                          {z.feeXof !== null && ` · ${formatXof(z.feeXof)}`}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3">
                      Flacons non ouverts repris sous 14 jours. <Link href="/livraison" className="underline underline-offset-4">En savoir plus</Link>
                    </p>
                  </>
                ),
              },
              {
                title: "Conseils d'application",
                body: (
                  <p>
                    Un extrait se dose avec parcimonie : une à deux pressions suffisent, sur les points de chaleur (cou, poignets, creux du coude). Évitez de frotter pour laisser le parfum se révéler.
                  </p>
                ),
              },
              {
                title: "Informations produit",
                body: (
                  <ul className="space-y-1">
                    <li>Concentration : {product.concentration}</li>
                    <li>Contenances : {product.variants.map((v) => `${v.sizeMl} ml`).join(", ")}</li>
                    <li>Références : {product.variants.map((v) => v.sku).join(", ")}</li>
                  </ul>
                ),
              },
            ].map((item) => (
              <details key={item.title} className="group border-b border-ink/10">
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[11px] uppercase tracking-[0.22em] [&::-webkit-details-marker]:hidden">
                  {item.title}
                  <span aria-hidden="true" className="text-lg font-light transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <div className="pb-5 text-[15px] leading-relaxed text-stone">{item.body}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper py-20 md:py-28">
        <div className="container-luxe">
          <SectionHeading eyebrow="À découvrir" title="Vous aimerez aussi" className="mb-12" />
          <RevealGroup className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <RevealItem key={p.id}>
                <ProductCard product={p} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}

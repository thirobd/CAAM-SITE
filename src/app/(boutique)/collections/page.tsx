import type { Metadata } from "next";
import { FamiliesGrid } from "@/components/home/families-grid";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product/product-card";
import { ArrowLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProducts } from "@/lib/catalog/repository";
import { collections } from "@/lib/catalog/taxonomy";

export const metadata: Metadata = {
  title: "Collections",
  description: "Pour elle, pour lui, esprits libres : découvrez les collections d'extraits de parfum ĆAAM.",
};

export default async function CollectionsPage() {
  const products = await getProducts();

  return (
    <>
      <section className="grain bg-ink py-20 text-ivory md:py-28">
        <div className="container-luxe">
          <SectionHeading
            as="h1"
            tone="dark"
            eyebrow="Collections"
            title={
              <>
                Pour elle, pour lui,
                <br />
                <em className="text-champagne">pour les esprits libres.</em>
              </>
            }
            description="Trois façons de porter ĆAAM. Une même exigence de caractère, d'élégance et d'intensité."
          />
        </div>
      </section>

      {collections.map((c, i) => {
        const items = products.filter((p) => p.collection === c.id);
        return (
          <section key={c.id} id={c.id} className={i % 2 ? "bg-paper py-20 md:py-28" : "py-20 md:py-28"}>
            <div className="container-luxe">
              <SectionHeading
                eyebrow={c.tagline}
                title={c.label}
                description={c.description}
                action={<ArrowLink href={`/boutique?collection=${c.id}`}>Voir les {items.length} parfums</ArrowLink>}
                className="mb-12"
              />
              <RevealGroup className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
                {items.map((p) => (
                  <RevealItem key={p.id}>
                    <ProductCard product={p} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </section>
        );
      })}

      <section className="bg-ivory-deep py-20 md:py-28">
        <div className="container-luxe">
          <SectionHeading eyebrow="Familles olfactives" title="Explorer par famille" className="mb-12" />
          <FamiliesGrid products={products} />
        </div>
      </section>
    </>
  );
}

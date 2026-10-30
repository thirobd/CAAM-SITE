import { BrandStory } from "@/components/home/brand-story";
import { CollectionsTriptych } from "@/components/home/collections-triptych";
import { FamiliesGrid } from "@/components/home/families-grid";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product/product-card";
import { ArrowLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getBestSellers, getFeaturedProducts, getProducts } from "@/lib/catalog/repository";

export default async function HomePage() {
  const [products, featured, bestSellers] = await Promise.all([getProducts(), getFeaturedProducts(4), getBestSellers(4)]);

  return (
    <>
      <Hero products={featured.slice(0, 3)} />

      <section className="container-luxe py-20 md:py-32" aria-label="Nos signatures">
        <SectionHeading
          eyebrow="Sélection"
          title="Nos signatures"
          description="Quatre extraits qui racontent la maison : intenses, élégants, inoubliables."
          action={<ArrowLink href="/boutique">Toute la boutique</ArrowLink>}
        />
        <RevealGroup className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-16 md:gap-x-6 lg:grid-cols-4">
          {featured.map((p) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="container-luxe pb-20 md:pb-32" aria-label="Collections">
        <SectionHeading eyebrow="Collections" title="Pour chaque personnalité" className="mb-12" />
        <CollectionsTriptych products={products} />
      </section>

      <section className="bg-ivory-deep py-20 md:py-32">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Familles olfactives"
            title="Trouvez votre territoire"
            description="Six univers, de la chaleur de l'ambre à la fraîcheur du néroli."
            className="mb-12 md:mb-16"
          />
          <FamiliesGrid products={products} />
        </div>
      </section>

      {/* Affiché seulement quand des meilleures ventes sont renseignées (best_seller_rank dans Supabase). */}
      {bestSellers.length > 0 && (
        <section className="grain bg-ink py-20 text-ivory md:py-32">
          <div className="container-luxe">
            <SectionHeading
              tone="dark"
              eyebrow="Meilleures ventes"
              title="Les plus aimés"
              description="Les extraits les plus demandés de la maison."
              action={<ArrowLink href="/boutique?tri=recommandes" className="text-ivory/85 hover:text-ivory">Voir la boutique</ArrowLink>}
            />
            <RevealGroup
              as="div"
              className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mt-16 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0"
            >
              {bestSellers.map((p, i) => (
                <RevealItem key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[45%] lg:w-auto">
                  <ProductCard product={p} tone="dark" rank={i + 1} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      <section className="container-luxe py-20 md:py-32">
        <BrandStory />
      </section>

      <section className="border-t border-ink/10 bg-paper py-20 md:py-28">
        <div className="container-luxe">
          <Newsletter />
        </div>
      </section>
    </>
  );
}

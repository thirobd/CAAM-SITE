import Link from "next/link";
import { BottleArt } from "@/components/BottleArt";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/catalog";

export default function HomePage() {
  const [first, second] = products;

  return (
    <>
      <section className="hero container">
        <div className="hero__text">
          <span className="eyebrow">Maison de parfum</span>
          <h1 className="display">
            L&apos;art du parfum,
            <br />
            <em>composé à deux.</em>
          </h1>
          <p className="lead">
            ĆAAM est née d&apos;un couple et d&apos;une même obsession : créer des parfums qui racontent
            une histoire. Des compositions rares, imaginées ensemble et expédiées dans le monde entier.
          </p>
          <div className="hero__actions">
            <Link href="/boutique" className="button">
              Découvrir la collection
            </Link>
            <Link href="/maison" className="link-arrow">
              Notre histoire
            </Link>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="arch">
            <BottleArt tint={second.tint} className="hero__bottle hero__bottle--back" />
            <BottleArt tint={first.tint} name={first.name} className="hero__bottle hero__bottle--front" />
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="container container--narrow">
          <p className="manifesto__quote">
            « Un parfum ne se porte pas, il se vit. Chaque création ĆAAM est une conversation entre deux
            sensibilités, une signature que l&apos;on garde sur la peau. »
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <div>
            <span className="eyebrow">La collection</span>
            <h2 className="heading">Nos créations</h2>
          </div>
          <Link href="/boutique" className="link-arrow">
            Toute la boutique
          </Link>
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="split container">
        <div className="split__visual" aria-hidden="true">
          <div className="arch arch--dark">
            <span className="split__monogram">Ć</span>
          </div>
        </div>
        <div className="split__text">
          <span className="eyebrow">La Maison</span>
          <h2 className="heading">Une maison, deux signatures</h2>
          <p>
            Tout a commencé par une collection de flacons rapportés de voyage, et des soirées passées à
            sentir, comparer, imaginer. De cette passion partagée est née ĆAAM : une maison
            indépendante où chaque parfum est pensé à deux, du premier accord jusqu&apos;au flacon.
          </p>
          <p>
            Nous travaillons en petites séries, avec des matières premières choisies pour leur
            caractère, afin que chaque création garde quelque chose de rare.
          </p>
          <Link href="/maison" className="link-arrow">
            Découvrir notre histoire
          </Link>
        </div>
      </section>

      <section className="section container">
        <ul className="promises">
          <li>
            <h3>Expédié dans le monde entier</h3>
            <p>Livraison suivie en France, en Europe et à l&apos;international, avec un emballage soigné.</p>
          </li>
          <li>
            <h3>Paiement sécurisé</h3>
            <p>Carte bancaire, Apple Pay ou Google Pay, dans votre devise, via Stripe.</p>
          </li>
          <li>
            <h3>Petites séries</h3>
            <p>Des parfums composés avec exigence et produits en quantités limitées.</p>
          </li>
        </ul>
      </section>
    </>
  );
}

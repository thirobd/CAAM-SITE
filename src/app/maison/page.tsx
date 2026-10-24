import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "La Maison",
  description: "L'histoire de ĆAAM, maison de parfum fondée par un couple.",
};

// Texte provisoire : à remplacer par la véritable histoire du couple.
export default function MaisonPage() {
  return (
    <>
      <section className="section container container--narrow center">
        <span className="eyebrow">La Maison</span>
        <h1 className="display display--page">
          Deux regards,
          <br />
          <em>une même signature.</em>
        </h1>
        <p className="lead">
          ĆAAM est une maison de parfum indépendante, fondée par un couple réuni par la même passion
          pour les odeurs, les voyages et les souvenirs qu&apos;ils laissent.
        </p>
      </section>

      <section className="split container">
        <div className="split__visual" aria-hidden="true">
          <div className="arch arch--dark">
            <span className="split__monogram">Ć</span>
          </div>
        </div>
        <div className="split__text">
          <span className="eyebrow">Nos origines</span>
          <h2 className="heading">Le nom ĆAAM</h2>
          <p>
            [À compléter : l&apos;origine et la signification du nom ĆAAM, et ce que la marque
            représente pour vous deux.]
          </p>
          <span className="eyebrow">Notre façon de créer</span>
          <h2 className="heading">Composer à deux</h2>
          <p>
            [À compléter : comment naissent vos parfums, qui fait quoi, d&apos;où viennent vos
            matières premières, ce qui rend vos créations différentes.]
          </p>
        </div>
      </section>

      <section className="section container container--narrow center">
        <p className="manifesto__quote">« Chaque flacon garde une part de notre histoire. »</p>
        <Link href="/boutique" className="button">
          Découvrir la collection
        </Link>
      </section>
    </>
  );
}

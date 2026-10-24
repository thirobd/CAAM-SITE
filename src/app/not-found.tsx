import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section container container--narrow center">
      <span className="eyebrow">Erreur 404</span>
      <h1 className="display display--page">Cette page s&apos;est évaporée</h1>
      <p className="lead">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
      <Link href="/" className="button button--outline">
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}

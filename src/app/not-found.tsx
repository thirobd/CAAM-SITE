import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-luxe flex flex-col items-center gap-6 py-28 text-center md:py-40">
      <p className="eyebrow text-gold-deep">Erreur 404</p>
      <h1 className="font-serif text-5xl font-light md:text-6xl">Ce sillage s&apos;est évaporé</h1>
      <p className="max-w-md text-stone">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
      <ButtonLink href="/boutique" variant="ink" size="lg" className="mt-4">
        Découvrir la collection
      </ButtonLink>
    </div>
  );
}

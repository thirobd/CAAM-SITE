"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

// Dernier recours, si l'habillage de la boutique lui-même n'a pas pu s'afficher.
// Les erreurs des pages de la boutique sont gérées par (boutique)/error.tsx.
export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-luxe flex flex-col items-center gap-6 py-28 text-center md:py-40" role="alert">
      <p className="eyebrow text-gold-deep">Une erreur est survenue</p>
      <h1 className="font-serif text-5xl font-light md:text-6xl">Un instant d&apos;interruption</h1>
      <p className="max-w-md text-stone">La page n&apos;a pas pu s&apos;afficher. Réessayez dans un instant.</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button variant="ink" size="lg" onClick={reset}>
          Réessayer
        </Button>
        <ButtonLink href="/" variant="outline-dark" size="lg">
          Accueil
        </ButtonLink>
      </div>
    </div>
  );
}

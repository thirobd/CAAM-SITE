"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-luxe flex flex-col items-center gap-6 py-28 text-center md:py-40" role="alert">
      <p className="eyebrow text-gold-deep">Une erreur est survenue</p>
      <h1 className="font-serif text-5xl font-light md:text-6xl">Un instant d&apos;interruption</h1>
      <p className="max-w-md text-stone">La page n&apos;a pas pu s&apos;afficher. Réessayez, ou revenez à la boutique.</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button variant="ink" size="lg" onClick={reset}>
          Réessayer
        </Button>
        <ButtonLink href="/boutique" variant="outline-dark" size="lg">
          Retour à la boutique
        </ButtonLink>
      </div>
    </div>
  );
}

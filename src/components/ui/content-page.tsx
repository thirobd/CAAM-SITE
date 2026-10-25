import { SectionHeading } from "./section-heading";

/** Gabarit des pages de texte (livraison, légal…). Le contenu est mis en forme via des sélecteurs enfants. */
export function ContentPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="container-luxe max-w-4xl pb-24 pt-14 md:pt-20">
      <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={intro} className="mb-12" />
      <div className="space-y-5 leading-relaxed text-stone [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-ink [&_strong]:font-normal [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}

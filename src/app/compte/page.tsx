import type { Metadata } from "next";
import { Heart, MapPin, Package } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false },
};

const upcoming = [
  { icon: Package, title: "Suivi de commande", text: "Retrouvez vos commandes et leur statut de livraison." },
  { icon: MapPin, title: "Adresses enregistrées", text: "Commandez plus vite, à Dakar comme à l'étranger." },
  { icon: Heart, title: "Favoris", text: "Gardez vos parfums préférés à portée de main." },
];

// Espace réservé : l'authentification (Supabase Auth) arrivera dans une phase ultérieure.
export default function AccountPage() {
  return (
    <div className="container-luxe pb-24 pt-14 md:pt-20">
      <SectionHeading
        as="h1"
        eyebrow="Espace client"
        title="Bientôt disponible"
        description="La création de compte n'est pas encore ouverte. Vous pouvez dès à présent commander sans compte."
        className="mb-14"
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {upcoming.map(({ icon: Icon, title, text }) => (
          <li key={title} className="border border-ink/15 bg-paper p-7">
            <Icon className="size-6 text-gold-deep" strokeWidth={1.25} aria-hidden="true" />
            <h2 className="mt-6 font-serif text-2xl">{title}</h2>
            <p className="mt-2 text-stone">{text}</p>
          </li>
        ))}
      </ul>
      <ButtonLink href="/boutique" variant="ink" size="lg" className="mt-12">
        Continuer mes achats
      </ButtonLink>
    </div>
  );
}

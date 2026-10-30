import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/brand/social-icons";
import { buttonClasses } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter la maison ĆAAM : WhatsApp, Instagram, TikTok et téléphone.",
};

const cards = [
  { icon: Phone, label: "Téléphone / WhatsApp", value: site.contact.phone, href: whatsappUrl() },
  { icon: InstagramIcon, label: "Instagram", value: "@caamleparfum", href: site.social.instagram },
  { icon: TikTokIcon, label: "TikTok", value: "@caam_leparfum", href: site.social.tiktok },
  { icon: Mail, label: "E-mail", value: "À venir", href: null },
];

export default function ContactPage() {
  return (
    <div className="container-luxe pb-24 pt-14 md:pt-20">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="Parlons parfum"
        description="Une question sur une création, une commande ou un cadeau ? Écrivez-nous sur WhatsApp ou retrouvez-nous sur nos réseaux officiels."
        className="mb-14"
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, href }) => {
          const content = (
            <>
              <Icon className="size-6 text-gold-deep" strokeWidth={1.25} />
              <span className="eyebrow mt-8 block text-stone">{label}</span>
              <span className="mt-2 block font-serif text-2xl">{value}</span>
            </>
          );
          return (
            <li key={label}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full border border-ink/15 bg-paper p-7 transition-colors hover:border-ink">
                  {content}
                </a>
              ) : (
                <div className="h-full border border-dashed border-ink/15 p-7 opacity-70">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-10 flex flex-col items-start gap-8">
        <a href={site.social.whatsappCatalog} target="_blank" rel="noopener noreferrer" className={buttonClasses("outline-dark")}>
          <WhatsAppIcon className="size-4" /> Voir le catalogue WhatsApp
        </a>
        <p className="inline-flex items-center gap-3 text-stone">
          <MapPin className="size-4 text-gold-deep" strokeWidth={1.25} aria-hidden="true" /> {site.locations}
        </p>
      </div>
    </div>
  );
}

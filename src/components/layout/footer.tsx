import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/brand/social-icons";
import { collections } from "@/lib/catalog/taxonomy";
import { site, whatsappUrl } from "@/lib/site";

const columns = [
  {
    title: "Boutique",
    links: [
      { href: "/boutique", label: "Tous les parfums" },
      ...collections.map((c) => ({ href: `/boutique?collection=${c.id}`, label: c.label })),
    ],
  },
  {
    title: "Service client",
    links: [
      { href: "/livraison", label: "Livraison & retours" },
      { href: "/contact", label: "Contact" },
      { href: "/compte", label: "Mon compte" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/maison", label: "Notre histoire" },
      { href: "/cgv", label: "Conditions générales de vente" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Confidentialité" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="grain bg-ink text-ivory">
      <div className="container-luxe grid gap-12 py-16 md:py-20 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr]">
        <div className="max-w-xs">
          <Logo className="h-12" />
          <p className="mt-6 text-[15px] leading-relaxed text-mist">
            Maison de parfum de luxe. Des extraits de caractère, d&apos;élégance et d&apos;intensité, pour elle, pour lui et pour les esprits libres.
          </p>
          <p className="eyebrow mt-6 text-champagne">{site.locations}</p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="eyebrow text-champagne">{col.title}</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ivory/75 transition-colors hover:text-ivory">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="eyebrow text-champagne">Nous suivre</h2>
          <ul className="mt-5 space-y-3 text-[15px]">
            <li>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-ivory/75 hover:text-ivory">
                <InstagramIcon className="size-4" /> @caamleparfum
              </a>
            </li>
            <li>
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-ivory/75 hover:text-ivory">
                <TikTokIcon className="size-4" /> @caam_leparfum
              </a>
            </li>
            <li>
              <a href={site.social.whatsappCatalog} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-ivory/75 hover:text-ivory">
                <WhatsAppIcon className="size-4" /> Catalogue WhatsApp
              </a>
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-ivory/75 hover:text-ivory">
                <Phone className="size-4" strokeWidth={1.25} aria-hidden="true" /> {site.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-3 text-ivory/50">
              <Mail className="size-4" strokeWidth={1.25} aria-hidden="true" /> E-mail à venir
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-luxe flex flex-col gap-2 py-6 text-xs tracking-wide text-ivory/50 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} ĆAAM. Tous droits réservés.</span>
          <span>Stocks indicatifs. Commandes confirmées par WhatsApp, sans paiement en ligne.</span>
        </div>
      </div>
    </footer>
  );
}

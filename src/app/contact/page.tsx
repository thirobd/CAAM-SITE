import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur un parfum ou une commande ? Écrivez à la maison ĆAAM.",
};

export default function ContactPage() {
  return (
    <section className="section container container--narrow center">
      <span className="eyebrow">Contact</span>
      <h1 className="display display--page">Écrivez-nous</h1>
      <p className="lead">
        Une question sur un parfum, une commande ou un cadeau ? Nous répondons personnellement à chaque
        message, en général sous 48 heures.
      </p>
      <div className="contact-links">
        <a href={`mailto:${site.email}`} className="button">
          {site.email}
        </a>
        <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="button button--outline">
          Instagram
        </a>
      </div>
    </section>
  );
}

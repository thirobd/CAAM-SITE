import Link from "next/link";
import { site } from "@/lib/site";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Wordmark className="wordmark--large" />
          <p>{site.tagline}. Créations composées à deux, expédiées dans le monde entier.</p>
        </div>

        <div>
          <h3 className="eyebrow">Maison</h3>
          <ul>
            <li><Link href="/boutique">Boutique</Link></li>
            <li><Link href="/maison">Notre histoire</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Service client</h3>
          <ul>
            <li><Link href="/livraison">Livraison & retours</Link></li>
            <li><Link href="/cgv">Conditions générales de vente</Link></li>
            <li><Link href="/mentions-legales">Mentions légales</Link></li>
            <li><Link href="/confidentialite">Confidentialité</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Suivre ĆAAM</h3>
          <ul>
            <li><a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} {site.name}. Tous droits réservés.</span>
        <span>Paiement sécurisé par Stripe</span>
      </div>
    </footer>
  );
}

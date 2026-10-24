"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { getZone } from "@/lib/shipping";
import { useCart } from "./cart/CartProvider";
import { Wordmark } from "./Wordmark";

const freeFrom = getZone("france")?.freeFrom;

const nav = [
  { href: "/boutique", label: "Boutique" },
  { href: "/maison", label: "La Maison" },
  { href: "/livraison", label: "Livraison" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { count, open } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <div className="announcement">
        Expédition dans le monde entier
        {freeFrom !== undefined && <> · Livraison offerte en France dès {formatPrice(freeFrom)}</>}
      </div>
      <header className="header">
        <div className="header__inner container">
          <button
            className="icon-button header__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              {menuOpen ? (
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.2" />
              ) : (
                <path d="M3 8h18M3 16h18" stroke="currentColor" strokeWidth="1.2" />
              )}
            </svg>
          </button>

          <nav id="main-nav" className={`header__nav ${menuOpen ? "is-open" : ""}`} aria-label="Navigation principale">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname.startsWith(item.href) ? "is-active" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="header__logo" aria-label="ĆAAM — Accueil">
            <Wordmark />
          </Link>

          <button className="header__cart" onClick={open} aria-label={`Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`}>
            Panier <span className="header__cart-count">{count}</span>
          </button>
        </div>
      </header>
    </>
  );
}

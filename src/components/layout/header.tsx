"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useCallback, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { useCart } from "@/components/providers/cart";
import type { SearchEntry } from "@/lib/catalog/filter";
import { cn } from "@/lib/utils";
import { CurrencySwitcher } from "./currency-switcher";
import { MobileMenu } from "./mobile-menu";
import { mainNav } from "./nav-links";
import { SearchOverlay } from "./search-overlay";

// Sans propriété display : chaque usage ajoute « grid » ou « hidden sm:grid » sans conflit.
const iconButton = "size-10 place-items-center text-ivory/85 transition-colors hover:text-champagne";

export function Header({ searchEntries }: { searchEntries: SearchEntry[] }) {
  const pathname = usePathname();
  const { count, openCart, pulse } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ivory/10 bg-ink/95 text-ivory backdrop-blur-md">
        <div className="container-luxe grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[76px]">
          <div className="flex items-center">
            <button
              type="button"
              className={cn(iconButton, "-ml-2 grid md:hidden")}
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="size-6" strokeWidth={1.1} />
            </button>
            <nav aria-label="Navigation principale" className="hidden gap-9 md:flex">
              {mainNav.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-[11px] font-normal uppercase tracking-[0.24em] transition-colors hover:text-champagne",
                      active ? "text-champagne" : "text-ivory/85",
                    )}
                  >
                    {item.label}
                    {active && <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-px bg-champagne" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Link href="/" aria-label="ĆAAM — Accueil" className="justify-self-center">
            <Logo priority className="h-10 md:h-[52px]" />
          </Link>

          <div className="flex items-center justify-end gap-1 md:gap-2">
            <div className="mr-3 hidden lg:block">
              <CurrencySwitcher />
            </div>
            <button type="button" className={cn(iconButton, "grid")} onClick={() => setSearchOpen(true)} aria-label="Rechercher un parfum">
              <Search className="size-5" strokeWidth={1.25} />
            </button>
            <Link href="/compte" className={cn(iconButton, "hidden sm:grid")} aria-label="Mon compte">
              <User className="size-5" strokeWidth={1.25} />
            </Link>
            <button
              type="button"
              className={cn(iconButton, "relative -mr-2 grid")}
              onClick={openCart}
              aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}
            >
              <ShoppingBag className="size-5" strokeWidth={1.25} />
              {count > 0 && (
                // La clé change à chaque ajout : la pastille rebondit pour confirmer l'action.
                <motion.span
                  key={pulse}
                  initial={{ scale: 1.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 16 }}
                  className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-champagne px-1 text-[10px] font-medium text-ink tabular-nums"
                  aria-hidden="true"
                >
                  {count}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} entries={searchEntries} />
    </>
  );
}

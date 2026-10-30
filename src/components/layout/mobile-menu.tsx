"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { User, X } from "lucide-react";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/brand/social-icons";
import { site } from "@/lib/site";
import { CurrencySwitcher } from "./currency-switcher";
import { mainNav } from "./nav-links";
import { useOverlay } from "./use-overlay";

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useOverlay(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="grain fixed inset-0 z-[65] flex flex-col overflow-y-auto bg-ink text-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="container-luxe flex h-16 items-center justify-between">
            <span className="eyebrow text-champagne">Menu</span>
            <button type="button" onClick={onClose} className="grid size-11 place-items-center" aria-label="Fermer le menu">
              <X className="size-6" strokeWidth={1.1} />
            </button>
          </div>

          <nav aria-label="Navigation principale" className="container-luxe mt-6 flex-1">
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
            >
              {[{ href: "/", label: "Accueil" }, ...mainNav].map((item) => (
                <motion.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
                  className="border-b border-ivory/10"
                >
                  <Link href={item.href} onClick={onClose} className="block py-5 font-serif text-4xl font-light">
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <Link href="/compte" onClick={onClose} className="mt-8 inline-flex items-center gap-3 text-sm text-ivory/80">
              <User className="size-4" strokeWidth={1.25} /> Mon compte
            </Link>
          </nav>

          <div className="container-luxe flex items-center justify-between gap-4 border-t border-ivory/10 py-6">
            <CurrencySwitcher />
            <div className="flex gap-2">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="ĆAAM sur Instagram" className="grid size-10 place-items-center text-ivory/80 hover:text-champagne">
                <InstagramIcon className="size-5" />
              </a>
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="ĆAAM sur TikTok" className="grid size-10 place-items-center text-ivory/80 hover:text-champagne">
                <TikTokIcon className="size-5" />
              </a>
              <a href={site.social.whatsappCatalog} target="_blank" rel="noopener noreferrer" aria-label="Catalogue ĆAAM sur WhatsApp" className="grid size-10 place-items-center text-ivory/80 hover:text-champagne">
                <WhatsAppIcon className="size-5" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

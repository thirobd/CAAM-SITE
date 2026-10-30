import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/providers/cart";
import { toSearchEntry } from "@/lib/catalog/filter";
import { getProducts } from "@/lib/catalog/repository";
import { AnnouncementBar } from "./announcement-bar";
import { Footer } from "./footer";
import { Header } from "./header";

/** Habillage de la boutique : bandeau, en-tête, panier et pied de page. */
export async function ShopShell({ children }: { children: React.ReactNode }) {
  const searchEntries = (await getProducts()).map(toSearchEntry);

  return (
    <CartProvider>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-3 focus:text-ink"
      >
        Aller au contenu
      </a>
      <AnnouncementBar />
      <Header searchEntries={searchEntries} />
      <main id="contenu" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}

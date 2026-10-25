import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/components/providers/cart";
import { MotionProvider } from "@/components/providers/motion";
import { toSearchEntry } from "@/lib/catalog/filter";
import { getProducts } from "@/lib/catalog/repository";
import { site } from "@/lib/site";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const sans = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.baseline}`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: {
    siteName: site.name,
    locale: "fr_SN",
    type: "website",
    images: [{ url: "/brand/caam-logo.png", width: 691, height: 317, alt: "ĆAAM" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a08",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const searchEntries = (await getProducts()).map(toSearchEntry);

  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-3 focus:text-ink"
        >
          Aller au contenu
        </a>
        <MotionProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header searchEntries={searchEntries} />
            <main id="contenu" className="min-h-[60vh]">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { MotionProvider } from "@/components/providers/motion";
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

// Base commune à la boutique, group (boutique), et à l'espace propriétaire, /admin.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

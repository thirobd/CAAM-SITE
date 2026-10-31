import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// En-têtes de sécurité envoyés avec chaque page (HTTPS strict est déjà ajouté par Vercel).
const securityHeaders = [
  // Interdit d'afficher le site dans le cadre d'un autre site (détournement de clics).
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
  { key: "X-Frame-Options", value: "DENY" },
  // Le navigateur ne devine pas le type d'un fichier : il suit celui annoncé.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Les sites externes (WhatsApp, Instagram…) ne voient que l'adresse du site, pas la page exacte.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  images: {
    // Photos produits hébergées dans le compartiment public Supabase Storage.
    remotePatterns: supabaseUrl ? [new URL(`${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/**`)] : [],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

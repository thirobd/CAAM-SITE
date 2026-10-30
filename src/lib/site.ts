// Informations de la marque. Les valeurs marquées « À COMPLÉTER » sont des espaces réservés.
export const site = {
  name: "ĆAAM",
  baseline: "Extraits de parfum",
  description:
    "ĆAAM, maison de parfum de luxe : des extraits de parfum de caractère pour elle, pour lui et pour les esprits libres. Entre Dakar et l'Europe.",
  // Sur Vercel, l'adresse de production est fournie automatiquement si NEXT_PUBLIC_SITE_URL est absent.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  locations: "Dakar · Europe",
  social: {
    instagram: "https://www.instagram.com/caamleparfum/",
    tiktok: "https://www.tiktok.com/@caam_leparfum",
    whatsappCatalog: "https://wa.me/c/33667799533",
  },
  contact: {
    email: "contact@exemple.com", // À COMPLÉTER
    phone: "+33 6 67 79 95 33",
    // Même numéro au format international sans « + » ni espaces, pour les liens wa.me
    whatsapp: "33667799533",
  },
} as const;

/** Lien de discussion WhatsApp avec ĆAAM, avec un message prérempli facultatif. */
export function whatsappUrl(message?: string) {
  return `https://wa.me/${site.contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

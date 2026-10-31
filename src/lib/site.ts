type LegalIdentity = {
  /** Raison sociale et forme juridique (ex. « ĆAAM SARL »), ou nom de l'entrepreneur individuel. */
  company: string;
  /** Adresse du siège ou de l'établissement. */
  address: string;
  /** Immatriculation : NINEA et RCCM au Sénégal, SIREN en France… */
  registration: string;
  /** Personne responsable de la publication du site. */
  publisher: string;
};

// Identité légale de l'éditeur, à compléter par ĆAAM : une valeur vide n'est pas affichée
// (mentions légales, CGV, confidentialité).
const legal: LegalIdentity = {
  company: "",
  address: "",
  registration: "",
  publisher: "",
};

// Informations de la marque.
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
    email: "caamocaama@gmail.com",
    phone: "+33 6 67 79 95 33",
    // Même numéro au format international sans « + » ni espaces, pour les liens wa.me
    whatsapp: "33667799533",
  },
  legal,
  hosting: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    url: "https://vercel.com",
  },
  /** Date de dernière mise à jour des pages légales. */
  legalUpdatedAt: "31 octobre 2026",
} as const;

/** Nom du vendeur dans les textes légaux : la raison sociale si elle est renseignée, sinon la marque. */
export const sellerName = legal.company || site.name;

/** Adresse complète d'une page ou d'une image du site (référencement, partage). */
export function absoluteUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${site.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Lien de discussion WhatsApp avec ĆAAM, avec un message prérempli facultatif. */
export function whatsappUrl(message?: string) {
  return `https://wa.me/${site.contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

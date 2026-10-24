// Catalogue des parfums. Les prix sont en centimes (9500 = 95,00 €).
// Les créations ci-dessous sont des EXEMPLES à remplacer par les vrais parfums ĆAAM.

export type Family = "Ambré" | "Boisé" | "Floral" | "Frais";

export type Variant = {
  id: string;
  volumeMl: number;
  price: number;
};

export type Product = {
  slug: string;
  name: string;
  family: Family;
  tagline: string;
  description: string;
  notes: { top: string[]; heart: string[]; base: string[] };
  variants: Variant[];
  /** Couleur du jus, utilisée pour le visuel provisoire du flacon. */
  tint: string;
  /** Chemin d'une photo dans /public, ex. "/parfums/nuit-d-ambre.jpg". */
  image?: string;
};

const standardVariants = (slug: string, prices: [number, number, number]): Variant[] => [
  { id: `${slug}-30`, volumeMl: 30, price: prices[0] },
  { id: `${slug}-50`, volumeMl: 50, price: prices[1] },
  { id: `${slug}-100`, volumeMl: 100, price: prices[2] },
];

export const products: Product[] = [
  {
    slug: "nuit-d-ambre",
    name: "Nuit d'Ambre",
    family: "Ambré",
    tagline: "Une chaleur qui s'attarde sur la peau",
    description:
      "Né d'une soirée d'hiver passée à deux, Nuit d'Ambre enveloppe comme un cachemire. L'ambre et la vanille de Madagascar se fondent dans un sillage doux, presque sucré, qui se révèle au fil des heures.",
    notes: {
      top: ["Bergamote", "Cardamome"],
      heart: ["Ambre", "Fève tonka"],
      base: ["Vanille de Madagascar", "Benjoin", "Musc blanc"],
    },
    variants: standardVariants("nuit-d-ambre", [6500, 9500, 14500]),
    tint: "#B9783A",
  },
  {
    slug: "bois-sacre",
    name: "Bois Sacré",
    family: "Boisé",
    tagline: "Le silence d'un temple de cèdre",
    description:
      "Un hommage aux bois précieux. L'oud et le santal dessinent une composition profonde et minérale, éclairée par une pointe de poivre rose. Un parfum de caractère, à porter comme une signature.",
    notes: {
      top: ["Poivre rose", "Élémi"],
      heart: ["Cèdre de l'Atlas", "Encens"],
      base: ["Oud", "Santal", "Vétiver"],
    },
    variants: standardVariants("bois-sacre", [7500, 11000, 16500]),
    tint: "#5E4632",
  },
  {
    slug: "rose-nomade",
    name: "Rose Nomade",
    family: "Floral",
    tagline: "Une rose qui a traversé le désert",
    description:
      "La rose de Damas rencontre le safran et le musc dans une composition à la fois lumineuse et sensuelle. Une fleur voyageuse, ni sage ni classique, qui garde la trace du soleil.",
    notes: {
      top: ["Safran", "Litchi"],
      heart: ["Rose de Damas", "Pivoine"],
      base: ["Musc", "Patchouli", "Ambroxan"],
    },
    variants: standardVariants("rose-nomade", [6500, 9500, 14500]),
    tint: "#C98B8B",
  },
  {
    slug: "fleur-de-sel",
    name: "Fleur de Sel",
    family: "Frais",
    tagline: "L'air marin d'un matin d'été",
    description:
      "Une brise iodée, des agrumes pressés, une peau chauffée au soleil. Fleur de Sel capture la légèreté des matins au bord de l'eau, avec une fraîcheur qui ne s'efface pas.",
    notes: {
      top: ["Citron de Sicile", "Bergamote", "Sel marin"],
      heart: ["Néroli", "Figuier"],
      base: ["Bois flotté", "Musc blanc"],
    },
    variants: standardVariants("fleur-de-sel", [6000, 8500, 13000]),
    tint: "#9FB7B4",
  },
];

export const families: Family[] = ["Ambré", "Boisé", "Floral", "Frais"];

/** Quantité maximale d'un même article par commande. */
export const MAX_QUANTITY = 10;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function findVariant(slug: string, variantId: string) {
  const product = getProduct(slug);
  const variant = product?.variants.find((v) => v.id === variantId);
  return product && variant ? { product, variant } : undefined;
}

export function startingPrice(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price));
}

import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog/repository";
import { absoluteUrl } from "@/lib/site";

// Plan du site pour les moteurs de recherche ; les nouveaux parfums y apparaissent dans l'heure.
export const revalidate = 3600;

const pages = ["/", "/boutique", "/collections", "/maison", "/contact", "/livraison", "/cgv", "/mentions-legales", "/confidentialite"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    ...pages.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : path === "/boutique" ? 0.9 : 0.5,
    })),
    ...products.map((p) => ({
      url: absoluteUrl(`/parfums/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images.slice(0, 1).map(absoluteUrl),
    })),
  ];
}

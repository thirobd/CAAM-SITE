import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Espace propriétaire, compte client et commande : rien à indexer.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/compte", "/commande", "/auth"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { PublishToggle } from "@/components/admin/publish-toggle";
import { BottleArt } from "@/components/product/bottle-art";
import { ButtonLink } from "@/components/ui/button";
import { imageUrl } from "@/lib/catalog/mapper";
import { LOW_STOCK_THRESHOLD } from "@/lib/catalog/stock";
import { getCollection, getFamily } from "@/lib/catalog/taxonomy";
import { formatXof } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { listAdminProducts } from "@/server/admin/catalog";
import { requireAdmin } from "@/server/admin/session";

export const metadata: Metadata = { title: "Parfums" };

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  const products = await listAdminProducts(admin);

  return (
    <>
      <PageHeader
        title="Parfums"
        description={`${products.length} parfum${products.length > 1 ? "s" : ""}, dont ${products.filter((p) => p.is_published).length} publié${products.filter((p) => p.is_published).length > 1 ? "s" : ""}. Les parfums masqués restent enregistrés mais n'apparaissent pas dans la boutique.`}
        action={
          <ButtonLink href="/admin/parfums/nouveau" variant="ink">
            <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" /> Ajouter un parfum
          </ButtonLink>
        }
      />

      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {products.map((p) => (
          <li key={p.id} className="flex gap-4 py-4">
            <Link href={`/admin/parfums/${p.id}`} className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-ivory-deep sm:w-20" tabIndex={-1} aria-hidden="true">
              {p.images[0] ? (
                <Image src={imageUrl(p.images[0])} alt="" fill sizes="80px" className="object-cover" />
              ) : (
                <BottleArt tint={p.tint} decorative className="absolute bottom-[8%] left-1/2 h-[80%] w-auto -translate-x-1/2" />
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/admin/parfums/${p.id}`} className="font-serif text-2xl leading-tight hover:underline">
                    {p.name}
                  </Link>
                  <p className="text-[13px] text-stone">
                    {getCollection(p.collection).label} · {getFamily(p.family).label}
                    {p.featured && " · Mis en avant"}
                    {p.is_new && " · Nouveau"}
                    {p.best_seller_rank && ` · Meilleure vente n° ${p.best_seller_rank}`}
                  </p>
                </div>
                <PublishToggle id={p.id} published={p.is_published} />
              </div>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
                {p.product_variants.map((v) => (
                  <li key={v.id}>
                    {v.size_ml} ml · {formatXof(v.price_xof)} ·{" "}
                    <span className={cn(v.stock === 0 ? "text-danger" : v.stock <= LOW_STOCK_THRESHOLD ? "text-warning" : "text-stone")}>
                      {v.stock === 0 ? "épuisé" : `${v.stock} en stock`}
                    </span>
                  </li>
                ))}
                {p.product_variants.length === 0 && <li className="text-danger">Aucune contenance : invisible dans la boutique.</li>}
              </ul>
            </div>
          </li>
        ))}
      </ul>
      {products.length === 0 && <p className="py-10 text-center text-stone">Aucun parfum pour l&apos;instant.</p>}
    </>
  );
}

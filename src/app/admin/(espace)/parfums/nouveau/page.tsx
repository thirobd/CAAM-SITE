import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { emptyProduct } from "@/lib/admin/product-input";
import { requireAdmin } from "@/server/admin/session";

export const metadata: Metadata = { title: "Nouveau parfum" };

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <>
      <Link href="/admin/parfums" className="text-[13px] text-stone hover:text-ink">
        ← Tous les parfums
      </Link>
      <div className="mt-4">
        <PageHeader title="Nouveau parfum" description="Le parfum est créé masqué : cochez « Publié sur le site » quand il est prêt." />
      </div>
      <ProductForm initial={emptyProduct} />
    </>
  );
}

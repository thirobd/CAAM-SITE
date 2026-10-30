import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminProduct, toProductInput } from "@/server/admin/catalog";
import { requireAdmin } from "@/server/admin/session";

export const metadata: Metadata = { title: "Modifier un parfum" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ enregistre?: string }> };

export default async function EditProductPage({ params, searchParams }: Props) {
  const admin = await requireAdmin();
  const [{ id }, { enregistre }] = await Promise.all([params, searchParams]);
  const product = await getAdminProduct(admin, id);

  return (
    <>
      <Link href="/admin/parfums" className="text-[13px] text-stone hover:text-ink">
        ← Tous les parfums
      </Link>
      {product ? (
        <>
          <div className="mt-4">
            <PageHeader title={product.name} description={product.is_published ? "Publié sur le site." : "Masqué : n'apparaît pas dans la boutique."} />
          </div>
          {enregistre && (
            <Notice>Modifications enregistrées.{product.is_published ? " Elles sont déjà visibles sur le site." : " Le parfum reste masqué tant que « Publié sur le site » n'est pas coché."}</Notice>
          )}
          {/* La clé recharge le formulaire avec les données enregistrées (nouvelles contenances comprises). */}
          <ProductForm key={product.updated_at + (enregistre ?? "")} initial={toProductInput(product)} />
        </>
      ) : (
        <p className="py-16 text-center text-stone">Ce parfum n&apos;existe pas ou a été supprimé.</p>
      )}
    </>
  );
}

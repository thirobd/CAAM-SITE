import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { StockTable, type StockRow } from "@/components/admin/stock-table";
import { listAdminProducts } from "@/server/admin/catalog";
import { requireAdmin } from "@/server/admin/session";

export const metadata: Metadata = { title: "Stocks & prix" };

export default async function StocksPage() {
  const admin = await requireAdmin();
  const products = await listAdminProducts(admin);
  const rows: StockRow[] = products.flatMap((p) =>
    p.product_variants.map((v) => ({
      id: v.id,
      productName: p.name,
      published: p.is_published,
      sizeMl: v.size_ml,
      sku: v.sku,
      priceXof: v.price_xof,
      stock: v.stock,
    })),
  );

  return (
    <>
      <PageHeader
        title="Stocks & prix"
        description="Modifiez un prix ou un stock, puis enregistrez la ligne. Le site est mis à jour aussitôt. Le stock baisse aussi automatiquement quand vous confirmez une commande."
      />
      <StockTable rows={rows} />
      {rows.length === 0 && <p className="py-10 text-center text-stone">Aucune contenance enregistrée.</p>}
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, PackageCheck, ShoppingBag, Sparkles } from "lucide-react";
import { LocalDate } from "@/components/admin/local-date";
import { PageHeader } from "@/components/admin/page-header";
import { ButtonLink } from "@/components/ui/button";
import { orderStatuses } from "@/lib/admin/orders";
import { LOW_STOCK_THRESHOLD } from "@/lib/catalog/stock";
import { formatXof } from "@/lib/currency";
import { listAdminProducts } from "@/server/admin/catalog";
import { countOrdersByStatus, listOrders } from "@/server/admin/order-data";
import { requireAdmin } from "@/server/admin/session";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const [products, counts, latest] = await Promise.all([listAdminProducts(admin), countOrdersByStatus(admin), listOrders(admin, undefined, 5)]);

  const published = products.filter((p) => p.is_published);
  const alerts = published.flatMap((p) =>
    p.product_variants.filter((v) => v.stock <= LOW_STOCK_THRESHOLD).map((v) => ({ product: p, variant: v })),
  );
  const cards = [
    { icon: Sparkles, label: "Parfums publiés", value: `${published.length} / ${products.length}`, href: "/admin/parfums" },
    { icon: ShoppingBag, label: "Nouvelles commandes", value: String(counts.nouvelle), href: "/admin/commandes?statut=nouvelle" },
    { icon: PackageCheck, label: "Confirmées à livrer", value: String(counts.confirmee), href: "/admin/commandes?statut=confirmee" },
    { icon: AlertTriangle, label: "Stocks à surveiller", value: String(alerts.length), href: "/admin/stocks" },
  ];

  return (
    <>
      <PageHeader title={`Bonjour, ${admin.username}`} description="Vue d'ensemble de la boutique." action={<ButtonLink href="/admin/parfums/nouveau" variant="ink">Ajouter un parfum</ButtonLink>} />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, href }) => (
          <li key={label}>
            <Link href={href} className="block h-full border border-ink/15 bg-paper p-5 transition-colors hover:border-ink">
              <Icon className="size-5 text-gold-deep" strokeWidth={1.25} aria-hidden="true" />
              <span className="mt-4 block font-serif text-4xl lining-nums">{value}</span>
              <span className="mt-1 block text-[13px] text-stone">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="eyebrow mb-4 text-gold-deep">Stocks à surveiller</h2>
          {alerts.length === 0 ? (
            <p className="text-[15px] text-stone">Tous les parfums publiés ont plus de {LOW_STOCK_THRESHOLD} flacons en stock.</p>
          ) : (
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {alerts.map(({ product, variant }) => (
                <li key={variant.id} className="flex items-center justify-between gap-4 py-3 text-[15px]">
                  <Link href={`/admin/parfums/${product.id}`} className="hover:underline">
                    {product.name} · {variant.size_ml} ml
                  </Link>
                  <span className={variant.stock === 0 ? "text-danger" : "text-warning"}>{variant.stock === 0 ? "Épuisé" : `Plus que ${variant.stock}`}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="eyebrow text-gold-deep">Dernières commandes</h2>
            <Link href="/admin/commandes" className="text-[13px] text-stone hover:text-ink">
              Toutes les commandes →
            </Link>
          </div>
          {latest.length === 0 ? (
            <p className="text-[15px] text-stone">Aucune commande pour l&apos;instant.</p>
          ) : (
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {latest.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-4 py-3 text-[15px]">
                  <span>
                    <span className="lining-nums">{o.reference}</span> · {o.customer_name}
                    <span className="block text-[12px] text-stone">
                      <LocalDate iso={o.created_at} /> · {orderStatuses.find((s) => s.id === o.status)?.label}
                    </span>
                  </span>
                  <span className="tabular-nums">{formatXof(o.total_xof)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

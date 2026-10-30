import type { Metadata } from "next";
import Link from "next/link";
import { OrderCard } from "@/components/admin/order-card";
import { PageHeader } from "@/components/admin/page-header";
import { isOrderStatus, orderStatuses } from "@/lib/admin/orders";
import { cn } from "@/lib/utils";
import { countOrdersByStatus, listOrders } from "@/server/admin/order-data";
import { requireAdmin } from "@/server/admin/session";

export const metadata: Metadata = { title: "Commandes" };

type Props = { searchParams: Promise<{ statut?: string }> };

export default async function OrdersPage({ searchParams }: Props) {
  const admin = await requireAdmin();
  const { statut } = await searchParams;
  const status = isOrderStatus(statut) ? statut : undefined;
  const [orders, counts] = await Promise.all([listOrders(admin, status), countOrdersByStatus(admin)]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const tabs = [{ id: undefined, label: "Toutes", count: total }, ...orderStatuses.map((s) => ({ id: s.id, label: s.label, count: counts[s.id] }))];

  return (
    <>
      <PageHeader
        title="Commandes"
        description="Chaque commande passée sur le site est enregistrée ici, puis envoyée par le client sur WhatsApp. Confirmez-la après échange avec le client : le stock est alors retiré automatiquement."
      />

      <nav aria-label="Filtrer par statut" className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4">
        {tabs.map((tab) => {
          const active = tab.id === status;
          return (
            <Link
              key={tab.label}
              href={tab.id ? `/admin/commandes?statut=${tab.id}` : "/admin/commandes"}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 border px-4 text-[13px] transition-colors",
                active ? "border-ink bg-ink text-ivory" : "border-ink/20 hover:border-ink",
              )}
            >
              {tab.label} <span className={active ? "text-ivory/70" : "text-stone"}>{tab.count}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-5">
        {orders.map((order) => (
          <OrderCard key={`${order.id}-${order.status}`} order={order} />
        ))}
      </div>
      {orders.length === 0 && (
        <p className="py-16 text-center text-stone">{status ? "Aucune commande avec ce statut." : "Aucune commande pour l'instant."}</p>
      )}
    </>
  );
}

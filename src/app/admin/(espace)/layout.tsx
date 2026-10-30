import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/server/admin/session";

export default async function AdminSpaceLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const { count } = await admin.supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "nouvelle");

  return (
    <AdminShell username={admin.username} newOrders={count ?? 0}>
      {children}
    </AdminShell>
  );
}

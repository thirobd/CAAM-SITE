import "server-only";
import type { AdminOrder, OrderStatus } from "@/lib/admin/orders";
import type { AdminSession } from "./session";

const SELECT =
  "id, reference, status, customer_name, phone, country, city, address, notes, payment_method, subtotal_xof, delivery_label, delivery_fee_xof, total_xof, stock_applied, admin_note, created_at, order_items (id, product_name, size_ml, quantity, unit_price_xof)";

export async function listOrders({ supabase }: AdminSession, status?: OrderStatus, limit = 100): Promise<AdminOrder[]> {
  let query = supabase.from("orders").select(SELECT).order("created_at", { ascending: false }).limit(limit);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(`Commandes indisponibles : ${error.message}`);
  return data as unknown as AdminOrder[];
}

export async function countOrdersByStatus({ supabase }: AdminSession): Promise<Record<OrderStatus, number>> {
  const { data, error } = await supabase.from("orders").select("status");
  if (error) throw new Error(`Commandes indisponibles : ${error.message}`);
  const counts: Record<OrderStatus, number> = { nouvelle: 0, confirmee: 0, livree: 0, annulee: 0 };
  for (const row of data as { status: OrderStatus }[]) counts[row.status] += 1;
  return counts;
}

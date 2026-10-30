"use server";

import { revalidatePath } from "next/cache";
import { isOrderStatus, type OrderStatus } from "@/lib/admin/orders";
import { requireAdmin } from "./session";

type Result = { ok: true } | { ok: false; message: string };

/** Change le statut : le stock est retiré à la confirmation et rendu à l'annulation (voir set_order_status). */
export async function setOrderStatus(orderId: string, status: OrderStatus): Promise<Result> {
  const { supabase } = await requireAdmin();
  if (!isOrderStatus(status)) return { ok: false, message: "Statut inconnu." };
  const { error } = await supabase.rpc("set_order_status", { p_order_id: String(orderId), p_status: status });
  if (error) return { ok: false, message: error.message };
  // Le stock a pu changer : la boutique et l'espace propriétaire sont rafraîchis.
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveOrderNote(orderId: string, note: string): Promise<Result> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("orders")
    .update({ admin_note: String(note ?? "").slice(0, 1000) })
    .eq("id", String(orderId));
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

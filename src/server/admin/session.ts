import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase/session";

export type AdminSession = {
  userId: string;
  username: string;
  supabase: Awaited<ReturnType<typeof createSessionClient>>;
};

/** Administrateur connecté, ou null. Mémorisé pendant un rendu. */
export const getAdmin = cache(async (): Promise<AdminSession | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;

  const { data: admin } = await supabase.from("admins").select("username").eq("user_id", userId).maybeSingle();
  return admin ? { userId, username: admin.username, supabase } : null;
});

/** À appeler en tête de chaque page et de chaque action de l'espace propriétaire. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/connexion");
  return admin;
}

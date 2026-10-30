// Connexion à l'espace propriétaire par nom d'utilisateur.
// Supabase Auth fonctionne avec des adresses e-mail : le nom d'utilisateur (public.admins.username)
// est d'abord recherché via admin_login_email(). À défaut, « caam » correspond au compte
// « caam@caam.local » (domaine réservé, sans boîte mail). Une adresse complète est acceptée telle quelle.

export const ADMIN_LOGIN_DOMAIN = "caam.local";

export function fallbackLoginEmail(identifier: string): string {
  const id = identifier.trim().toLowerCase();
  return id.includes("@") ? id : `${id}@${ADMIN_LOGIN_DOMAIN}`;
}

/** Page de retour après connexion : uniquement une adresse interne de l'espace propriétaire. */
export function safeAdminPath(value: unknown): string {
  return typeof value === "string" && /^\/admin(\/[\w\-/]*)?$/.test(value) && value !== "/admin/connexion" ? value : "/admin";
}

import { NextResponse, type NextRequest } from "next/server";
import { safeReturnPath } from "@/lib/account";
import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase/session";

/**
 * Lien de confirmation reçu par e-mail après l'inscription (si la confirmation est activée
 * dans Supabase) : ouvre la session du client, puis le renvoie vers son compte.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeReturnPath(searchParams.get("suite"));

  if (code && isSupabaseConfigured()) {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/compte?erreur=confirmation`);
}

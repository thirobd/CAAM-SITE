import { NextResponse, type NextRequest } from "next/server";
import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase/session";

/**
 * Lien « Mot de passe oublié » reçu par e-mail : ouvre une session temporaire,
 * puis envoie vers le choix du nouveau mot de passe.
 * - token_hash : modèle d'e-mail ĆAAM (fonctionne sur n'importe quel appareil) ;
 * - code : modèle par défaut de Supabase (même navigateur que la demande).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const code = searchParams.get("code");

  if (isSupabaseConfigured() && (tokenHash || code)) {
    const supabase = await createSessionClient();
    const { error } = tokenHash
      ? await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash })
      : await supabase.auth.exchangeCodeForSession(code!);
    if (!error) return NextResponse.redirect(`${origin}/compte/mot-de-passe`);
  }
  return NextResponse.redirect(`${origin}/compte?oubli&erreur=lien`);
}

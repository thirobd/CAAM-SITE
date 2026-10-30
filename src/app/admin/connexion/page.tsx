import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/brand/logo";
import { safeAdminPath } from "@/lib/admin/login";
import { getAdmin } from "@/server/admin/session";

export const metadata: Metadata = { title: "Connexion" };

type Props = { searchParams: Promise<{ suite?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const next = safeAdminPath((await searchParams).suite);
  if (await getAdmin()) redirect(next);

  return (
    <div className="grain flex min-h-svh items-center justify-center bg-ink px-4 py-16 text-ivory">
      <div className="w-full max-w-sm">
        <Logo className="mx-auto block h-14" priority />
        <p className="eyebrow mt-8 text-center text-champagne">Espace propriétaire</p>
        <h1 className="mt-3 text-center font-serif text-4xl font-light">Connexion</h1>
        <LoginForm next={next} />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { AlertCircle, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn, type LoginState } from "@/server/admin/auth";

const fieldBase =
  "h-12 w-full border border-ivory/25 bg-ink-soft text-[15px] text-ivory outline-none transition-colors placeholder:text-mist/60 focus:border-champagne";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="mt-10 space-y-5" aria-describedby={state.error ? "login-error" : undefined}>
      <input type="hidden" name="suite" value={next} />
      <div className="flex flex-col gap-2">
        <label htmlFor="identifiant" className="text-[13px] tracking-wide text-ivory/85">
          Nom d&apos;utilisateur
        </label>
        <input
          id="identifiant"
          name="identifiant"
          defaultValue={state.identifier}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          className={`${fieldBase} px-4`}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="motdepasse" className="text-[13px] tracking-wide text-ivory/85">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="motdepasse"
            name="motdepasse"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${fieldBase} pl-4 pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center text-mist hover:text-ivory"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {state.error && (
        <p id="login-error" role="alert" className="flex items-start gap-3 bg-danger/20 px-4 py-3 text-sm text-ivory">
          <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          {state.error}
        </p>
      )}

      <Button type="submit" variant="gold" size="lg" full disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-hidden="true" /> Connexion…
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
      <p className="text-center">
        <Link href="/compte?oubli" className="text-[13px] text-mist underline underline-offset-4 hover:text-ivory">
          Mot de passe oublié ?
        </Link>
      </p>
    </form>
  );
}

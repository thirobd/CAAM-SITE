"use client";

import Link from "next/link";
import { AlertCircle, Eye, EyeOff, LoaderCircle, MailCheck } from "lucide-react";
import { useActionState, useState } from "react";
import { inputClass } from "@/components/checkout/field";
import { Button } from "@/components/ui/button";
import { MIN_PASSWORD_LENGTH } from "@/lib/account";
import { cn } from "@/lib/utils";
import { requestPasswordReset, signInAccount, signUpAccount, type AuthState, type ResetRequestState } from "@/server/account";

export const field = cn(inputClass, "h-12 border-ink/20");

export function PasswordInput({ id, autoComplete, name = "motdepasse" }: { id: string; autoComplete: string; name?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      {/* Marge droite dédiée (pas de px-4 surchargé) : le texte ne passe pas sous l'œil. */}
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required
        minLength={autoComplete === "new-password" ? MIN_PASSWORD_LENGTH : undefined}
        className={cn("h-12 w-full border border-ink/20 bg-paper pl-4 pr-12 text-[15px] outline-none transition-colors focus:border-ink")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center text-stone hover:text-ink"
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {visible ? <EyeOff className="size-4" strokeWidth={1.5} /> : <Eye className="size-4" strokeWidth={1.5} />}
      </button>
    </div>
  );
}

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-start gap-3 bg-danger/10 px-4 py-3 text-sm text-danger">
      <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      {message}
    </p>
  );
}

export function Submit({ pending, label }: { pending: boolean; label: string }) {
  return (
    <Button type="submit" variant="ink" size="lg" full disabled={pending}>
      {pending ? <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-label="Patientez" /> : label}
    </Button>
  );
}

const linkButton = "text-[13px] text-stone underline underline-offset-4 hover:text-ink";

function SignInForm({ next, onForgot }: { next: string; onForgot: () => void }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signInAccount, {});
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="suite" value={next} />
      <label className="flex flex-col gap-2 text-[13px] tracking-wide">
        E-mail
        <input name="identifiant" type="text" inputMode="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required defaultValue={state.email} className={field} />
      </label>
      <label className="flex flex-col gap-2 text-[13px] tracking-wide">
        Mot de passe
        <PasswordInput id="connexion-motdepasse" autoComplete="current-password" />
      </label>
      <ErrorMessage message={state.error} />
      <Submit pending={pending} label="Se connecter" />
      <p className="text-center">
        <button type="button" onClick={onForgot} className={linkButton}>
          Mot de passe oublié ?
        </button>
      </p>
    </form>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const [state, action, pending] = useActionState<ResetRequestState, FormData>(requestPasswordReset, {});

  if (state.sent) {
    return (
      <div className="space-y-6">
        <div className="border border-success/40 bg-success/10 px-6 py-8 text-center">
          <MailCheck className="mx-auto size-8 text-success" strokeWidth={1.25} aria-hidden="true" />
          <p className="mt-4 font-serif text-2xl">Vérifiez votre boîte mail</p>
          <p className="mt-2 text-[15px] text-stone">
            Si un compte existe pour <strong className="font-normal text-ink">{state.email}</strong>, un lien pour choisir un nouveau mot de
            passe vient d&apos;y être envoyé. Pensez à regarder dans les courriers indésirables.
          </p>
        </div>
        <p className="text-center">
          <button type="button" onClick={onBack} className={linkButton}>
            Retour à la connexion
          </button>
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <p className="text-[15px] text-stone">Indiquez l&apos;adresse e-mail de votre compte : vous recevrez un lien pour choisir un nouveau mot de passe.</p>
      <label className="flex flex-col gap-2 text-[13px] tracking-wide">
        E-mail
        <input name="email" type="email" autoComplete="email" required defaultValue={state.email} className={field} />
      </label>
      <ErrorMessage message={state.error} />
      <Submit pending={pending} label="Recevoir le lien" />
      <p className="text-center">
        <button type="button" onClick={onBack} className={linkButton}>
          Retour à la connexion
        </button>
      </p>
    </form>
  );
}

function SignUpForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUpAccount, {});

  if (state.pending) {
    return (
      <div className="border border-success/40 bg-success/10 px-6 py-8 text-center">
        <MailCheck className="mx-auto size-8 text-success" strokeWidth={1.25} aria-hidden="true" />
        <p className="mt-4 font-serif text-2xl">Vérifiez votre boîte mail</p>
        <p className="mt-2 text-[15px] text-stone">
          Un lien de confirmation a été envoyé à <strong className="font-normal text-ink">{state.email}</strong>. Ouvrez-le pour activer votre compte.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="suite" value={next} />
      <label className="flex flex-col gap-2 text-[13px] tracking-wide">
        Nom complet
        <input name="nom" autoComplete="name" required defaultValue={state.fullName} className={field} />
      </label>
      <label className="flex flex-col gap-2 text-[13px] tracking-wide">
        E-mail
        <input name="email" type="email" autoComplete="email" required defaultValue={state.email} className={field} />
      </label>
      <label className="flex flex-col gap-2 text-[13px] tracking-wide">
        <span>
          Téléphone <span className="text-stone">(facultatif, avec l&apos;indicatif)</span>
        </span>
        <input name="telephone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={state.phone} className={field} />
      </label>
      <label className="flex flex-col gap-2 text-[13px] tracking-wide">
        <span>
          Mot de passe <span className="text-stone">({MIN_PASSWORD_LENGTH} caractères minimum)</span>
        </span>
        <PasswordInput id="inscription-motdepasse" autoComplete="new-password" />
      </label>
      <ErrorMessage message={state.error} />
      <Submit pending={pending} label="Créer mon compte" />
      <p className="text-center text-xs text-stone">
        Vos informations servent à vos commandes. Voir notre{" "}
        <Link href="/confidentialite" className="underline underline-offset-4">
          politique de confidentialité
        </Link>
        .
      </p>
    </form>
  );
}

type Mode = "connexion" | "inscription" | "oubli";

/** Connexion ou création de compte, en deux onglets ; « Mot de passe oublié » s'ouvre depuis la connexion. */
export function AuthForms({ next, initialMode = "connexion" }: { next: string; initialMode?: Mode }) {
  const [tab, setTab] = useState<Mode>(initialMode);
  const tabs = [
    { id: "connexion", label: "Se connecter" },
    { id: "inscription", label: "Créer un compte" },
  ] as const;

  if (tab === "oubli") {
    return (
      <div className="mx-auto w-full max-w-md">
        <h2 className="eyebrow mb-8 border-b border-ink/15 pb-4 text-center text-gold-deep">Mot de passe oublié</h2>
        <ForgotForm onBack={() => setTab("connexion")} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div role="tablist" aria-label="Mon compte" className="mb-8 grid grid-cols-2 border-b border-ink/15">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "-mb-px h-12 border-b-2 text-[11px] uppercase tracking-[0.22em] transition-colors",
              tab === t.id ? "border-ink text-ink" : "border-transparent text-stone hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === "connexion" ? <SignInForm next={next} onForgot={() => setTab("oubli")} /> : <SignUpForm next={next} />}
      </div>
    </div>
  );
}

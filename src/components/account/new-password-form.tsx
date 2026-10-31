"use client";

import { useActionState } from "react";
import { MIN_PASSWORD_LENGTH } from "@/lib/account";
import { updatePassword, type PasswordState } from "@/server/account";
import { ErrorMessage, PasswordInput, Submit } from "./auth-forms";

/** Choix d'un nouveau mot de passe (lien « Mot de passe oublié » ou depuis « Mon compte »). */
export function NewPasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(updatePassword, {});
  return (
    <form action={action} className="mx-auto w-full max-w-md space-y-5">
      <label className="flex flex-col gap-2 text-[13px] tracking-wide">
        <span>
          Nouveau mot de passe <span className="text-stone">({MIN_PASSWORD_LENGTH} caractères minimum)</span>
        </span>
        <PasswordInput id="nouveau-motdepasse" autoComplete="new-password" />
      </label>
      <label className="flex flex-col gap-2 text-[13px] tracking-wide">
        Confirmez le mot de passe
        <PasswordInput id="confirmation-motdepasse" autoComplete="new-password" name="confirmation" />
      </label>
      <ErrorMessage message={state.error} />
      <Submit pending={pending} label="Enregistrer le mot de passe" />
    </form>
  );
}

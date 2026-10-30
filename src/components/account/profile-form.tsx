"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { inputClass } from "@/components/checkout/field";
import { Button } from "@/components/ui/button";
import type { CustomerProfile } from "@/lib/account";
import { countries } from "@/lib/delivery";
import { cn } from "@/lib/utils";
import { saveProfile, type ProfileState } from "@/server/account";

const field = cn(inputClass, "h-12 border-ink/20");
const label = "flex flex-col gap-2 text-[13px] tracking-wide";

/** Coordonnées enregistrées : elles pré-remplissent la page de commande. */
export function ProfileForm({ profile }: { profile: CustomerProfile }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(saveProfile, {});

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Nom complet
          <input name="nom" autoComplete="name" required defaultValue={profile.fullName} className={field} />
        </label>
        <label className={label}>
          Téléphone
          <input name="telephone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={profile.phone} className={field} />
        </label>
        <label className={label}>
          Pays
          <select name="pays" autoComplete="country" defaultValue={profile.country} className={field}>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className={label}>
          Ville
          <input name="ville" autoComplete="address-level2" defaultValue={profile.city} className={field} />
        </label>
      </div>
      <label className={label}>
        Adresse de livraison
        <input name="adresse" autoComplete="street-address" defaultValue={profile.address} className={field} />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="ink" disabled={pending}>
          {pending ? <LoaderCircle className="size-4 animate-spin" strokeWidth={1.5} aria-label="Enregistrement" /> : "Enregistrer"}
        </Button>
        <span role="status" className="text-sm">
          {state.ok && !pending && (
            <span className="inline-flex items-center gap-2 text-success">
              <Check className="size-4" strokeWidth={1.75} aria-hidden="true" /> Coordonnées enregistrées
            </span>
          )}
          {state.error && <span className="text-danger">{state.error}</span>}
        </span>
      </div>
    </form>
  );
}

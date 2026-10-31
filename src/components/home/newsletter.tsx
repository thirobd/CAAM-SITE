"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Inscription à la newsletter — DÉMO : l'adresse n'est ni envoyée ni enregistrée. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setError("Indiquez une adresse e-mail valide.");
      return;
    }
    setError(null);
    setDone(true);
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow text-gold-deep">Le cercle ĆAAM</p>
      <h2 className="mt-4 font-serif text-4xl font-light md:text-5xl">Recevez nos nouvelles en avant-première</h2>
      <p className="mt-4 text-stone">Nouvelles créations, éditions limitées et invitations privées.</p>

      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <m.p
            key="done"
            role="status"
            className="mt-10 inline-flex items-center gap-3 text-ink"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Check className="size-5 text-success" strokeWidth={1.5} />
            Merci ! Démo : votre adresse n&apos;a pas été enregistrée.
          </m.p>
        ) : (
          <m.form key="form" onSubmit={submit} noValidate className="mx-auto mt-10 max-w-lg" exit={{ opacity: 0, y: -8 }}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse e-mail"
                aria-invalid={!!error}
                aria-describedby={error ? "newsletter-error" : undefined}
                className="h-12 flex-1 border border-ink/25 bg-paper px-4 text-[15px] outline-none transition-colors placeholder:text-stone/70 focus:border-ink"
              />
              <Button type="submit" variant="ink">
                S&apos;inscrire
              </Button>
            </div>
            {error && (
              <p id="newsletter-error" className="mt-3 text-left text-sm text-danger">
                {error}
              </p>
            )}
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}

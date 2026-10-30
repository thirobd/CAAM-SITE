"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { signOut } from "@/server/admin/auth";

const nav = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/parfums", label: "Parfums" },
  { href: "/admin/stocks", label: "Stocks & prix" },
  { href: "/admin/commandes", label: "Commandes" },
];

type Props = { username: string; newOrders: number; children: React.ReactNode };

export function AdminShell({ username, newOrders, children }: Props) {
  const pathname = usePathname();

  return (
    <>
      <header className="bg-ink text-ivory">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo className="h-8" />
            <span className="eyebrow hidden text-champagne sm:inline">Espace propriétaire</span>
          </Link>
          {/* Libellés toujours visibles : une icône seule se touche trop facilement par erreur au téléphone. */}
          <div className="flex items-center gap-1 text-[13px]">
            <span className="mr-2 hidden text-mist md:inline">{username}</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 px-2 text-ivory/80 hover:text-ivory sm:px-3"
            >
              <ExternalLink className="size-4" strokeWidth={1.5} aria-hidden="true" /> Site
            </a>
            <form action={signOut} className="ml-1 border-l border-ivory/15 pl-1">
              <button type="submit" className="inline-flex h-10 items-center gap-2 px-2 text-ivory/80 hover:text-ivory sm:px-3">
                <LogOut className="size-4" strokeWidth={1.5} aria-hidden="true" /> Déconnexion
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Espace propriétaire" className="border-t border-ivory/10">
          <ul className="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-12 items-center gap-2 border-b-2 px-3 text-[13px] tracking-wide transition-colors",
                      active ? "border-champagne text-ivory" : "border-transparent text-ivory/65 hover:text-ivory",
                    )}
                  >
                    {item.label}
                    {item.href === "/admin/commandes" && newOrders > 0 && (
                      <span className="grid min-w-5 place-items-center rounded-full bg-champagne px-1.5 text-[11px] text-ink">
                        {newOrders}
                        <span className="sr-only"> nouvelle{newOrders > 1 ? "s" : ""}</span>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 md:pt-12">{children}</main>
    </>
  );
}

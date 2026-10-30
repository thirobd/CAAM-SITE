import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Espace propriétaire", template: "%s — Espace propriétaire ĆAAM" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-ivory text-ink">{children}</div>;
}

import { ShopShell } from "@/components/layout/shop-shell";

// Les pages sont régénérées au plus toutes les 60 s ; l'espace propriétaire les rafraîchit
// aussitôt après chaque modification. La commande revérifie toujours prix et stock en direct.
export const revalidate = 60;

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return <ShopShell>{children}</ShopShell>;
}

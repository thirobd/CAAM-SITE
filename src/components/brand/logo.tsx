import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "../../../public/brand/caam-logo.png";

/** Logo officiel ĆAAM (or, fond transparent). La largeur suit la hauteur, à passer en classe (h-10 par défaut). */
export function Logo({ className = "h-10", priority }: { className?: string; priority?: boolean }) {
  return <Image src={logo} alt="ĆAAM" priority={priority} className={cn("w-auto", className)} sizes="240px" />;
}

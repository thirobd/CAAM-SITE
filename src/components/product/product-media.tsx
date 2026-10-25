"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { BottleArt } from "./bottle-art";
import { sceneBackground } from "./scene";

type Props = {
  name: string;
  tint: string;
  /** Photo réelle ; si absente ou en erreur, le flacon dessiné prend le relais. */
  src?: string;
  tone?: "light" | "dark";
  sizes?: string;
  priority?: boolean;
  className?: string;
  bottleClassName?: string;
  /** Vrai par défaut : le nom du parfum est déjà écrit à côté du visuel (cartes, panier…). */
  decorative?: boolean;
  /** Remplit son parent positionné (absolute inset-0) au lieu de suivre le flux. */
  fill?: boolean;
};

export function ProductMedia({
  name,
  tint,
  src,
  tone = "light",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority,
  className,
  bottleClassName,
  decorative = true,
  fill = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const showPhoto = src && !failed;

  return (
    <div
      className={cn(fill ? "absolute inset-0" : "relative", "overflow-hidden", className)}
      style={showPhoto ? undefined : sceneBackground(tint, tone)}
    >
      {showPhoto ? (
        <Image src={src} alt={decorative ? "" : name} fill sizes={sizes} priority={priority} className="object-cover" onError={() => setFailed(true)} />
      ) : (
        <BottleArt
          tint={tint}
          name={name}
          decorative={decorative}
          className={cn(
            "absolute bottom-[7%] left-1/2 h-[78%] w-auto -translate-x-1/2 drop-shadow-[0_24px_30px_rgba(12,10,8,0.25)]",
            bottleClassName,
          )}
        />
      )}
    </div>
  );
}

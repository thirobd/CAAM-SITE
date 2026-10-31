"use client";

import { LazyMotion, MotionConfig } from "motion/react";

// Les composants utilisent la version légère « m » : le moteur d'animation est téléchargé
// à part, juste après l'affichage, au lieu d'alourdir le chargement de chaque page.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/** Respecte le réglage système « réduire les animations » pour toutes les animations Motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/** Fond « studio » d'un visuel produit, teinté de la couleur du parfum. */
export function sceneBackground(tint: string, tone: "light" | "dark"): React.CSSProperties {
  return tone === "dark"
    ? {
        background: `radial-gradient(ellipse at 50% 42%, color-mix(in srgb, ${tint} 42%, transparent), transparent 62%), radial-gradient(ellipse at 50% 100%, rgba(216,191,138,0.18), transparent 55%), #0c0a08`,
      }
    : {
        background: `radial-gradient(ellipse at 50% 88%, rgba(255,255,255,0.8), transparent 58%), linear-gradient(180deg, color-mix(in srgb, ${tint} 9%, #faf7f1), color-mix(in srgb, ${tint} 26%, #e9e1d3))`,
      };
}

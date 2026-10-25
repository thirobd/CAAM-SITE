import { useId } from "react";

type Props = {
  tint: string;
  name?: string;
  className?: string;
  /** Décoratif (aria-hidden) quand le nom du parfum est déjà lisible à côté. */
  decorative?: boolean;
};

/** Flacon ĆAAM dessiné en SVG — visuel provisoire tant que les photos produits ne sont pas fournies. */
export function BottleArt({ tint, name, className, decorative }: Props) {
  const uid = useId().replace(/:/g, "");
  const id = (k: string) => `${uid}-${k}`;

  return (
    <svg
      viewBox="0 0 240 380"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `Flacon ${name ?? "ĆAAM"}`}
    >
      <defs>
        <linearGradient id={id("cap")} x1="0" x2="1">
          <stop offset="0" stopColor="#5e4521" />
          <stop offset="0.32" stopColor="#c9a764" />
          <stop offset="0.5" stopColor="#f1e0b4" />
          <stop offset="0.68" stopColor="#b88a3e" />
          <stop offset="1" stopColor="#4f3a1b" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.42" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={id("liquid")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tint} stopOpacity="0.62" />
          <stop offset="1" stopColor={tint} stopOpacity="1" />
        </linearGradient>
        <radialGradient id={id("depth")} cx="0.5" cy="0.45" r="0.7">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="358" rx="82" ry="7" fill="#000" opacity="0.22" />

      {/* Bouchon doré */}
      <rect x="86" y="18" width="68" height="78" rx="5" fill={`url(#${id("cap")})`} />
      <rect x="86" y="18" width="68" height="5" rx="2.5" fill="#fff" opacity="0.28" />
      <rect x="86" y="86" width="68" height="1" fill="#3a2a14" opacity="0.5" />
      <rect x="100" y="96" width="40" height="11" fill="#7a5c2c" />

      {/* Verre et jus */}
      <rect x="34" y="106" width="172" height="244" rx="22" fill={`url(#${id("glass")})`} stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" />
      <rect x="46" y="128" width="148" height="196" rx="12" fill={`url(#${id("liquid")})`} />
      <rect x="46" y="128" width="148" height="196" rx="12" fill={`url(#${id("depth")})`} />
      <rect x="46" y="326" width="148" height="14" rx="6" fill="#fff" opacity="0.16" />
      <rect x="55" y="138" width="7" height="176" rx="3.5" fill="#fff" opacity="0.34" />
      <rect x="183" y="142" width="3" height="166" rx="1.5" fill="#fff" opacity="0.2" />

      {/* Étiquette avec le logo officiel */}
      <rect x="68" y="196" width="104" height="70" fill="#0c0a08" opacity="0.94" />
      <rect x="72.5" y="200.5" width="95" height="61" fill="none" stroke="#d8bf8a" strokeOpacity="0.5" strokeWidth="0.6" />
      <image href="/brand/caam-logo.png" x="86" y="207" width="68" height="31" preserveAspectRatio="xMidYMid meet" />
      {name && (
        <text
          x="120"
          y="253"
          textAnchor="middle"
          fontSize="6.2"
          letterSpacing="1.4"
          fill="#d8bf8a"
          style={{ fontFamily: "var(--font-jost), sans-serif", textTransform: "uppercase" }}
        >
          {name}
        </text>
      )}
    </svg>
  );
}

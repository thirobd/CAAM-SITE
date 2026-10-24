import { useId } from "react";

type Props = {
  tint: string;
  name?: string;
  className?: string;
};

/** Flacon dessiné en SVG, utilisé tant que les photos produits ne sont pas prêtes. */
export function BottleArt({ tint, name, className }: Props) {
  const id = useId();
  const liquid = `${id}-liquid`;
  const glass = `${id}-glass`;
  const cap = `${id}-cap`;

  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      role="img"
      aria-label={name ? `Flacon ${name}` : "Flacon ĆAAM"}
    >
      <defs>
        <linearGradient id={liquid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tint} stopOpacity="0.55" />
          <stop offset="1" stopColor={tint} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={cap} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a2622" />
          <stop offset="0.45" stopColor="#4a443d" />
          <stop offset="1" stopColor="#1b1815" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="274" rx="70" ry="6" fill="#000" opacity="0.08" />

      <rect x="78" y="28" width="44" height="50" rx="2" fill={`url(#${cap})`} />
      <rect x="86" y="78" width="28" height="10" fill="#B89A6A" />

      <rect x="40" y="88" width="120" height="182" rx="8" fill={`url(#${glass})`} stroke="#ffffff" strokeOpacity="0.7" />
      <rect x="49" y="104" width="102" height="156" rx="4" fill={`url(#${liquid})`} />
      <rect x="55" y="110" width="6" height="144" rx="3" fill="#ffffff" opacity="0.35" />

      <rect x="68" y="160" width="64" height="48" fill="#F7F2EA" opacity="0.94" />
      <text
        x="100"
        y="182"
        textAnchor="middle"
        fontSize="13"
        letterSpacing="3"
        fill="#1A1714"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        ĆAAM
      </text>
      {name && (
        <text
          x="100"
          y="197"
          textAnchor="middle"
          fontSize="6.5"
          letterSpacing="1.2"
          fill="#1A1714"
          opacity="0.75"
          style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase" }}
        >
          {name}
        </text>
      )}
    </svg>
  );
}

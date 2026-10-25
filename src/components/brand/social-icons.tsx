// Pictogrammes simplifiés des réseaux (Lucide ne fournit plus les logos de marques).

type IconProps = { className?: string; strokeWidth?: number };

export function InstagramIcon({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className, strokeWidth = 1.3 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M14 3v11.5a3.75 3.75 0 1 1-3.75-3.75" />
      <path d="M14 3c.4 2.7 2.4 4.6 5 4.8" />
    </svg>
  );
}

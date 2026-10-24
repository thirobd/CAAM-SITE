// Logotype provisoire. À remplacer par le logo officiel ĆAAM
// (déposer le fichier dans /public, ex. /public/logo.svg, puis utiliser <Image>).
export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`wordmark ${className}`}>ĆAAM</span>;
}

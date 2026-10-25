import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-champagne text-ink">
      <p className="container-luxe py-2.5 text-center text-[10px] font-normal uppercase tracking-[0.2em] md:text-[11px]">
        Livraison à Dakar en 24 à 48 h
        <span className="hidden sm:inline"> · Expédition en Europe et à l&apos;international</span>
        <Link href="/livraison" className="ml-3 underline underline-offset-4 hover:no-underline">
          Infos
        </Link>
      </p>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="container-luxe grid gap-10 pb-20 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20" aria-busy="true" aria-label="Chargement du parfum">
      <div className="aspect-[4/5] animate-pulse bg-ink/10" />
      <div className="space-y-5 pt-4">
        <div className="h-3 w-40 animate-pulse bg-ink/10" />
        <div className="h-16 w-3/4 animate-pulse bg-ink/10" />
        <div className="h-5 w-1/2 animate-pulse bg-ink/10" />
        <div className="h-24 animate-pulse bg-ink/5" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 animate-pulse bg-ink/10" />
          <div className="h-20 animate-pulse bg-ink/10" />
        </div>
        <div className="h-14 animate-pulse bg-ink/10" />
      </div>
    </div>
  );
}

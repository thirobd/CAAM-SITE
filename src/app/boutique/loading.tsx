export default function Loading() {
  return (
    <div className="container-luxe pb-24 pt-14 md:pt-20" aria-busy="true" aria-label="Chargement de la boutique">
      <div className="h-3 w-24 animate-pulse bg-ink/10" />
      <div className="mt-5 h-14 w-72 animate-pulse bg-ink/10" />
      <div className="mt-14 h-24 animate-pulse bg-ink/5" />
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] animate-pulse bg-ink/10" />
            <div className="mt-5 h-3 w-1/2 animate-pulse bg-ink/10" />
            <div className="mt-3 h-6 w-3/4 animate-pulse bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

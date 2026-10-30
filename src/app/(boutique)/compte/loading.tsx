export default function Loading() {
  return (
    <div className="container-luxe pb-24 pt-14 md:pt-20" aria-busy="true" aria-label="Chargement de votre compte">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <div className="h-3 w-24 animate-pulse bg-ink/10" />
        <div className="mt-5 h-14 w-64 animate-pulse bg-ink/10" />
        <div className="mt-5 h-4 w-80 max-w-full animate-pulse bg-ink/5" />
        <div className="mt-12 h-12 w-full animate-pulse bg-ink/5" />
        <div className="mt-8 h-12 w-full animate-pulse bg-ink/5" />
        <div className="mt-5 h-12 w-full animate-pulse bg-ink/5" />
        <div className="mt-8 h-14 w-full animate-pulse bg-ink/10" />
      </div>
    </div>
  );
}

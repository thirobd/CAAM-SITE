// Affiché aussitôt qu'on change de page dans l'espace propriétaire, sous la barre de navigation.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Chargement">
      <div className="h-12 w-72 max-w-full animate-pulse bg-ink/10" />
      <div className="mt-3 h-4 w-96 max-w-full animate-pulse bg-ink/5" />
      <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-32 animate-pulse bg-ink/5" />
        ))}
      </div>
      <div className="mt-10 space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-20 animate-pulse bg-ink/5" />
        ))}
      </div>
    </div>
  );
}

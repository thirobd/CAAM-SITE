export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section container container--narrow">
      <header className="page-head">
        <span className="eyebrow">Informations légales</span>
        <h1 className="display display--page">{title}</h1>
      </header>
      <div className="prose">{children}</div>
    </section>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-4xl font-light md:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[15px] text-stone">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Notice({ tone = "success", children }: { tone?: "success" | "warning"; children: React.ReactNode }) {
  return (
    <p
      role="status"
      className={
        tone === "success"
          ? "mb-8 border border-success/40 bg-success/10 px-5 py-4 text-sm text-ink"
          : "mb-8 border border-warning/40 bg-warning/5 px-5 py-4 text-sm text-ink"
      }
    >
      {children}
    </p>
  );
}

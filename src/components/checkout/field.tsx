import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
    "aria-required"?: boolean;
    className: string;
  }) => React.ReactNode;
};

export const inputClass =
  "w-full border bg-paper px-4 text-[15px] outline-none transition-colors placeholder:text-stone/60 focus:border-ink";

/** Champ de formulaire accessible : libellé, aide, message d'erreur relié au champ. */
export function Field({ id, label, error, required, hint, className, children }: Props) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[13px] tracking-wide text-ink">
        {label}
        {required ? (
          <span className="text-gold-deep" aria-hidden="true">
            {" "}*
          </span>
        ) : (
          <span className="text-stone"> (facultatif)</span>
        )}
      </label>
      {children({
        id,
        "aria-invalid": !!error,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
        className: cn(inputClass, error ? "border-danger" : "border-ink/20"),
      })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

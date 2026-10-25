import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gold" | "ink" | "outline-light" | "outline-dark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-3 whitespace-nowrap text-[11px] font-normal uppercase tracking-[0.24em] transition-colors duration-500 ease-luxe disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<Variant, string> = {
  gold: "bg-champagne text-ink hover:bg-ivory",
  ink: "bg-ink text-ivory hover:bg-gold-deep",
  "outline-light": "border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink",
  "outline-dark": "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-7",
  lg: "h-14 px-10",
};

export function buttonClasses(variant: Variant = "ink", size: Size = "md", full = false) {
  return cn(base, variants[variant], sizes[size], full && "w-full");
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & { variant?: Variant; size?: Size; full?: boolean };

export function ButtonLink({ variant, size, full, className, ...props }: ButtonLinkProps) {
  return <Link {...props} className={cn(buttonClasses(variant, size, full), className)} />;
}

type ButtonProps = React.ComponentProps<"button"> & { variant?: Variant; size?: Size; full?: boolean };

export function Button({ variant, size, full, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} {...props} className={cn(buttonClasses(variant, size, full), className)} />;
}

/** Lien texte souligné avec flèche. */
export function ArrowLink({ className, children, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        "group inline-flex items-center gap-3 border-b border-current pb-1 text-[11px] font-normal uppercase tracking-[0.24em]",
        className,
      )}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-500 ease-luxe group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  action?: React.ReactNode;
  className?: string;
};

/** Titre de section : petit surtitre doré, grand titre à empattements, texte d'introduction. */
export function SectionHeading({ eyebrow, title, description, tone = "light", align = "left", as: Tag = "h2", action, className }: Props) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow", dark ? "text-champagne" : "text-gold-deep")}>{eyebrow}</p>}
        <Tag
          className={cn(
            "mt-4 font-serif font-light leading-[1.05] tracking-[-0.01em]",
            Tag === "h1" ? "text-5xl md:text-7xl" : "text-4xl md:text-[3.4rem]",
            dark ? "text-ivory" : "text-ink",
          )}
        >
          {title}
        </Tag>
        {description && (
          <p className={cn("mt-5 text-base leading-relaxed md:text-lg", dark ? "text-mist" : "text-stone")}>{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

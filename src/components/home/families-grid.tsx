import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { familiesIn } from "@/lib/catalog/taxonomy";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/** Familles olfactives du catalogue. Une famille sans parfum n'est pas affichée. */
export function FamiliesGrid({ products }: { products: Product[] }) {
  const shown = familiesIn(products);
  return (
    <RevealGroup as="div" className={cn("grid grid-cols-2 border-l border-t border-ink/10", shown.length >= 3 && "lg:grid-cols-3")}>
      {shown.map((f) => {
        const count = products.filter((p) => p.family === f.id).length;
        return (
          <RevealItem key={f.id} className="border-b border-r border-ink/10">
            <Link href={`/boutique?famille=${f.id}`} className="group flex h-full flex-col gap-5 p-6 transition-colors duration-500 hover:bg-paper md:p-10">
              <span
                aria-hidden="true"
                className="size-14 rounded-full transition-transform duration-700 ease-luxe group-hover:scale-110 md:size-16"
                style={{ background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${f.tint} 35%, #fff), ${f.tint} 70%)` }}
              />
              <div>
                <h3 className="font-serif text-3xl">{f.label}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone">{f.description}</p>
              </div>
              <span className="eyebrow mt-auto text-gold-deep">
                {count} parfum{count > 1 ? "s" : ""}
                <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

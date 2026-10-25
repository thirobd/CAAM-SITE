import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/ui/button";
import mark from "../../../public/brand/caam-mark.png";

const pillars = [
  { title: "Caractère", text: "Des compositions affirmées, qui ne ressemblent qu'à vous." },
  { title: "Élégance", text: "Des matières nobles et une écriture olfactive raffinée." },
  { title: "Intensité", text: "Des extraits concentrés, pour un sillage qui dure." },
];

export function BrandStory() {
  return (
    <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
      <Reveal className="flex justify-center">
        <div className="grain relative grid aspect-[4/5] w-full max-w-[460px] place-items-center overflow-hidden rounded-t-full bg-ink">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(216,191,138,0.28),transparent_62%)]" />
          <Image src={mark} alt="" className="relative h-[46%] w-auto drop-shadow-[0_0_40px_rgba(216,191,138,0.35)]" sizes="220px" />
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="eyebrow text-gold-deep">La maison</p>
        <h2 className="mt-4 font-serif text-4xl font-light leading-[1.05] md:text-[3.4rem]">
          Une signature, <em className="text-gold-deep">une empreinte.</em>
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-stone md:text-lg">
          <p>
            ĆAAM est une maison de parfum de luxe, née d&apos;un couple et d&apos;une même exigence, entre Dakar et l&apos;Europe.
          </p>
          <p>
            Nous composons exclusivement des extraits de parfum, la forme la plus concentrée du parfum, pour elle, pour lui et pour les esprits libres.
          </p>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {pillars.map((p) => (
            <li key={p.title} className="border-t border-ink pt-4">
              <h3 className="font-serif text-2xl">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{p.text}</p>
            </li>
          ))}
        </ul>
        <ArrowLink href="/maison" className="mt-10">
          Découvrir notre histoire
        </ArrowLink>
      </Reveal>
    </div>
  );
}

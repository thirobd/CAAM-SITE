import type { Metadata } from "next";
import Image from "next/image";
import { InstagramIcon, TikTokIcon } from "@/components/brand/social-icons";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/lib/site";
import mark from "../../../../public/brand/caam-mark.png";

export const metadata: Metadata = {
  title: "Notre histoire",
  description: "ĆAAM, maison de parfum de luxe entre Dakar et l'Europe : des extraits de parfum de caractère, d'élégance et d'intensité.",
};

const values = [
  { title: "Caractère", text: "Chaque création affirme une personnalité. Nous préférons une signature marquante à un parfum consensuel." },
  { title: "Élégance", text: "Une écriture olfactive raffinée, des accords équilibrés et un flacon pensé comme un objet." },
  { title: "Intensité", text: "Nous ne composons que des extraits de parfum, la concentration la plus riche, pour une tenue et un sillage remarquables." },
];

export default function MaisonPage() {
  return (
    <>
      <section className="grain bg-ink text-ivory">
        <div className="container-luxe grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.2fr_1fr]">
          <SectionHeading
            as="h1"
            tone="dark"
            eyebrow="Notre histoire"
            title={
              <>
                Une maison,
                <br />
                <em className="text-champagne">deux sensibilités.</em>
              </>
            }
            description="ĆAAM est une maison de parfum de luxe fondée par un jeune couple, entre Dakar et l'Europe. Une même passion, une même exigence : créer des parfums qui laissent une empreinte."
          />
          <Reveal className="flex justify-center">
            <Image src={mark} alt="" className="h-64 w-auto drop-shadow-[0_0_50px_rgba(216,191,138,0.35)] md:h-80" sizes="200px" priority />
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="eyebrow text-gold-deep">L&apos;extrait de parfum</p>
            <h2 className="mt-4 font-serif text-4xl font-light md:text-5xl">Le choix de l&apos;intensité</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-stone">
            <p>
              Nous composons exclusivement des extraits de parfum. C&apos;est la forme la plus concentrée du parfum : plus riche, plus durable, elle
              révèle les matières dans toute leur profondeur.
            </p>
            <p>
              Nos créations s&apos;adressent aux femmes, aux hommes et aux esprits libres, à toutes celles et ceux qui voient dans le parfum une manière
              d&apos;affirmer qui ils sont.
            </p>
            <p className="border-l-2 border-champagne pl-5 text-base italic">
              [À compléter par ĆAAM : la signification du nom, la rencontre du couple, l&apos;origine des matières premières.]
            </p>
          </Reveal>
        </div>

        <ul className="mt-20 grid gap-10 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} as="li" delay={i * 0.08} className="border-t border-ink pt-6">
              <h3 className="font-serif text-3xl">{v.title}</h3>
              <p className="mt-3 leading-relaxed text-stone">{v.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <div className="container-luxe flex flex-col items-center gap-6 text-center">
          <p className="eyebrow text-gold-deep">{site.locations}</p>
          <h2 className="max-w-2xl font-serif text-4xl font-light md:text-5xl">Suivez nos créations au quotidien</h2>
          <p className="max-w-xl text-stone">Nouveautés, coulisses et collections sont partagées sur nos réseaux officiels.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-3 border border-ink/30 px-6 text-[11px] uppercase tracking-[0.24em] transition-colors hover:bg-ink hover:text-ivory">
              <InstagramIcon className="size-4" /> Instagram
            </a>
            <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-3 border border-ink/30 px-6 text-[11px] uppercase tracking-[0.24em] transition-colors hover:bg-ink hover:text-ivory">
              <TikTokIcon className="size-4" /> TikTok
            </a>
          </div>
          <ButtonLink href="/boutique" variant="ink" size="lg" className="mt-6">
            Découvrir la collection
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

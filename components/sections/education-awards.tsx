import { FadeUp, SplitReveal } from "@/components/motion/reveal";
import { education } from "@/content/education";
import { awards } from "@/content/awards";
import { sections } from "@/lib/sections";
import { cn } from "@/lib/cn";

const titleClass = "text-[clamp(2.6rem,5.6vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.05em]";

/** Education and awards side by side: two short lists, each its own section. */
export function EducationAwards() {
  return (
    <div className="page grid gap-24 py-24 sm:py-32 lg:grid-cols-2 lg:gap-16 lg:py-40">
      <section id={sections.education.id} aria-labelledby={`${sections.education.id}-title`}>
        <SplitReveal as="h2" type="chars" id={`${sections.education.id}-title`} className={titleClass}>
          {sections.education.title}
        </SplitReveal>
        <FadeUp as="ol" className="mt-12 border-b border-line">
          {education.map((e) => (
            <li key={e.degree} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-6 border-t border-line py-6">
              <p className="tnum pt-0.5 text-muted">{e.year}</p>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold leading-snug">{e.degree}</h3>
                <p className="mt-1 text-muted">{e.institution}</p>
                {e.board ? <p className="text-[0.9rem] text-muted">{e.board}</p> : null}
              </div>
            </li>
          ))}
        </FadeUp>
      </section>

      <section id={sections.awards.id} aria-labelledby={`${sections.awards.id}-title`}>
        <SplitReveal as="h2" type="chars" id={`${sections.awards.id}-title`} className={titleClass}>
          {sections.awards.title}
        </SplitReveal>
        <FadeUp as="ul" className="mt-12 border-b border-line">
          {awards.map((a) => (
            <li key={a.title} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-6 border-t border-line py-6">
              <p className="tnum pt-0.5 text-muted">{a.year ?? ""}</p>
              <div className="min-w-0">
                <h3
                  className={cn(
                    "leading-snug",
                    a.highlight ? "text-[1.6rem] font-bold tracking-tight" : "text-lg font-semibold",
                  )}
                >
                  {a.highlight ? (
                    <span aria-hidden="true" className="mr-3 inline-block h-[0.45em] w-[0.45em] -translate-y-[0.12em] rounded-full bg-accent" />
                  ) : null}
                  {a.title}
                </h3>
                {a.org ? <p className="mt-1 text-muted">{a.org}</p> : null}
              </div>
            </li>
          ))}
        </FadeUp>
      </section>
    </div>
  );
}

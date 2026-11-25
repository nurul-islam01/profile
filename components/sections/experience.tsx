import { Section } from "@/components/section";
import { FadeUp, ScrollLine, SplitReveal } from "@/components/motion/reveal";
import { experience } from "@/content/experience";

export function Experience() {
  return (
    <Section name="experience">
      <div className="relative">
        {/* Timeline rail that fills with jute as the roles scroll past */}
        <ScrollLine targetId="experience-roles" className="bottom-2 left-[0.3rem] top-2 hidden md:block lg:left-[calc(14rem+1.25rem)]" />
        <ol id="experience-roles" className="space-y-20 lg:space-y-28">
          {experience.map((role) => (
            <li key={role.id} className="relative grid gap-x-10 gap-y-5 md:pl-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:pl-0">
              <span
                aria-hidden="true"
                className={
                  role.current
                    ? "absolute left-0 top-[0.55rem] hidden h-[0.65rem] w-[0.65rem] rounded-full bg-accent md:block lg:left-[calc(14rem+1.25rem-0.3rem)]"
                    : "absolute left-0 top-[0.55rem] hidden h-[0.65rem] w-[0.65rem] rounded-full border border-line bg-bg md:block lg:left-[calc(14rem+1.25rem-0.3rem)]"
                }
              />
              <p className="tnum text-[1.05rem] font-medium leading-snug text-muted lg:pt-1">
                {role.start} – {role.end}
              </p>
              <div className="min-w-0 lg:pl-14">
                <SplitReveal
                  as="h3"
                  type="lines"
                  className="text-[clamp(1.9rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.035em]"
                >
                  {role.title}
                </SplitReveal>
                <p className="mt-3 text-lg text-muted">
                  {role.company}, {role.location}
                </p>
                <FadeUp as="ul" className="mt-7 max-w-[64ch] space-y-3 text-[1.05rem] leading-relaxed" stagger={0.06}>
                  {role.highlights.map((h) => (
                    <li key={h} className="flex gap-4">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-muted" />
                      <span>{h}</span>
                    </li>
                  ))}
                </FadeUp>
                {role.stack?.length ? (
                  <p className="mt-7 max-w-[64ch] text-[0.95rem] text-muted">{role.stack.join(", ")}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

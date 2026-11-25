import { sections, type SectionKey } from "@/lib/sections";
import { SplitReveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

/**
 * Page section with a display-size title whose letters rise in on scroll.
 * Ids and titles come from lib/sections.ts.
 */
export function Section({
  name,
  children,
  aside,
  className,
}: {
  name: SectionKey;
  children: React.ReactNode;
  /** Small text at the right end of the title row (e.g. a count). */
  aside?: React.ReactNode;
  className?: string;
}) {
  const { id, title } = sections[name];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("page py-24 sm:py-32 lg:py-40", className)}>
      <div className="mb-12 flex items-end justify-between gap-6 lg:mb-20">
        <SplitReveal
          as="h2"
          type="chars"
          id={`${id}-title`}
          className="text-[clamp(3.4rem,11.5vw,11rem)] font-extrabold leading-[0.82] tracking-[-0.055em]"
        >
          {title}
        </SplitReveal>
        {aside ? <div className="tnum shrink-0 pb-[0.6em] text-[0.95rem] text-muted">{aside}</div> : null}
      </div>
      {children}
    </section>
  );
}

import { Section } from "@/components/section";
import { Marquee } from "@/components/motion/marquee";
import { FadeUp } from "@/components/motion/reveal";
import { skills } from "@/content/skills";

export function Skills() {
  const [primary, ...rest] = skills;
  const half = primary ? Math.ceil(primary.items.length / 2) : 0;

  return (
    <Section name="skills">
      {primary ? (
        <>
          {/* Two drifting rows of the main expertise; the list below carries the same words for screen readers. */}
          <div className="mb-20 ml-[calc(50%-50vw)] w-screen space-y-2 lg:mb-28">
            <Marquee
              items={primary.items.slice(0, half)}
              itemClassName="text-[clamp(2.6rem,7vw,6.5rem)] font-extrabold leading-[1.1] tracking-[-0.045em]"
            />
            <Marquee
              items={primary.items.slice(half)}
              reverse
              itemClassName="text-[clamp(2.6rem,7vw,6.5rem)] font-extrabold leading-[1.1] tracking-[-0.045em] text-transparent [-webkit-text-stroke:1.5px_rgb(var(--fg))]"
            />
          </div>
        </>
      ) : null}

      <FadeUp as="dl" className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
        {primary ? (
          <div className="sr-only">
            <dt>{primary.name}</dt>
            <dd>{primary.items.join(", ")}</dd>
          </div>
        ) : null}
        {rest.map((group) => (
          <div key={group.name} className="border-t border-line pt-5">
            <dt className="text-[0.95rem] text-muted">{group.name}</dt>
            <dd className="mt-2 text-lg font-medium leading-relaxed">{group.items.join(", ")}</dd>
          </div>
        ))}
      </FadeUp>
    </Section>
  );
}

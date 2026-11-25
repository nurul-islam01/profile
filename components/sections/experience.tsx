import { Section, metaRow } from "@/components/section";
import { experience } from "@/content/experience";

export function Experience() {
  return (
    <Section name="experience">
      <ol className="space-y-14">
        {experience.map((role) => (
          <li key={role.id} className={metaRow}>
            <p className="tnum flex items-baseline gap-2 pt-1 text-[0.95rem] text-muted">
              {role.current ? (
                <span aria-hidden="true" className="h-2 w-2 shrink-0 -translate-y-px rounded-full bg-accent" />
              ) : null}
              <span>
                {role.start} – {role.end}
              </span>
            </p>
            <div className="min-w-0">
              <h3 className="text-xl font-bold leading-snug tracking-tight">{role.title}</h3>
              <p className="mt-0.5 text-muted">
                {role.company}, {role.location}
              </p>
              <ul className="mt-4 max-w-[68ch] list-disc space-y-2 pl-5 marker:text-muted">
                {role.highlights.map((h) => (
                  <li key={h} className="pl-1">
                    {h}
                  </li>
                ))}
              </ul>
              {role.stack?.length ? (
                <p className="mt-4 max-w-[68ch] text-sm text-muted">{role.stack.join(", ")}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

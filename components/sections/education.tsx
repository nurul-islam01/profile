import { Section, metaRow } from "@/components/section";
import { education } from "@/content/education";
import { cn } from "@/lib/cn";

export function Education() {
  return (
    <Section name="education">
      <ol className="divide-y divide-line">
        {education.map((e) => (
          <li key={e.degree} className={cn(metaRow, "py-5 first:pt-1 last:pb-0")}>
            <p className="tnum text-[0.95rem] text-muted">{e.year}</p>
            <div className="min-w-0">
              <h3 className="font-semibold leading-snug">{e.degree}</h3>
              <p className="mt-0.5 text-muted">{e.institution}</p>
              {e.board ? <p className="text-sm text-muted">{e.board}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

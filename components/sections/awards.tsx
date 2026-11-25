import { Section, metaRow } from "@/components/section";
import { awards } from "@/content/awards";
import { cn } from "@/lib/cn";

export function Awards() {
  return (
    <Section name="awards">
      <ul className="divide-y divide-line">
        {awards.map((a) => (
          <li key={a.title} className={cn(metaRow, "py-5 first:pt-1 last:pb-0")}>
            {a.year ? (
              <p className="tnum text-[0.95rem] text-muted">{a.year}</p>
            ) : (
              <span aria-hidden="true" className="hidden md:block" />
            )}
            <div className="min-w-0">
              <h3
                className={cn(
                  "leading-snug",
                  a.highlight ? "text-xl font-bold tracking-tight" : "font-semibold",
                )}
              >
                {a.title}
              </h3>
              {a.org ? <p className="mt-0.5 text-muted">{a.org}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

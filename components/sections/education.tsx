import { SectionShell } from "@/components/terminal/section-shell";
import { education } from "@/content/education";

export function Education() {
  return (
    <SectionShell id="education" path="~/education" cmd="cat education.txt" title="Education">
      <ul className="space-y-4 font-mono text-sm sm:text-base">
        {education.map((e, i) => (
          <li
            key={i}
            className="rounded-md border border-terminal-border bg-terminal-surface px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-terminal-fg font-semibold">{e.degree}</span>
              <span className="text-terminal-muted text-xs">{e.year}</span>
            </div>
            <div className="mt-1 text-terminal-muted">
              {e.institution}
              {e.board ? <span className="opacity-70"> — {e.board}</span> : null}
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

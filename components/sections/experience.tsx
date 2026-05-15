import { SectionShell } from "@/components/terminal/section-shell";
import { experience } from "@/content/experience";

export function Experience() {
  return (
    <SectionShell
      id="experience"
      path="~/experience"
      cmd="git log --oneline --decorate"
      title="Experience"
    >
      <ol className="space-y-10">
        {experience.map((role, idx) => (
          <li key={role.id} className="relative pl-6 sm:pl-8">
            {role.current ? (
              <span
                aria-hidden
                className="absolute left-0 top-2 inline-flex h-2 w-2 items-center justify-center"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-accent opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-terminal-accent" />
              </span>
            ) : (
              <span
                aria-hidden
                className="absolute left-0 top-2 inline-block h-2 w-2 rounded-full bg-terminal-prompt"
              />
            )}
            {idx !== experience.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[3px] top-4 h-[calc(100%+1.5rem)] w-px bg-terminal-border"
              />
            )}
            <div className="font-mono text-sm sm:text-base">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-terminal-prompt">commit</span>
                <span className="text-terminal-muted">{role.id}</span>
                {role.current && (
                  <span className="inline-flex items-center gap-1 rounded-sm border border-terminal-accent bg-terminal-accent/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-terminal-accent">
                    <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-accent" />
                    HEAD · now
                  </span>
                )}
              </div>
              <div className="mt-1 text-terminal-muted">
                <span className="text-terminal-fg">Author:</span> {role.company}{" "}
                <span className="opacity-60">&lt;{role.location}&gt;</span>
              </div>
              <div className="text-terminal-muted">
                <span className="text-terminal-fg">Date:</span> {role.start} – {role.end}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-sans text-lg font-semibold text-terminal-fg">
                {role.title}
                <span className="font-normal text-terminal-muted"> @ {role.company}</span>
              </h3>
              <ul className="mt-3 space-y-2 font-sans text-sm sm:text-base text-terminal-fg/90">
                {role.highlights.map((h, i) => (
                  <li key={i} className="pl-5 relative leading-relaxed">
                    <span className="absolute left-0 top-2 text-terminal-prompt font-mono">›</span>
                    {h}
                  </li>
                ))}
              </ul>
              {role.stack && role.stack.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-xs">
                  {role.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-sm border border-terminal-border bg-terminal-surface px-2 py-0.5 text-terminal-muted"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

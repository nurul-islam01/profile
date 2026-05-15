import { SectionShell } from "@/components/terminal/section-shell";
import { experience } from "@/content/experience";

export function Experience() {
  return (
    <SectionShell
      id="experience"
      path="~/experience"
      cmd="git log -p --reverse"
      title="Experience"
    >
      <ol className="space-y-8 font-mono text-sm">
        {experience.map((role, idx) => (
          <li key={role.id} className="relative pl-6 sm:pl-7">
            {/* Timeline marker */}
            {role.current ? (
              <span aria-hidden className="absolute left-0 top-1.5 inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-accent opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-terminal-accent" />
              </span>
            ) : (
              <span
                aria-hidden
                className="absolute left-0 top-1.5 inline-block h-2.5 w-2.5 rounded-full bg-terminal-prompt"
              />
            )}
            {idx !== experience.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[5px] top-5 h-[calc(100%+0.5rem)] w-px bg-terminal-border"
              />
            )}

            {/* git log header */}
            <div className="leading-relaxed">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span>
                  <span className="text-terminal-keyword">commit</span>{" "}
                  <span className="text-terminal-string">{role.id}</span>
                </span>
                {role.current && (
                  <span className="inline-flex items-center gap-1 text-terminal-accent">
                    <span className="opacity-70">(</span>
                    <span className="text-terminal-keyword">HEAD</span>
                    <span className="opacity-70"> -&gt; </span>
                    <span>now</span>
                    <span className="opacity-70">)</span>
                  </span>
                )}
              </div>
              <div className="text-terminal-muted">
                Author: {role.company} &lt;{role.location}&gt;
              </div>
              <div className="text-terminal-muted">
                Date:   {role.start} – {role.end}
              </div>
            </div>

            {/* Commit message + diff */}
            <div className="mt-3 pl-4 sm:pl-6 leading-relaxed">
              <p className="text-terminal-fg">
                {role.title}{" "}
                <span className="text-terminal-muted">@ {role.company}</span>
              </p>

              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[12.5px] sm:text-sm">
                <code className="block">
                  <span className="text-terminal-muted">--- a/role.previous</span>
                  {"\n"}
                  <span className="text-terminal-muted">+++ b/role.current</span>
                  {"\n"}
                  <span className="text-terminal-prompt">@@ {role.start} – {role.end} @@</span>
                  {"\n"}
                  {role.highlights.map((h, i) => (
                    <span key={i} className="block text-terminal-accent">
                      + {h}
                    </span>
                  ))}
                </code>
              </pre>

              {role.stack && role.stack.length > 0 && (
                <div className="mt-3 break-words text-terminal-muted">
                  <span className="text-terminal-comment"># stack: </span>
                  <span className="text-terminal-keyword">[</span>
                  {role.stack.map((s, i) => (
                    <span key={s}>
                      <span className="text-terminal-string">&quot;{s}&quot;</span>
                      {i < role.stack!.length - 1 && <span>, </span>}
                    </span>
                  ))}
                  <span className="text-terminal-keyword">]</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

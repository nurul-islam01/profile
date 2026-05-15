import { SectionShell } from "@/components/terminal/section-shell";
import { awards } from "@/content/awards";

export function Awards() {
  return (
    <SectionShell id="awards" path="~/awards" cmd="cat awards.log" title="Awards & Activities">
      <pre className="overflow-x-auto rounded-md border border-terminal-border bg-terminal-surface px-4 py-4 font-mono text-xs sm:text-sm leading-relaxed">
        <code className="block whitespace-pre-wrap break-words">
          <span className="text-terminal-comment"># awards.log — entries: {awards.length}</span>
          {"\n\n"}
          {awards.map((a, i) => (
            <span key={i} className="block">
              <span className={a.highlight ? "text-terminal-accent" : "text-terminal-prompt"}>
                {a.highlight ? "★" : "›"}
              </span>{" "}
              <span className={a.highlight ? "text-terminal-fg font-semibold" : "text-terminal-fg"}>
                {a.title}
              </span>
              {(a.year || a.org) && (
                <span className="text-terminal-muted">
                  {"\n  "}
                  <span className="text-terminal-comment">// </span>
                  {[a.org, a.year].filter(Boolean).join(" · ")}
                </span>
              )}
              {i < awards.length - 1 && "\n\n"}
            </span>
          ))}
        </code>
      </pre>
    </SectionShell>
  );
}

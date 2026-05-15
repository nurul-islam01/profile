import { SectionShell } from "@/components/terminal/section-shell";
import { education } from "@/content/education";

export function Education() {
  return (
    <SectionShell id="education" path="~/education" cmd="cat history.txt" title="Education">
      <pre className="overflow-x-auto rounded-md border border-terminal-border bg-terminal-surface px-4 py-4 font-mono text-xs sm:text-sm leading-relaxed">
        <code className="block whitespace-pre-wrap break-words">
          <span className="text-terminal-comment"># reverse-chronological</span>
          {"\n\n"}
          {education.map((e, i) => (
            <span key={i} className="block">
              <span className="text-terminal-prompt">[{e.year}]</span>{" "}
              <span className="text-terminal-fg font-semibold">{e.degree}</span>
              {"\n        "}
              <span className="text-terminal-muted">@ </span>
              <span className="text-terminal-fg/90">{e.institution}</span>
              {e.board && (
                <>
                  {"\n        "}
                  <span className="text-terminal-comment">// {e.board}</span>
                </>
              )}
              {i < education.length - 1 && "\n\n"}
            </span>
          ))}
        </code>
      </pre>
    </SectionShell>
  );
}

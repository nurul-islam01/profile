import { SectionShell } from "@/components/terminal/section-shell";
import { awards } from "@/content/awards";
import { Award as AwardIcon } from "lucide-react";

export function Awards() {
  return (
    <SectionShell id="awards" path="~/awards" cmd="cat awards.txt" title="Awards & Activities">
      <ul className="space-y-3 font-mono text-sm sm:text-base">
        {awards.map((a, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-md border border-terminal-border bg-terminal-surface px-4 py-3"
          >
            <span className={`mt-0.5 ${a.highlight ? "text-terminal-accent" : "text-terminal-muted"}`}>
              {a.highlight ? <AwardIcon className="h-4 w-4" /> : <span>›</span>}
            </span>
            <div className="flex-1">
              <span className={a.highlight ? "text-terminal-fg font-semibold" : "text-terminal-fg"}>
                {a.title}
              </span>
              {(a.year || a.org) && (
                <span className="text-terminal-muted">
                  {" — "}
                  {[a.org, a.year].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

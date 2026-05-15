import { SectionShell } from "@/components/terminal/section-shell";
import { skills } from "@/content/skills";

export function Skills() {
  return (
    <SectionShell id="skills" path="~/skills" cmd="tree -L 2" title="Skills">
      <div className="rounded-lg border border-terminal-border bg-terminal-surface p-5 sm:p-6 font-mono text-sm leading-7 overflow-x-auto">
        <div className="text-terminal-muted">.</div>
        {skills.map((group, gi) => {
          const isLast = gi === skills.length - 1;
          return (
            <div key={group.name}>
              <div className="text-terminal-fg">
                <span className="text-terminal-muted">{isLast ? "└── " : "├── "}</span>
                <span className="text-terminal-prompt">{group.name}/</span>
              </div>
              {group.items.map((item, ii) => {
                const itemLast = ii === group.items.length - 1;
                const branch = isLast ? "    " : "│   ";
                return (
                  <div key={item} className="text-terminal-fg/90">
                    <span className="text-terminal-muted">{branch}{itemLast ? "└── " : "├── "}</span>
                    {item}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

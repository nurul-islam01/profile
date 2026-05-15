import { SectionShell } from "@/components/terminal/section-shell";
import { projects } from "@/content/projects";
import { ArrowUpRight } from "lucide-react";

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <SectionShell id="projects" path="~/projects" cmd="ls -la" title="Projects">
      <div className="space-y-10">
        <div>
          <p className="mb-4 font-mono text-xs text-terminal-muted">
            <span className="text-terminal-prompt">#</span> featured/
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 font-mono text-xs text-terminal-muted">
            <span className="text-terminal-prompt">#</span> more/
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <ProjectCard key={p.slug} project={p} compact />
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function ProjectCard({
  project,
  compact = false,
}: {
  project: (typeof projects)[number];
  compact?: boolean;
}) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-lg border border-terminal-border bg-terminal-surface p-5 transition-all hover:border-terminal-prompt hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-mono text-base text-terminal-fg group-hover:text-terminal-prompt">
          {project.name}
        </h3>
        <ArrowUpRight className="h-4 w-4 text-terminal-muted group-hover:text-terminal-prompt transition-colors" />
      </div>
      <p className={`mt-2 font-sans ${compact ? "text-xs" : "text-sm"} text-terminal-muted leading-relaxed`}>
        {project.tagline}
      </p>
      {!compact && (
        <p className="mt-3 font-mono text-xs text-terminal-muted">
          <span className="text-terminal-prompt">›</span> {project.role}
        </p>
      )}
      <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
        {project.stack.map((s) => (
          <li
            key={s}
            className="rounded-sm border border-terminal-border px-1.5 py-0.5 text-terminal-muted"
          >
            {s}
          </li>
        ))}
      </ul>
    </a>
  );
}

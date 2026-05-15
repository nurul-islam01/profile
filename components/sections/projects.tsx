import { SectionShell } from "@/components/terminal/section-shell";
import { projects, type Project } from "@/content/projects";

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <SectionShell id="projects" path="~/projects" cmd="ls -la" title="Projects">
      <div className="space-y-8">
        <ProjectTable label="featured" rows={featured} total={featured.length} />
        <ProjectTable label="archive" rows={rest} total={rest.length} dim />
      </div>
    </SectionShell>
  );
}

function ProjectTable({
  label,
  rows,
  total,
  dim = false,
}: {
  label: string;
  rows: Project[];
  total: number;
  dim?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs text-terminal-muted">
        <span className="text-terminal-prompt">$</span> ls -la ~/projects/{label}
      </p>
      <div className="overflow-x-auto rounded-md border border-terminal-border bg-terminal-surface font-mono text-xs sm:text-[13px]">
        <div className="px-4 pt-3 pb-2 text-terminal-muted">total {total}</div>
        <ul className="divide-y divide-terminal-border/40">
          {rows.map((p) => (
            <li key={p.slug}>
              <ProjectRow project={p} dim={dim} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function shortHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ProjectRow({ project, dim }: { project: Project; dim?: boolean }) {
  const host = shortHost(project.url);
  const mode = "drwxr-xr-x";
  // Cheap-but-fun "size" — derived from name length to look ls-like without lying.
  const size = `${(host.length * 137 + project.role.length * 421).toString().slice(0, 4)}`;
  const owner =
    project.org === "Personal" ? "self" : project.org === "Navana Group" ? "navana" : "p-alo";

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.name} — open ${host} in a new tab`}
      className="group block px-4 py-2.5 transition-colors hover:bg-terminal-bg focus-visible:bg-terminal-bg focus-visible:outline-none"
    >
      {/* Desktop / wide: single-line ls row */}
      <div className="hidden md:grid md:grid-cols-[110px_60px_70px_minmax(0,1fr)_18px] md:items-center md:gap-x-4">
        <span className="text-terminal-muted">{mode}</span>
        <span className="text-terminal-muted">{size}</span>
        <span className="text-terminal-muted">{owner}</span>
        <span className={`truncate ${dim ? "text-terminal-fg/80" : "text-terminal-fg"} group-hover:text-terminal-prompt`}>
          {host}
        </span>
        <span className="text-terminal-muted transition-colors group-hover:text-terminal-prompt">↗</span>
      </div>

      {/* Mobile: stacked rows */}
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className={`truncate ${dim ? "text-terminal-fg/80" : "text-terminal-fg"} group-hover:text-terminal-prompt`}>
            {host}
          </span>
          <span className="shrink-0 text-terminal-muted group-hover:text-terminal-prompt">↗</span>
        </div>
        <div className="mt-1 text-[11px] text-terminal-muted">
          <span className="text-terminal-prompt">›</span> {project.tagline}
        </div>
      </div>

      {/* Desktop tagline as second-line hint */}
      <div className="mt-1 hidden text-[11px] text-terminal-muted md:block md:pl-[170px]">
        <span className="text-terminal-prompt">#</span> {project.tagline}
      </div>
    </a>
  );
}

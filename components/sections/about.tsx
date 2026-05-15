import Image from "next/image";
import { SectionShell } from "@/components/terminal/section-shell";
import { profile } from "@/content/profile";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Portrait() {
  if (profile.photoUrl) {
    return (
      <Image
        src={profile.photoUrl}
        alt={profile.name}
        width={240}
        height={240}
        className="h-full w-full object-cover"
        priority
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-terminal-surface">
      <span className="font-mono text-5xl font-semibold text-terminal-prompt">
        {initials(profile.name)}
      </span>
    </div>
  );
}

export function About() {
  return (
    <SectionShell id="about" path="~/about" cmd="cat bio.md" title="About">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[160px_1fr] sm:gap-10">
        {/* Portrait — terminal-window framed */}
        <div className="mx-auto w-32 sm:mx-0 sm:w-40">
          <div className="overflow-hidden rounded-md border border-terminal-border bg-terminal-surface shadow-sm">
            <div className="flex items-center gap-1.5 border-b border-terminal-border px-2.5 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" aria-hidden />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" aria-hidden />
              <span className="ml-2 font-mono text-[10px] text-terminal-muted">~/me.jpg</span>
            </div>
            <div className="aspect-square">
              <Portrait />
            </div>
          </div>
        </div>

        {/* Bio + metadata */}
        <article className="prose prose-neutral dark:prose-invert max-w-none font-sans text-terminal-fg">
          <p className="text-base leading-relaxed sm:text-lg">{profile.bio}</p>
          <ul className="mt-4 grid grid-cols-1 list-none gap-y-1 p-0 font-mono text-sm text-terminal-muted sm:grid-cols-2">
            <li><span className="text-terminal-prompt">›</span> {profile.location}</li>
            <li><span className="text-terminal-prompt">›</span> {profile.email}</li>
            <li><span className="text-terminal-prompt">›</span> {profile.company} · {profile.shortRole}</li>
            <li><span className="text-terminal-prompt">›</span> 7+ years experience</li>
          </ul>
        </article>
      </div>
    </SectionShell>
  );
}

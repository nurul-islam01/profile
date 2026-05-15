import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-terminal-border py-10 font-mono text-sm text-terminal-muted">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-terminal-prompt">#</span>{" "}
          © {year} {profile.name}. Built with Next.js · Deployed on Ubuntu + nginx.
        </p>
        <p>
          <a className="link-underline" href={profile.socials.github}>github</a>{" · "}
          <a className="link-underline" href={profile.socials.linkedin}>linkedin</a>{" · "}
          <a className="link-underline" href={`mailto:${profile.email}`}>email</a>
        </p>
      </div>
    </footer>
  );
}

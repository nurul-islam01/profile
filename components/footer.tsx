import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="page">
      <div className="flex flex-col gap-4 border-t border-line py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name}. Built with Next.js and deployed on Vercel.
        </p>
        <ul className="flex gap-6">
          <li>
            <a className="link" href={profile.socials.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a className="link" href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="link" href={`mailto:${profile.email}`}>
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

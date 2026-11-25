import { profile } from "@/content/profile";
import { LocalTime } from "@/components/local-time";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="page">
      <div className="grid gap-6 border-t border-line py-10 text-[0.95rem] text-muted md:grid-cols-[1fr_auto_auto] md:items-center md:gap-12">
        <p>
          © {year} {profile.name}. Built with Next.js and deployed on Vercel.
        </p>
        <LocalTime />
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

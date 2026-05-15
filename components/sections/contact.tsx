import { SectionShell } from "@/components/terminal/section-shell";
import { ContactForm } from "./contact-form";
import { profile } from "@/content/profile";

type Item = { key: string; value: string; href: string | null };

const items: Item[] = [
  { key: "mail", value: profile.email, href: `mailto:${profile.email}` },
  { key: "tel ", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { key: "git ", value: "github.com/nurul-islam01", href: profile.socials.github },
  { key: "in  ", value: "linkedin.com/in/nurul-islam01", href: profile.socials.linkedin },
  { key: "loc ", value: profile.location, href: null },
];

export function Contact() {
  return (
    <SectionShell id="contact" path="~/contact" cmd="cat README.md" title="Contact">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <pre className="font-mono text-sm leading-relaxed text-terminal-fg whitespace-pre-wrap break-words">
            <code>
              <span className="text-terminal-comment"># README.md</span>
              {"\n"}
              <span>Got an idea, a role, or a hard engineering problem?</span>
              {"\n"}
              <span>I read every message — best reached via the form below</span>
              {"\n"}
              <span>or at </span>
              <a className="text-terminal-link link-underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <span>.</span>
              {"\n\n"}
              <span className="text-terminal-muted">
                <span className="text-terminal-prompt">›</span> typical response time:{" "}
              </span>
              <span className="text-terminal-accent">within 24 hours</span>
            </code>
          </pre>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-2 font-mono text-xs text-terminal-muted">
            <span className="text-terminal-prompt">$</span> cat ~/.contact
          </p>
          <ul className="rounded-md border border-terminal-border bg-terminal-surface p-4 font-mono text-sm">
            {items.map(({ key, value, href }) => (
              <li key={key} className="flex items-baseline gap-3 py-1">
                <span className="text-terminal-prompt">{key}</span>
                <span className="text-terminal-muted">:</span>
                {href ? (
                  <a href={href} className="text-terminal-fg link-underline truncate">
                    {value}
                  </a>
                ) : (
                  <span className="text-terminal-fg truncate">{value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

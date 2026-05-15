import { SectionShell } from "@/components/terminal/section-shell";
import { ContactForm } from "./contact-form";
import { profile } from "@/content/profile";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const items = [
  { Icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  { Icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { Icon: Github, label: "github.com/nurul-islam01", href: profile.socials.github },
  { Icon: Linkedin, label: "linkedin.com/in/nurul-islam01", href: profile.socials.linkedin },
  { Icon: MapPin, label: profile.location, href: null },
];

export function Contact() {
  return (
    <SectionShell id="contact" path="~/contact" cmd="cat README.md" title="Contact">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="font-sans text-base sm:text-lg leading-relaxed text-terminal-fg">
            Got an idea, a role, or a hard engineering problem? I read every message —
            best reached via the form below or at{" "}
            <a className="link-underline" href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
          <p className="mt-3 font-mono text-sm text-terminal-muted">
            <span className="text-terminal-prompt">›</span> typical response time:{" "}
            <span className="text-terminal-fg">within 24 hours</span>
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
        <ul className="space-y-2 font-mono text-sm lg:col-span-2">
          {items.map(({ Icon, label, href }) => {
            const inner = (
              <span className="flex items-center gap-3 rounded-md px-3 py-2 text-terminal-muted">
                <Icon className="h-4 w-4 text-terminal-prompt" />
                <span className="text-terminal-fg">{label}</span>
              </span>
            );
            return (
              <li key={label}>
                {href ? (
                  <a href={href} className="block hover:bg-terminal-surface rounded-md transition-colors">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </SectionShell>
  );
}

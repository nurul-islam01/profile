import { Section } from "@/components/section";
import { ContactForm } from "@/components/sections/contact-form";
import { profile } from "@/content/profile";

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

const details: Array<{ label: string; value: string; href?: string; external?: boolean }> = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { label: "GitHub", value: bare(profile.socials.github), href: profile.socials.github, external: true },
  { label: "LinkedIn", value: bare(profile.socials.linkedin), href: profile.socials.linkedin, external: true },
  { label: "Location", value: profile.location },
];

export function Contact() {
  return (
    <Section name="contact">
      <div className="grid gap-x-12 gap-y-14 xl:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <p className="max-w-[20ch] text-balance text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-tight">
            Got an idea, a role, or a hard engineering problem?
          </p>
          <p className="mt-5 max-w-[52ch] font-serif text-[1.25rem] leading-relaxed text-muted">
            I read every message — best reached via the form below or at{" "}
            <a className="link text-fg" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            .
          </p>
          <p className="mt-2 text-muted">Typical response time: within 24 hours.</p>
          <ContactForm className="mt-10 max-w-[44rem]" />
        </div>

        <dl className="space-y-5 xl:pt-2">
          {details.map((d) => (
            <div key={d.label}>
              <dt className="text-sm text-muted">{d.label}</dt>
              <dd className="mt-0.5 font-medium [overflow-wrap:anywhere]">
                {d.href ? (
                  <a
                    className="link"
                    href={d.href}
                    {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {d.value}
                  </a>
                ) : (
                  d.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

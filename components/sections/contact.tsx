import { ContactForm } from "@/components/sections/contact-form";
import { SplitReveal, FadeUp } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { profile } from "@/content/profile";
import { sections } from "@/lib/sections";

const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

const details: Array<{ label: string; value: string; href?: string; external?: boolean }> = [
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { label: "GitHub", value: bare(profile.socials.github), href: profile.socials.github, external: true },
  { label: "LinkedIn", value: bare(profile.socials.linkedin), href: profile.socials.linkedin, external: true },
  { label: "Location", value: profile.location },
];

export function Contact() {
  const { id } = sections.contact;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="page pb-24 pt-24 sm:pt-32 lg:pb-32 lg:pt-40">
      <SplitReveal
        as="h2"
        type="words"
        id={`${id}-title`}
        className="max-w-[13ch] text-[clamp(2.9rem,8.4vw,8.75rem)] font-extrabold leading-[0.88] tracking-[-0.055em]"
      >
        Got an idea, a role, or a hard engineering problem?
      </SplitReveal>

      <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-24">
        <div className="min-w-0">
          <p className="max-w-[46ch] font-serif text-[clamp(1.25rem,1.8vw,1.6rem)] leading-relaxed text-muted">
            I read every message — best reached via the form below or at{" "}
            <a className="link text-fg" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            .
          </p>
          <p className="mt-3 text-muted">Typical response time: within 24 hours.</p>
          <ContactForm className="mt-12 max-w-[44rem]" />
        </div>

        <div>
          <Magnetic strength={0.18} className="max-w-full">
            <a
              href={`mailto:${profile.email}`}
              className="big-link text-[clamp(1.3rem,1.9vw,1.75rem)] font-bold tracking-tight [overflow-wrap:anywhere]"
            >
              {profile.email}
            </a>
          </Magnetic>
          <FadeUp as="dl" className="mt-12 space-y-6" stagger={0.06}>
            {details.map((d) => (
              <div key={d.label} className="border-t border-line pt-4">
                <dt className="text-[0.95rem] text-muted">{d.label}</dt>
                <dd className="mt-1 text-lg font-medium [overflow-wrap:anywhere]">
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
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

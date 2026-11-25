import Image from "next/image";
import { Section, metaRow } from "@/components/section";
import { profile } from "@/content/profile";

export function About() {
  const facts: Array<{ label: string; value: React.ReactNode }> = [
    { label: "Based in", value: profile.location },
    { label: "Experience", value: "7+ years" },
    { label: "Now", value: `${profile.shortRole}, ${profile.company}` },
    {
      label: "Email",
      value: (
        <a className="link" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      ),
    },
  ];

  return (
    <Section name="about">
      <div className={metaRow}>
        <div className="mb-6 w-36 md:mb-0 md:w-full">
          <Image
            src={profile.photoUrl}
            alt={`Portrait of ${profile.name}`}
            width={768}
            height={960}
            sizes="(min-width: 768px) 10rem, 9rem"
            className="aspect-[4/5] w-full rounded-lg border border-line object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="max-w-[60ch] font-serif text-[1.25rem] leading-[1.6] sm:text-[1.375rem]">{profile.bio}</p>
          <dl className="mt-10 grid max-w-[44rem] gap-x-10 gap-y-6 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="mt-1 font-medium [overflow-wrap:anywhere]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

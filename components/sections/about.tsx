import Image from "next/image";
import { Section } from "@/components/section";
import { FadeUp, MediaReveal, ScrubWords } from "@/components/motion/reveal";
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
      <div className="grid gap-12 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <MediaReveal className="aspect-[4/5] w-48 rounded-xl sm:w-60 lg:w-full">
            <Image
              src={profile.photoUrl}
              alt={`Portrait of ${profile.name}`}
              width={768}
              height={960}
              sizes="(min-width: 1024px) 19rem, 15rem"
              className="h-full w-full object-cover"
            />
          </MediaReveal>
        </div>
        <div className="min-w-0">
          <ScrubWords className="max-w-[34ch] font-serif text-[clamp(1.55rem,2.9vw,2.6rem)] leading-[1.3] tracking-[-0.01em]">
            {profile.bio}
          </ScrubWords>
          <FadeUp as="dl" className="mt-16 grid max-w-[46rem] gap-x-12 gap-y-8 border-t border-line pt-10 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-[0.95rem] text-muted">{f.label}</dt>
                <dd className="mt-1.5 text-xl font-semibold tracking-tight [overflow-wrap:anywhere]">{f.value}</dd>
              </div>
            ))}
          </FadeUp>
        </div>
      </div>
    </Section>
  );
}

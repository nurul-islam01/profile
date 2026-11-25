import { Download } from "lucide-react";
import { WorkIndex } from "@/components/work-index";
import { profile } from "@/content/profile";
import { sections } from "@/lib/sections";

/** Opening screen: who this is, then the live sites, with a sticky preview on desktop. */
export function Showcase() {
  return <WorkIndex intro={<Intro />} />;
}

function Intro() {
  return (
    <div className="animate-rise pb-16 pt-14 sm:pt-20 lg:pb-20 lg:pt-24">
      <h1 className="text-[clamp(3.2rem,9vw,7.25rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
        {profile.name}
      </h1>
      <p className="mt-7 text-xl font-semibold tracking-tight">{profile.role}</p>
      <p className="mt-3 max-w-[30ch] text-balance font-serif text-[1.45rem] leading-[1.35] text-muted">
        {profile.headline}
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <a href={profile.resumeUrl} download className="btn btn-primary">
          <Download aria-hidden="true" className="h-4 w-4" />
          Download CV
        </a>
        <a href={`#${sections.contact.id}`} className="btn btn-quiet">
          Send a message
        </a>
      </div>
    </div>
  );
}

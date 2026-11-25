import { Hero } from "@/components/hero";
import { Work } from "@/components/sections/work";
import { Experience } from "@/components/sections/experience";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { EducationAwards } from "@/components/sections/education-awards";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <Experience />
      <About />
      <Skills />
      <EducationAwards />
      <Contact />
    </>
  );
}

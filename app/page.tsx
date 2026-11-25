import { Showcase } from "@/components/showcase";
import { Experience } from "@/components/sections/experience";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Education } from "@/components/sections/education";
import { Awards } from "@/components/sections/awards";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Showcase />
      <Experience />
      <About />
      <Skills />
      <Education />
      <Awards />
      <Contact />
    </>
  );
}

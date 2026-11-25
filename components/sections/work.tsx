import { Section } from "@/components/section";
import { WorkList } from "@/components/work/work-list";
import { projects } from "@/content/projects";

export function Work() {
  return (
    <Section name="work" aside={`${projects.length} sites`}>
      <WorkList />
    </Section>
  );
}

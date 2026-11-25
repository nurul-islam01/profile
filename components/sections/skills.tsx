import { Section, metaRow } from "@/components/section";
import { skills } from "@/content/skills";
import { cn } from "@/lib/cn";

export function Skills() {
  return (
    <Section name="skills">
      <dl className="divide-y divide-line">
        {skills.map((group, i) => (
          <div key={group.name} className={cn(metaRow, "py-5 first:pt-1 last:pb-0")}>
            <dt className="font-semibold">{group.name}</dt>
            <dd className={cn("max-w-[68ch]", i === 0 ? "text-lg leading-relaxed" : "text-fg/90")}>
              {group.items.join(", ")}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

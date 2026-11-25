import { sections, type SectionKey } from "@/lib/sections";

/**
 * Page section on the shared grid: title in a narrow left column (sticky on
 * desktop), content on the right. Section ids and titles come from lib/sections.
 */
export function Section({ name, children }: { name: SectionKey; children: React.ReactNode }) {
  const { id, title } = sections[name];
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="page">
      <div className="grid gap-x-12 gap-y-8 border-t border-line py-16 sm:py-20 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-24">
        <div>
          <h2
            id={`${id}-title`}
            className="text-2xl font-bold leading-tight tracking-tight lg:sticky lg:top-24"
          >
            {title}
          </h2>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

/** Two-column row inside a section: a narrow meta column (dates, years, a label) and the content. */
export const metaRow = "grid gap-x-10 gap-y-2 md:grid-cols-[10rem_minmax(0,1fr)]";

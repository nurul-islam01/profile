import type { Project } from "@/content/projects";
import { hostOf } from "@/lib/domain";
import { cn } from "@/lib/cn";

/**
 * Typographic stand-in for a site's screenshot: the site's own colours, its
 * address and its name. Sized with container units so it scales like an image.
 */
export function BrandCard({ project, className }: { project: Project; className?: string }) {
  const brand = project.brand;
  if (!brand) return null;
  return (
    <span
      className={cn("brand-card relative block aspect-[1496/801] overflow-hidden", className)}
      style={
        {
          backgroundColor: brand.bg,
          color: brand.fg,
          "--brand-accent": brand.accent,
        } as React.CSSProperties
      }
    >
      <span aria-hidden="true" className="brand-card-glow absolute -inset-[20%]" />
      <span className="absolute left-[5.6cqw] top-[5cqw] text-[2.8cqw] font-medium opacity-80">
        {hostOf(project.url)}
      </span>
      <span
        aria-hidden="true"
        className="absolute right-[5.6cqw] top-[5.2cqw] h-[2.7cqw] w-[2.7cqw] rounded-full"
        style={{ backgroundColor: brand.accent }}
      />
      <span className="absolute bottom-[5cqw] left-[5.3cqw] right-[5.6cqw] text-[12.5cqw] font-extrabold leading-[0.9] tracking-[-0.04em]">
        {project.name}
      </span>
    </span>
  );
}

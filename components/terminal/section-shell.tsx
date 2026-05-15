import { Prompt } from "./prompt";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  path: string;
  cmd: string;
  title: string;
  className?: string;
  children: React.ReactNode;
};

export function SectionShell({ id, path, cmd, title, className, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-24 border-t border-terminal-border py-16 sm:py-24", className)}
    >
      <div className="mx-auto max-w-5xl px-6">
        <header className="mb-10">
          <Prompt path={path} cmd={cmd} />
          <h2
            id={`${id}-heading`}
            className="sr-only"
          >
            {title}
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}

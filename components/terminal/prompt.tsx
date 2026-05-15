import { cn } from "@/lib/cn";

type PromptProps = {
  /** path shown before the `$`, e.g. "~/about" */
  path?: string;
  /** command shown after the `$` */
  cmd?: string;
  /** user@host, defaults to nurul@dev */
  user?: string;
  className?: string;
  /** whether to add an output line below */
  children?: React.ReactNode;
};

export function Prompt({
  path = "~",
  cmd,
  user = "nurul@dev",
  className,
  children,
}: PromptProps) {
  return (
    <div className={cn("font-mono text-sm sm:text-base", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-terminal-accent">{user}</span>
        <span className="text-terminal-muted">:</span>
        <span className="text-terminal-prompt">{path}</span>
        <span className="text-terminal-muted">$</span>
        {cmd ? <span className="text-terminal-fg">{cmd}</span> : null}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

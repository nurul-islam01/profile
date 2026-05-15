import { cn } from "@/lib/cn";

export function WindowChrome({
  title = "nurul@dev: ~",
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("terminal-window", className)}>
      <div className="terminal-titlebar">
        <span className="terminal-dot bg-[#ff5f56]" />
        <span className="terminal-dot bg-[#ffbd2e]" />
        <span className="terminal-dot bg-[#27c93f]" />
        <span className="ml-3 font-mono">{title}</span>
      </div>
      <div className="p-5 sm:p-7 font-mono text-sm sm:text-base">
        {children}
      </div>
    </div>
  );
}

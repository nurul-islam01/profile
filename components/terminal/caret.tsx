import { cn } from "@/lib/cn";

export function Caret({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-[1em] w-[0.55em] translate-y-[2px] bg-current align-baseline animate-caret-blink",
        className,
      )}
    />
  );
}

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-raised hover:text-fg",
        className,
      )}
    >
      {mounted ? (
        isDark ? <Sun aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" /> : <Moon aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" />
      ) : (
        <span className="h-[1.1rem] w-[1.1rem]" />
      )}
    </button>
  );
}

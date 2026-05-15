"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./theme-toggle";
import { CommandPaletteTrigger } from "./command-palette";
import { StatusClock } from "./status-clock";

type NavLink = { href: string; label: string; sectionId?: string };

const links: NavLink[] = [
  { href: "/#about", label: "about", sectionId: "about" },
  { href: "/#experience", label: "experience", sectionId: "experience" },
  { href: "/#skills", label: "skills", sectionId: "skills" },
  { href: "/#projects", label: "projects", sectionId: "projects" },
  { href: "/#contact", label: "contact", sectionId: "contact" },
];

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  // Track which section is currently in view on the home page.
  React.useEffect(() => {
    if (!onHome) {
      setActiveSection(null);
      return;
    }
    const ids = links.map((l) => l.sectionId).filter((x): x is string => Boolean(x));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost visible section as active.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        // Trigger when a section's top hits ~30% from viewport top.
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  function isActive(link: NavLink): boolean {
    if (!onHome) return false;
    return link.sectionId === activeSection;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-terminal-border bg-terminal-bg/80 backdrop-blur supports-[backdrop-filter]:bg-terminal-bg/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-terminal-fg transition-colors hover:text-terminal-prompt"
        >
          <span className="text-terminal-prompt">$</span> {profile.username}.com.bd
        </Link>
        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex items-center gap-1 font-mono text-sm">
            {links.map((l) => {
              const active = isActive(l);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors",
                      active
                        ? "bg-terminal-surface text-terminal-fg"
                        : "text-terminal-muted hover:bg-terminal-surface hover:text-terminal-fg",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "inline-block h-1.5 w-1.5 rounded-full transition-all",
                        active ? "bg-terminal-prompt" : "bg-transparent group-hover:bg-terminal-border",
                      )}
                    />
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <StatusClock />
          <CommandPaletteTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Menu, Search } from "lucide-react";
import { profile } from "@/content/profile";
import { sections, navOrder } from "@/lib/sections";
import { hostOf, splitHost } from "@/lib/domain";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme-toggle";
import { openCommandPalette } from "@/components/command-palette";

const [brand, brandSuffix] = splitHost(hostOf(profile.socials.website));

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = React.useState<string | null>(null);
  const [isMac, setIsMac] = React.useState(true);
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);

  // Transparent over the hero; tucks away while scrolling down, returns on the way up.
  React.useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.6);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track the section crossing the upper third of the viewport.
  React.useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header
      data-scrolled={scrolled}
      data-hidden={hidden}
      onFocusCapture={() => setHidden(false)}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[transform,background-color,border-color] duration-500 ease-out data-[hidden=true]:-translate-y-full data-[scrolled=true]:border-line/60 data-[scrolled=true]:bg-bg/75 data-[scrolled=true]:backdrop-blur-md"
    >
      <div className="page flex h-16 items-center gap-6">
        <Link href="/" className="shrink-0 text-[1.0625rem] font-bold tracking-tight">
          {brand}
          <span className="font-normal">{brandSuffix}</span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {navOrder.map((key) => {
              const { id, title } = sections[key];
              const isActive = active === id;
              return (
                <li key={id}>
                  <Link
                    href={`/#${id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative inline-flex h-9 items-center rounded-md px-3 text-[0.95rem] transition-colors",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {title}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-accent transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-haspopup="dialog"
            aria-keyshortcuts="Meta+K Control+K"
            className="inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-[0.95rem] text-muted transition-colors hover:bg-raised hover:text-fg"
          >
            <Menu aria-hidden="true" className="h-[1.1rem] w-[1.1rem] lg:hidden" />
            <Search aria-hidden="true" className="hidden h-4 w-4 lg:block" />
            <span className="lg:hidden">Menu</span>
            <span className="hidden lg:inline">Search</span>
            <kbd
              aria-hidden="true"
              className="hidden rounded border border-line px-1.5 py-px font-sans text-xs text-muted lg:inline"
            >
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>
          <ThemeToggle />
          <a href={profile.resumeUrl} download className="btn btn-quiet ml-1.5 h-9 px-3 text-sm">
            <Download aria-hidden="true" className="h-4 w-4" />
            <span className="sm:hidden">CV</span>
            <span className="hidden sm:inline">Download CV</span>
          </a>
        </div>
      </div>
    </header>
  );
}

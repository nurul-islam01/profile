"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  Download,
  Github,
  Hash,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { sections, pageOrder } from "@/lib/sections";
import { hostOf } from "@/lib/domain";
import { cn } from "@/lib/cn";

type GroupKey = "navigate" | "work" | "links" | "settings";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: GroupKey;
  keywords?: string;
  icon: LucideIcon;
  run: () => void;
};

const GROUPS: Array<{ key: GroupKey; label: string }> = [
  { key: "navigate", label: "Go to section" },
  { key: "work", label: "Open a site" },
  { key: "links", label: "Links" },
  { key: "settings", label: "Settings" },
];

const OPEN_EVENT = "command-palette:open";

export function openCommandPalette() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CommandPalette() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const baseId = React.useId();

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setHighlight(0);
    // Give focus back to whatever opened the palette.
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, []);

  const openPalette = React.useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const actions = React.useMemo<Action[]>(() => {
    const go = (id: string) => () => {
      close();
      router.push(`/#${id}`);
    };
    const openTab = (href: string) => () => {
      close();
      window.open(href, "_blank", "noopener,noreferrer");
    };
    const isDark = resolvedTheme !== "light";

    return [
      ...pageOrder.map<Action>((key) => ({
        id: `go-${key}`,
        label: sections[key].title,
        group: "navigate",
        icon: Hash,
        run: go(sections[key].id),
      })),
      ...projects
        .filter((p) => p.featured)
        .map<Action>((p) => ({
          id: `site-${p.slug}`,
          label: p.name,
          hint: hostOf(p.url),
          group: "work",
          keywords: `${p.org} ${p.tagline}`,
          icon: ArrowUpRight,
          run: openTab(p.url),
        })),
      {
        id: "github",
        label: "GitHub",
        hint: hostOf(profile.socials.github) + new URL(profile.socials.github).pathname,
        group: "links",
        icon: Github,
        run: openTab(profile.socials.github),
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: hostOf(profile.socials.linkedin) + new URL(profile.socials.linkedin).pathname,
        group: "links",
        icon: Linkedin,
        run: openTab(profile.socials.linkedin),
      },
      {
        id: "email",
        label: "Email",
        hint: profile.email,
        group: "links",
        keywords: "mail contact",
        icon: Mail,
        run: () => {
          close();
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: "cv",
        label: "Download CV",
        hint: "PDF",
        group: "links",
        keywords: "resume résumé pdf",
        icon: Download,
        run: () => {
          close();
          const a = document.createElement("a");
          a.href = profile.resumeUrl;
          a.download = "";
          a.click();
        },
      },
      {
        id: "theme",
        label: isDark ? "Switch to light theme" : "Switch to dark theme",
        group: "settings",
        keywords: "theme dark light mode appearance",
        icon: isDark ? Sun : Moon,
        run: () => {
          setTheme(isDark ? "light" : "dark");
          close();
        },
      },
    ];
  }, [close, router, resolvedTheme, setTheme]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => {
      const hay = `${a.label} ${a.hint ?? ""} ${a.keywords ?? ""}`.toLowerCase();
      return q.split(/\s+/).every((t) => hay.includes(t));
    });
  }, [actions, query]);

  // Grouped in display order; the flat order drives keyboard movement.
  const grouped = React.useMemo(
    () =>
      GROUPS.map((g) => ({ ...g, items: filtered.filter((a) => a.group === g.key) })).filter(
        (g) => g.items.length > 0,
      ),
    [filtered],
  );
  const flat = React.useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  React.useEffect(() => setHighlight(0), [query]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openPalette();
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, openPalette);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, openPalette);
    };
  }, [open, close, openPalette]);

  React.useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${highlight}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlight((h) => (flat.length ? (h + 1) % flat.length : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlight((h) => (flat.length ? (h - 1 + flat.length) % flat.length : 0));
        break;
      case "Home":
        e.preventDefault();
        setHighlight(0);
        break;
      case "End":
        e.preventDefault();
        setHighlight(Math.max(flat.length - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        flat[highlight]?.run();
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        // Results are reached with the arrow keys; keep focus inside the dialog.
        e.preventDefault();
        break;
    }
  }

  if (!open) return null;

  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;
  let cursor = 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <div aria-hidden="true" onClick={close} className="absolute inset-0 bg-bg/70 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line bg-raised shadow-[0_40px_100px_-30px_rgb(0_0_0/0.6)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={flat.length ? optionId(highlight) : undefined}
            aria-label="Search sections, sites and links"
            placeholder="Search sections, sites and links"
            autoComplete="off"
            spellCheck={false}
            className="h-14 min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-muted"
          />
          <kbd className="shrink-0 rounded border border-line px-1.5 py-px font-sans text-xs text-muted">Esc</kbd>
        </div>

        <div ref={listRef} id={listId} role="listbox" aria-label="Results" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
          {grouped.map((g) => (
            <div key={g.key} role="group" aria-labelledby={`${baseId}-${g.key}`} className="pb-1">
              <div id={`${baseId}-${g.key}`} className="px-3 pb-1 pt-2 text-xs font-medium text-muted">
                {g.label}
              </div>
              {g.items.map((a) => {
                const idx = cursor++;
                const isActive = idx === highlight;
                const Icon = a.icon;
                return (
                  <div
                    key={a.id}
                    id={optionId(idx)}
                    role="option"
                    aria-selected={isActive}
                    data-idx={idx}
                    onMouseMove={() => setHighlight(idx)}
                    onClick={a.run}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[0.95rem]",
                      isActive ? "bg-bg text-fg" : "text-fg/90",
                    )}
                  >
                    <Icon aria-hidden="true" className={cn("h-4 w-4 shrink-0", isActive ? "text-accent" : "text-muted")} />
                    <span className="truncate">{a.label}</span>
                    {a.hint ? <span className="ml-auto truncate pl-4 text-sm text-muted">{a.hint}</span> : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {flat.length === 0 ? (
          <p role="status" className="px-4 pb-8 pt-4 text-center text-muted">
            Nothing matches “{query}”.
          </p>
        ) : null}
      </div>
    </div>
  );
}

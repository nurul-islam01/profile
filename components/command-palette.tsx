"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Home,
  User,
  Briefcase,
  Code2,
  FolderGit2,
  Mail,
  FileText,
  Github,
  Linkedin,
  Sun,
  Moon,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: "navigate" | "social" | "settings";
  keywords?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
};

const OPEN_EVENT = "command-palette:open";

export function openCommandPalette() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CommandPaletteTrigger() {
  const [isMac, setIsMac] = React.useState(true);
  React.useEffect(() => {
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      aria-label="Open command palette"
      className="hidden items-center gap-2 rounded-md border border-terminal-border bg-terminal-surface px-2.5 py-1.5 font-mono text-xs text-terminal-muted transition-colors hover:border-terminal-prompt hover:text-terminal-fg sm:inline-flex"
    >
      <Search className="h-3.5 w-3.5" aria-hidden />
      <span>search</span>
      <kbd className="ml-2 rounded border border-terminal-border bg-terminal-bg px-1.5 py-0.5 text-[10px] text-terminal-muted">
        {isMac ? "⌘" : "Ctrl"} K
      </kbd>
    </button>
  );
}

export function CommandPalette() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setHighlight(0);
  }, []);

  const go = React.useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  const openHref = React.useCallback(
    (href: string) => {
      close();
      window.open(href, "_blank", "noopener,noreferrer");
    },
    [close],
  );

  const actions = React.useMemo<Action[]>(
    () => [
      { id: "home", label: "Home", group: "navigate", icon: Home, run: () => go("/") },
      { id: "about", label: "About", group: "navigate", icon: User, run: () => go("/#about") },
      { id: "experience", label: "Experience", group: "navigate", icon: Briefcase, run: () => go("/#experience") },
      { id: "skills", label: "Skills", group: "navigate", icon: Code2, run: () => go("/#skills") },
      { id: "projects", label: "Projects", group: "navigate", icon: FolderGit2, run: () => go("/#projects") },
      { id: "contact", label: "Contact", group: "navigate", icon: Mail, run: () => go("/#contact") },
      {
        id: "github",
        label: "GitHub",
        hint: profile.socials.github,
        group: "social",
        icon: Github,
        run: () => openHref(profile.socials.github),
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: profile.socials.linkedin,
        group: "social",
        icon: Linkedin,
        run: () => openHref(profile.socials.linkedin),
      },
      {
        id: "email",
        label: "Email",
        hint: profile.email,
        group: "social",
        icon: Mail,
        run: () => openHref(`mailto:${profile.email}`),
      },
      {
        id: "resume",
        label: "Download résumé (PDF)",
        hint: profile.resumeUrl,
        group: "social",
        icon: FileText,
        run: () => openHref(profile.resumeUrl),
      },
      {
        id: "theme",
        label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        group: "settings",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        keywords: "theme dark light mode toggle",
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          close();
        },
      },
    ],
    [go, openHref, resolvedTheme, setTheme, close],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => {
      const hay = `${a.label} ${a.hint ?? ""} ${a.keywords ?? ""} ${a.group}`.toLowerCase();
      return q.split(/\s+/).every((tok) => hay.includes(tok));
    });
  }, [actions, query]);

  // Reset highlight when filter changes.
  React.useEffect(() => {
    setHighlight(0);
  }, [query]);

  // Global open/close listeners.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    }
    function onOpenEvt() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpenEvt);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpenEvt);
    };
  }, [open, close]);

  // Focus input when opening.
  React.useEffect(() => {
    if (open) {
      // Slight delay to let the modal mount before focusing.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Lock body scroll while open.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[highlight]?.run();
    }
  }

  // Keep highlighted item in view when navigating with keys.
  React.useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-idx="${highlight}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  if (!open) return null;

  // Group filtered actions for rendering.
  const groups: Array<{ key: Action["group"]; label: string }> = [
    { key: "navigate", label: "Navigate" },
    { key: "social", label: "Links" },
    { key: "settings", label: "Settings" },
  ];

  let cursor = 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
    >
      <button
        type="button"
        aria-label="Close command palette"
        onClick={close}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-lg border border-terminal-border bg-terminal-bg shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-terminal-border px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" aria-hidden />
          <span className="ml-2 font-mono text-[11px] text-terminal-muted">
            {profile.username}@dev: ~/search
          </span>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-b border-terminal-border px-4 py-3 font-mono text-sm">
          <span className="text-terminal-prompt">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Type a command — about, projects, github…"
            className="flex-1 bg-transparent text-terminal-fg outline-none placeholder:text-terminal-muted"
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="font-mono text-[10px] text-terminal-muted hover:text-terminal-fg"
            >
              clear
            </button>
          )}
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center font-mono text-sm text-terminal-muted">
              <span className="text-terminal-keyword">bash:</span> {query}: command not found
            </div>
          ) : (
            groups.map((g) => {
              const items = filtered.filter((a) => a.group === g.key);
              if (items.length === 0) return null;
              return (
                <div key={g.key} className="px-2 pb-1">
                  <div className="px-3 pt-2 font-mono text-[10px] uppercase tracking-wider text-terminal-muted">
                    {g.label}
                  </div>
                  <ul className="mt-1">
                    {items.map((a) => {
                      const idx = cursor++;
                      const active = idx === highlight;
                      const Icon = a.icon;
                      return (
                        <li key={a.id}>
                          <button
                            type="button"
                            data-idx={idx}
                            onMouseEnter={() => setHighlight(idx)}
                            onClick={a.run}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left font-mono text-sm transition-colors",
                              active
                                ? "bg-terminal-surface text-terminal-fg"
                                : "text-terminal-muted hover:bg-terminal-surface/60",
                            )}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0 text-terminal-prompt" aria-hidden />
                            <span className="truncate text-terminal-fg">{a.label}</span>
                            {a.hint && (
                              <span className="ml-auto truncate text-[11px] text-terminal-muted">{a.hint}</span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-terminal-border px-4 py-2 font-mono text-[10px] text-terminal-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ArrowUp className="h-3 w-3" aria-hidden />
              <ArrowDown className="h-3 w-3" aria-hidden />
              navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" aria-hidden />
              select
            </span>
            <span>esc · close</span>
          </div>
          <span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}

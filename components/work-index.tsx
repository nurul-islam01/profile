"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { sections } from "@/lib/sections";
import { hostOf, splitHost } from "@/lib/domain";
import { cn } from "@/lib/cn";

const ORGS: Project["org"][] = ["Navana Group", "Prothom Alo"];
const FIRST = projects[0]!;

/**
 * The opening screen: intro on the left, the index of live sites below it,
 * and (on desktop) a sticky browser-frame preview of whichever domain is
 * pointed at or focused. The intro is rendered on the server and passed in.
 */
export function WorkIndex({ intro }: { intro: React.ReactNode }) {
  const [active, setActive] = React.useState(FIRST.slug);
  const [loadAll, setLoadAll] = React.useState(false);

  // Only the first preview loads with the page. The rest load once the
  // browser is idle, or as soon as someone reaches for the list.
  React.useEffect(() => {
    if (loadAll) return;
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setLoadAll(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(() => setLoadAll(true), 2000);
    return () => clearTimeout(t);
  }, [loadAll]);

  const current = projects.find((p) => p.slug === active) ?? FIRST;
  const { id, title } = sections.work;

  return (
    <div className="page">
      <div className="grid gap-x-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,31rem)]">
        <div className="min-w-0">
          {intro}

          <section
            id={id}
            aria-labelledby={`${id}-title`}
            className="pb-20 lg:pb-28"
            onPointerEnter={() => setLoadAll(true)}
            onFocusCapture={() => setLoadAll(true)}
          >
            <h2 id={`${id}-title`} className="text-2xl font-bold leading-tight tracking-tight">
              {title}
            </h2>
            <p className="mt-2 hidden text-sm text-muted lg:block">
              Point at a domain to preview it. Each one opens the live site in a new tab.
            </p>

            <div className="mt-8 space-y-14">
              {ORGS.map((org) => {
                const items = projects.filter((p) => p.org === org);
                const featured = items.filter((p) => p.featured);
                const rest = items.filter((p) => !p.featured);
                return (
                  <div key={org}>
                    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                      <h3 className="font-semibold">{org}</h3>
                      <p className="tnum text-sm text-muted">{items.length} sites</p>
                    </div>

                    <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-4 lg:grid-cols-1 lg:gap-y-0">
                      {featured.map((p) => (
                        <Row
                          key={p.slug}
                          project={p}
                          size="large"
                          active={p.slug === active}
                          onActivate={() => setActive(p.slug)}
                        />
                      ))}
                    </ul>

                    {rest.length > 0 ? (
                      <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:mt-3 lg:grid-cols-1 lg:gap-y-0 xl:grid-cols-2">
                        {rest.map((p) => (
                          <Row
                            key={p.slug}
                            project={p}
                            size="small"
                            active={p.slug === active}
                            onActivate={() => setActive(p.slug)}
                          />
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Desktop preview. Decorative: every fact in it is also in the list. */}
        <aside aria-hidden="true" className="hidden pt-24 lg:block">
          <div className="sticky top-24 animate-reveal">
            <div className="overflow-hidden rounded-xl border border-line bg-raised shadow-[0_28px_56px_-36px_rgb(17_26_44/0.35)] dark:shadow-none">
              <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                </span>
                <span className="truncate text-sm text-muted">{hostOf(current.url)}</span>
              </div>
              <div className="relative aspect-[1496/801] bg-bg">
                {projects.map((p, i) =>
                  i === 0 || loadAll ? (
                    <Image
                      key={p.slug}
                      src={p.image}
                      alt=""
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1280px) 31rem, (min-width: 1024px) 27rem, 1px"
                      className={cn(
                        "object-cover object-top transition-opacity duration-300",
                        p.slug === active ? "opacity-100" : "opacity-0",
                      )}
                    />
                  ) : null,
                )}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-lg font-semibold leading-snug">{current.name}</p>
              <p className="mt-1 font-serif text-[1.125rem] leading-snug text-muted">{current.tagline}</p>
              <p className="mt-4 text-sm font-medium">{current.role}</p>
              <p className="mt-1 text-sm text-muted">{current.stack.join(", ")}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  project: p,
  size,
  active,
  onActivate,
}: {
  project: Project;
  size: "large" | "small";
  active: boolean;
  onActivate: () => void;
}) {
  const [label, suffix] = splitHost(hostOf(p.url));
  const large = size === "large";

  return (
    <li className="min-w-0">
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        data-active={active}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        className={cn("group relative block rounded-sm", large ? "lg:py-1.5" : "lg:py-1")}
      >
        {large ? (
          <span className="relative mb-4 block aspect-[1496/801] overflow-hidden rounded-lg border border-line bg-raised lg:hidden">
            <Image
              src={p.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 1px, (min-width: 640px) 45vw, 92vw"
              className="object-cover object-top"
            />
          </span>
        ) : null}

        {/* "You are here" marker in the gutter, desktop only */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute -left-5 top-1/2 hidden w-1 -translate-y-1/2 rounded-full bg-accent opacity-0 transition-opacity lg:block",
            "group-data-[active=true]:opacity-100",
            large ? "h-7" : "h-4",
          )}
        />

        <span
          className={cn(
            "flex items-center gap-2 font-bold tracking-tight transition-colors [overflow-wrap:anywhere]",
            large
              ? "text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[1.15] lg:text-fg/50"
              : "text-[1.0625rem] leading-snug lg:text-muted",
            "lg:group-hover:text-fg lg:group-data-[active=true]:text-fg",
          )}
        >
          <span className="min-w-0">
            {withBreaks(label)}
            <span className="font-normal">{suffix}</span>
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className={cn(
              "shrink-0 text-muted transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100",
              large ? "h-[0.6em] w-[0.6em]" : "h-4 w-4",
            )}
          />
        </span>

        <span className="mt-1 block text-[0.95rem] leading-snug text-muted lg:sr-only">{p.tagline}</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </li>
  );
}

/** Lets long hosts wrap after a dot or hyphen ("trust.|prothomalo") instead of mid-word. */
function withBreaks(label: string) {
  // split with a capture group rather than a lookbehind: older Safari can't parse lookbehinds
  const out: React.ReactNode[] = [];
  label.split(/([.-])/).forEach((part, i) => {
    out.push(part);
    if (part === "." || part === "-") out.push(<wbr key={i} />);
  });
  return out;
}

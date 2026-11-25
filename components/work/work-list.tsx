"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { hostOf } from "@/lib/domain";
import { hasFinePointer, prefersReducedMotion, whenAppReady } from "@/lib/motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { BrandCard } from "@/components/work/brand-card";
import { HoverMedia } from "@/components/work/hover-media";

const ORGS: Project["org"][] = ["Navana Group", "Prothom Alo"];

/**
 * Every site, grouped by company. With a mouse, hovering a row floats that
 * site's screenshot (or brand card) beside the pointer in WebGL. On touch, with
 * reduced motion, or without WebGL, featured rows show their image inline.
 */
export function WorkList() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const media = React.useRef<HoverMedia | null>(null);
  // "native": CSS decides (inline images on touch and reduced motion, hidden on
  // mouse devices). "gl": WebGL previews running. "fallback": mouse device
  // without WebGL, so show the inline images after all.
  const [mode, setMode] = React.useState<"native" | "gl" | "fallback">("native");

  React.useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion() || !canvasRef.current) return;
    let hm: HoverMedia;
    try {
      hm = new HoverMedia(canvasRef.current, projects, getComputedStyle(document.body).fontFamily);
    } catch (err) {
      console.warn("[work] WebGL previews unavailable, showing images inline", err);
      setMode("fallback");
      return;
    }
    media.current = hm;
    setMode("gl");
    let idle = 0;
    const stop = whenAppReady(() => {
      idle = window.setTimeout(() => hm.preload(), 1200);
    });
    return () => {
      stop();
      window.clearTimeout(idle);
      hm.destroy();
      media.current = null;
    };
  }, []);

  // Rows rise in as each group scrolls into view.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      rootRef.current?.querySelectorAll<HTMLElement>("[data-row-group]").forEach((group) => {
        gsap.from(group.querySelectorAll("[data-row-rise]"), {
          yPercent: 105,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: group, start: "top 85%", once: true },
        });
      });
    },
    { scope: rootRef },
  );

  const onListMove = (e: React.PointerEvent) => media.current?.moveTo(e.clientX, e.clientY);
  const onListLeave = () => media.current?.hide();

  return (
    <div ref={rootRef} className="work-list" data-media={mode}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />

      <div className="space-y-20 lg:space-y-28" onPointerMove={onListMove} onPointerLeave={onListLeave}>
        {ORGS.map((org) => {
          const items = projects.filter((p) => p.org === org);
          return (
            <div key={org} data-row-group>
              <div className="mb-4 flex items-baseline justify-between gap-6 text-[0.95rem]">
                <h3 className="font-semibold">{org}</h3>
                <p className="tnum text-muted">{items.length} sites</p>
              </div>
              <ul className="work-rows">
                {items.map((p) => {
                  const i = projects.indexOf(p);
                  return (
                    <Row
                      key={p.slug}
                      project={p}
                      onEnter={(e) => {
                        media.current?.moveTo(e.clientX, e.clientY, true);
                        media.current?.show(i);
                      }}
                      onFocus={(el) => {
                        const r = el.getBoundingClientRect();
                        media.current?.placeAt(r.right - Math.min(window.innerWidth * 0.12, 210), r.top + r.height / 2, true);
                        media.current?.show(i);
                      }}
                      onBlur={(next) => {
                        if (!next || !rootRef.current?.contains(next)) media.current?.hide();
                      }}
                    />
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({
  project: p,
  onEnter,
  onFocus,
  onBlur,
}: {
  project: Project;
  onEnter: (e: React.PointerEvent) => void;
  onFocus: (el: HTMLElement) => void;
  onBlur: (next: Element | null) => void;
}) {
  return (
    <li className="work-row">
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") onEnter(e);
        }}
        onFocus={(e) => onFocus(e.currentTarget)}
        onBlur={(e) => onBlur(e.relatedTarget as Element | null)}
        className="group block py-6 lg:py-8"
      >
        {p.featured ? (
          <span className="row-media mb-6 block overflow-hidden rounded-lg">
            {p.image ? (
              <span className="relative block aspect-[1496/801] bg-raised">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 92vw"
                  className="object-cover object-top"
                />
              </span>
            ) : (
              <BrandCard project={p} />
            )}
          </span>
        ) : null}

        <span className="block overflow-hidden">
          <span
            data-row-rise
            className="row-inner grid items-end gap-x-10 gap-y-3 md:grid-cols-[minmax(0,1fr)_auto]"
          >
            <span className="row-name flex items-center gap-[0.25em] text-[clamp(2rem,5.2vw,5rem)] font-bold leading-[1] tracking-[-0.045em]">
              <span className="min-w-0">{p.name}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="row-arrow h-[0.5em] w-[0.5em] shrink-0 stroke-[2.25]"
              />
            </span>
            <span className="row-meta block text-[0.95rem] leading-snug md:pb-[0.35em] md:text-right">
              <span className="block font-medium">{hostOf(p.url)}</span>
              <span className="row-sub block">{p.role}</span>
            </span>
          </span>
        </span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </li>
  );
}

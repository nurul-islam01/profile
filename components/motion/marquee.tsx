"use client";

import * as React from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Endless row of words. Drifts on its own, speeds up with scroll velocity and
 * turns with the scroll direction. Decorative: callers provide the same
 * content to assistive tech elsewhere.
 */
export function Marquee({
  items,
  reverse = false,
  className,
  itemClassName,
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const track = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr || prefersReducedMotion()) return;

    const base = reverse ? -1 : 1;
    let x = reverse ? -50 : 0;
    let dir = 1;
    let boost = 0;
    let visible = false;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (visible = self.isActive),
      onUpdate: (self) => {
        const v = self.getVelocity();
        dir = v < 0 ? -1 : 1;
        boost = Math.min(Math.abs(v) / 220, 9);
      },
    });

    const tick = (_time: number, deltaMs: number) => {
      if (!visible) return;
      boost *= 0.93;
      x -= (0.012 + boost * 0.018) * base * dir * (deltaMs / 16.67);
      if (x <= -50) x += 50;
      if (x > 0) x -= 50;
      tr.style.transform = `translate3d(${x}%, 0, 0)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, [reverse]);

  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={`${key}-${item}`} className={cn("flex items-center whitespace-nowrap", itemClassName)}>
          {item}
          <span aria-hidden="true" className="mx-[0.45em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-accent" />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} aria-hidden="true" className={cn("overflow-hidden", className)}>
      <div ref={track} className="flex w-max will-change-transform">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

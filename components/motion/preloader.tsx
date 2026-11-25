"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";
import { HERO_GL_EVENT, markAppReady } from "@/lib/motion";

const MIN_MS = 900; // never flash by faster than this
const MAX_MS = 2600; // never hold anyone longer than this

/**
 * First-visit loader. The count follows real work (fonts, hero shader) and is
 * capped by time, then the panel wipes up and the hero entrance starts.
 * Skipped on repeat visits in the same session and for reduced motion
 * (decided before paint by the inline script in layout.tsx).
 */
export function Preloader() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const numRef = React.useRef<HTMLSpanElement>(null);
  const barRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    const html = document.documentElement;
    if (!root || html.classList.contains("no-preload")) {
      html.classList.remove("is-loading");
      markAppReady();
      return;
    }
    root.style.display = "block";
    window.__lenis?.stop();

    let target = 0;
    let shown = 0;
    let raf = 0;
    let leaving = false;
    const start = performance.now();

    const signals: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, 1600);
        window.addEventListener(
          HERO_GL_EVENT,
          () => {
            window.clearTimeout(t);
            resolve();
          },
          { once: true },
        );
      }),
    ];
    let settled = 0;
    const bump = () => {
      settled += 1;
      target = settled / signals.length;
    };
    signals.forEach((p) => p.then(bump, bump));

    const leave = () => {
      if (leaving) return;
      leaving = true;
      try {
        sessionStorage.setItem("ni-seen", "1");
      } catch {
        /* private mode */
      }
      gsap
        .timeline({
          onComplete: () => {
            root.style.display = "none";
          },
        })
        .to(numRef.current, { yPercent: -105, duration: 0.55, ease: "expo.in" })
        .add(() => {
          html.classList.remove("is-loading");
          window.__lenis?.start();
          markAppReady();
        })
        .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.05, ease: "expo.inOut" }, "<-0.05");
    };

    const loop = (now: number) => {
      const elapsed = now - start;
      const goal = elapsed > MAX_MS ? 1 : Math.min(target, elapsed / MIN_MS, 1);
      shown += (goal - shown) * 0.12;
      if (goal === 1 && shown > 0.995) shown = 1;
      if (numRef.current) numRef.current.textContent = String(Math.round(shown * 100));
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown})`;
      if (shown === 1) leave();
      else raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div className="page flex h-full items-end pb-[6vh]">
        <span className="block overflow-hidden pb-[0.06em]">
          <span
            ref={numRef}
            className="tnum block text-[clamp(6rem,24vw,22rem)] font-extrabold leading-[0.8] tracking-[-0.06em]"
          >
            0
          </span>
        </span>
      </div>
      <span ref={barRef} className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent" />
    </div>
  );
}

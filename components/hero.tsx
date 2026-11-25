"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion, whenAppReady } from "@/lib/motion";
import { profile } from "@/content/profile";
import { sections } from "@/lib/sections";
import { FlowField } from "@/components/webgl/flow-field";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/cn";

const REST = 560; // weight of a letter far from the cursor
const PEAK = 900; // weight of the letter under the cursor

/**
 * Opening screen: the name set huge over a slow WebGL current. Letters rise in
 * once the loader clears, then thicken as the cursor passes near them.
 */
export function Hero() {
  const nameRef = React.useRef<HTMLHeadingElement>(null);
  const rootRef = React.useRef<HTMLElement>(null);
  const words = profile.name.split(" ");

  React.useEffect(() => {
    const root = rootRef.current;
    const name = nameRef.current;
    if (!root || !name) return;
    const chars = Array.from(name.querySelectorAll<HTMLElement>("[data-k]"));
    const reveal = Array.from(root.querySelectorAll<HTMLElement>("[data-hero-reveal]"));
    const reduced = prefersReducedMotion();

    if (reduced) {
      chars.forEach((c) => (c.style.fontWeight = String(REST + 120)));
      return;
    }

    const weights = chars.map(() => PEAK);
    const targets = chars.map(() => PEAK);
    let centers: { x: number; y: number }[] = [];
    let radius = 300;
    let pointer = { x: -9999, y: -9999 };
    let interactive = false;
    let raf = 0;

    const measure = () => {
      const fontSize = parseFloat(getComputedStyle(name).fontSize) || 200;
      radius = Math.min(Math.max(fontSize * 1.5, 220), 560);
      centers = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY };
      });
    };

    const frame = () => {
      let moving = false;
      chars.forEach((c, i) => {
        if (interactive) {
          const ctr = centers[i];
          let t = REST;
          if (ctr) {
            const dx = pointer.x - (ctr.x - window.scrollX);
            const dy = pointer.y - (ctr.y - window.scrollY);
            const k = Math.max(0, 1 - Math.hypot(dx, dy) / radius);
            t = REST + (PEAK - REST) * k * k;
          }
          targets[i] = t;
        }
        const w = weights[i]! + (targets[i]! - weights[i]!) * 0.16;
        if (Math.abs(w - weights[i]!) > 0.4) moving = true;
        weights[i] = w;
        c.style.fontWeight = w.toFixed(1);
      });
      raf = moving ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      kick();
    };
    const onLeave = () => {
      pointer = { x: -9999, y: -9999 };
      kick();
    };

    // Start states (the CSS pre-hide in globals.css matches these, so nothing flashes).
    // y: 0 stops GSAP from adopting the CSS pre-hide translate as a pixel offset.
    gsap.set(chars, { y: 0, yPercent: 118 });
    // Without the loader the supporting copy is already on screen; leave it be.
    const withLoader = !document.documentElement.classList.contains("no-preload");
    if (withLoader) gsap.set(reveal, { autoAlpha: 0, y: 28 });
    chars.forEach((c) => (c.style.fontWeight = String(PEAK)));

    const stop = whenAppReady(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          measure();
          if (hasFinePointer()) {
            interactive = true;
            window.addEventListener("pointermove", onMove, { passive: true });
            root.addEventListener("pointerleave", onLeave);
          }
        },
      });
      tl.to(chars, { yPercent: 0, duration: 1.35, ease: "expo.out", stagger: 0.045 }, 0.05);
      // Weights relax from heavy to resting as each letter lands.
      chars.forEach((_, i) => {
        tl.to({}, { duration: 0.9, onStart: () => (targets[i] = REST), onUpdate: kick }, 0.35 + i * 0.045);
      });
      if (withLoader) tl.to(reveal, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.45);
    });

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      <FlowField className="absolute inset-0 -z-10 h-full w-full" />

      <div className="page flex flex-1 flex-col pb-8 pt-24 sm:pb-10 lg:pt-28">
        <div className="flex items-start justify-between gap-6 text-[0.85rem] sm:text-[0.95rem]">
          <p data-hero-reveal className="font-medium">
            {profile.role}
          </p>
          <p data-hero-reveal className="text-right text-muted">
            {profile.location}
          </p>
        </div>

        <h1
          ref={nameRef}
          id="hero-title"
          className="hero-name my-auto py-8 text-[min(24vw,34vh)] uppercase leading-[0.8] tracking-[-0.05em] sm:text-[min(21vw,34vh)]"
        >
          <span className="sr-only">{profile.name}</span>
          <span aria-hidden="true" className="block">
            {words.map((word, wi) => (
              <span
                key={word}
                className={cn("block overflow-hidden pb-[0.05em] pt-[0.03em]", wi % 2 === 1 && "text-right")}
              >
                <span className="block whitespace-nowrap">
                  {word.split("").map((ch, i) => (
                    <span key={`${word}-${i}`} data-k className="kchar inline-block">
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        </h1>

        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <p
            data-hero-reveal
            className="max-w-[28ch] text-balance font-serif text-[clamp(1.3rem,2.1vw,1.85rem)] leading-[1.3] text-muted"
          >
            {profile.headline}
          </p>
          <div data-hero-reveal className="flex flex-wrap gap-3">
            <Magnetic>
              <a href={profile.resumeUrl} download className="btn btn-primary h-12 px-6">
                <Download aria-hidden="true" className="h-4 w-4" />
                Download CV
              </a>
            </Magnetic>
            <Magnetic>
              <a href={`#${sections.contact.id}`} className="btn btn-quiet h-12 px-6 backdrop-blur-sm">
                Send a message
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

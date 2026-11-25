"use client";

import * as React from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span" | "blockquote";

/**
 * Text that rises into place line by line (or word/char) through a mask when
 * it scrolls into view. SplitText keeps the original text available to screen
 * readers and re-splits on resize and font load.
 */
export function SplitReveal({
  as = "div",
  type = "lines",
  className,
  children,
  id,
  delay = 0,
  start = "top 88%",
}: {
  as?: Tag;
  type?: "lines" | "words" | "chars";
  className?: string;
  children: React.ReactNode;
  id?: string;
  delay?: number;
  start?: string;
}) {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const split = SplitText.create(el, {
        type: type === "chars" ? "words,chars" : type === "words" ? "words" : "lines",
        mask: type,
        autoSplit: true,
        onSplit(self) {
          const targets = type === "chars" ? self.chars : type === "words" ? self.words : self.lines;
          return gsap.from(targets, {
            yPercent: 120,
            duration: type === "lines" ? 1.1 : 1.2,
            ease: "expo.out",
            stagger: type === "chars" ? 0.024 : type === "words" ? 0.045 : 0.09,
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  const Component = as as React.ElementType;
  return (
    <Component ref={ref} id={id} className={className}>
      {children}
    </Component>
  );
}

/**
 * Long text whose words light up as it scrolls through the viewport. The
 * animated copy is hidden from assistive tech; a plain copy is read instead.
 */
export function ScrubWords({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      // Animates a 0→1 custom property rather than opacity: the CSS mixes it
      // between the faint and full text colours, so every state stays legible
      // and follows theme changes.
      const split = SplitText.create(el, {
        type: "words",
        aria: "none",
        wordsClass: "scrub-word",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { "--p": 0 },
            {
              "--p": 1,
              ease: "none",
              stagger: 0.12,
              scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 55%", scrub: 0.6 },
            },
          );
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <>
      <p className="sr-only">{children}</p>
      <p ref={ref} aria-hidden="true" className={className}>
        {children}
      </p>
    </>
  );
}

/** Media that unmasks upward on entry and drifts slightly against the scroll. */
export function MediaReveal({
  children,
  className,
  drift = 8,
}: {
  children: React.ReactNode;
  className?: string;
  drift?: number;
}) {
  const outer = React.useRef<HTMLDivElement>(null);
  const inner = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!outer.current || !inner.current || prefersReducedMotion()) return;
      gsap.fromTo(
        outer.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: outer.current, start: "top 90%", once: true },
        },
      );
      gsap.fromTo(
        inner.current,
        { yPercent: -drift, scale: 1.16 },
        {
          yPercent: drift,
          scale: 1.16,
          ease: "none",
          scrollTrigger: { trigger: outer.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: outer },
  );

  return (
    <div ref={outer} className={cn("overflow-hidden", className)}>
      <div ref={inner} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

/** Children fade and rise in sequence when the group enters the viewport. */
export function FadeUp({
  children,
  className,
  stagger = 0.08,
  start = "top 88%",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  start?: string;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const ref = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const items = Array.from(el.children);
      gsap.from(items, {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref },
  );

  const Component = as as React.ElementType;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}

/** A vertical line that fills as its container scrolls past (used by the timeline). */
export function ScrollLine({ className, targetId }: { className?: string; targetId: string }) {
  const fill = React.useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const target = document.getElementById(targetId);
    if (!fill.current || !target) return;
    if (prefersReducedMotion()) {
      gsap.set(fill.current, { scaleY: 1 });
      return;
    }
    gsap.fromTo(
      fill.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: target, start: "top 65%", end: "bottom 65%", scrub: 0.4 },
      },
    );
    return () => ScrollTrigger.refresh();
  });

  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute w-px bg-line", className)}>
      <span ref={fill} className="absolute inset-0 origin-top scale-y-0 bg-accent" />
    </span>
  );
}

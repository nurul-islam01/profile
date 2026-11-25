"use client";

import * as React from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, whenAppReady } from "@/lib/motion";

/**
 * Lenis smooth scrolling (wheel and trackpad only; touch stays native),
 * driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
 * Off entirely when the visitor prefers reduced motion.
 */
export function SmoothScroll() {
  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    // Hold still while the loader is up; start once the page is ready.
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();
    const stopWaiting = whenAppReady(() => lenis.start());

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Same-page anchor links glide instead of jumping. Runs in the capture
    // phase so Next's <Link> doesn't also perform an instant hash jump.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(target, { offset: -72, duration: 1.4 });
      history.replaceState(null, "", url.hash);
    };
    window.addEventListener("click", onClick, { capture: true });

    return () => {
      stopWaiting();
      window.removeEventListener("click", onClick, { capture: true });
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}

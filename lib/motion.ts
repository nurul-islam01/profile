import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Fired once the preloader has finished (or was skipped); the hero entrance waits for it. */
export const READY_EVENT = "app:ready";
/** Fired by the hero shader after its first frame, so the preloader can count it as loaded. */
export const HERO_GL_EVENT = "hero:gl-ready";

export function isAppReady(): boolean {
  return typeof document !== "undefined" && document.documentElement.dataset.ready === "true";
}

export function whenAppReady(cb: () => void): () => void {
  if (isAppReady()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(READY_EVENT, handler, { once: true });
  return () => window.removeEventListener(READY_EVENT, handler);
}

export function markAppReady() {
  if (isAppReady()) return;
  document.documentElement.dataset.ready = "true";
  window.dispatchEvent(new Event(READY_EVENT));
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A mouse or trackpad: hover effects and the custom cursor only make sense here. */
export function hasFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Scroll to a section by id, smoothly through Lenis when it is running. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -72, duration: 1.4 });
  } else {
    el.scrollIntoView({ block: "start" });
  }
  history.replaceState(null, "", `#${id}`);
  return true;
}

/** Reads a token from globals.css ("15 22 38") as normalised RGB for shaders. */
export function readColorToken(name: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parts = raw.split(/\s+/).map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return [0, 0, 0];
  return [parts[0]! / 255, parts[1]! / 255, parts[2]! / 255];
}

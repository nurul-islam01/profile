"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

const INTERACTIVE = "a, button, [role='option'], label, summary, [data-cursor='grow']";
const TEXT_ENTRY = "input, textarea, select, [contenteditable='true']";

/**
 * Dot that sits exactly on the pointer plus a ring that trails it and grows
 * over anything clickable. Mouse/trackpad only; never on touch or reduced motion.
 * Native cursor comes back over text fields so typing feels normal.
 */
export function Cursor() {
  const dotRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");

    const state = { x: -100, y: -100, rx: -100, ry: -100, scale: 1, targetScale: 1, visible: false };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      state.x = e.clientX;
      state.y = e.clientY;
      dot.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
      if (!state.visible) {
        state.visible = true;
        state.rx = state.x;
        state.ry = state.y;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 });
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const typing = t.closest(TEXT_ENTRY);
      html.classList.toggle("cursor-native", Boolean(typing));
      state.targetScale = typing ? 0 : t.closest(INTERACTIVE) ? 1.9 : 1;
      dot.style.opacity = typing ? "0" : t.closest(INTERACTIVE) ? "0" : "1";
    };

    const onLeave = () => {
      state.visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };

    const onDown = () => (state.targetScale *= 0.8);
    const onUp = () => (state.targetScale /= 0.8);

    const tick = () => {
      state.rx += (state.x - state.rx) * 0.2;
      state.ry += (state.y - state.ry) * 0.2;
      state.scale += (state.targetScale - state.scale) * 0.18;
      ring.style.transform = `translate3d(${state.rx}px, ${state.ry}px, 0) scale(${state.scale})`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    gsap.ticker.add(tick);

    return () => {
      html.classList.remove("has-cursor", "cursor-native");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
    </>
  );
}

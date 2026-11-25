"use client";

import * as React from "react";
import { gsap } from "@/lib/gsap";
import { createProgram, SIMPLEX_2D, uniforms } from "@/lib/gl";
import {
  HERO_GL_EVENT,
  hasFinePointer,
  prefersReducedMotion,
  readColorToken,
  whenAppReady,
} from "@/lib/motion";

const VERT = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Night water: long horizontal currents (domain-warped noise) with thin
// threads of light where the field crosses two levels. The cursor parts the
// current and brightens the threads near it.
const FRAG = /* glsl */ `
precision highp float;
#define OCTAVES __OCTAVES__
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform float uScroll;
uniform float uIntensity;
uniform vec3 uBg;
uniform vec3 uMid;
uniform vec3 uGlow;
varying vec2 vUv;
${SIMPLEX_2D}
float fbm(vec2 p) {
  float f = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < OCTAVES; i++) {
    f += a * snoise(p);
    p = rot * p * 2.03 + 11.7;
    a *= 0.5;
  }
  return f;
}
void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);

  vec2 dm = p - m;
  float md = length(dm);
  float push = exp(-md * md * 7.0) * uMouseOn;
  p += dm / max(md, 0.001) * push * 0.07;

  float t = uTime * 0.03;
  vec2 q = vec2(p.x * 0.42 - t * 1.3, p.y * 1.45);
  vec2 w = vec2(fbm(q + vec2(0.0, t)), fbm(q + vec2(4.7, -t)));
  float f = fbm(q + 1.7 * w);

  float body = smoothstep(-0.6, 0.7, f);
  vec3 col = mix(uBg, uMid, body);

  float th1 = 1.0 - smoothstep(0.0, 0.03, abs(f - 0.2));
  float th2 = 1.0 - smoothstep(0.0, 0.02, abs(f + 0.24));
  float threads = th1 * 0.6 + th2 * 0.4;
  float band = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.62, uv.y);
  col = mix(col, uGlow, clamp(threads * (0.2 + push * 0.65) * band, 0.0, 1.0));
  col = mix(col, uGlow, 0.07 * exp(-md * md * 9.0) * uMouseOn);

  col = mix(uBg, col, uIntensity * (1.0 - uScroll * 0.9));

  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * (2.0 / 255.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

const U = ["uRes", "uTime", "uMouse", "uMouseOn", "uScroll", "uIntensity", "uBg", "uMid", "uGlow"] as const;

/** Full-bleed shader behind the hero. Falls back to the plain background. */
export function FlowField({ className }: { className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const announce = () => window.dispatchEvent(new Event(HERO_GL_EVENT));

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    }) as WebGLRenderingContext | null;
    if (!gl) {
      announce();
      return;
    }

    const reduced = prefersReducedMotion();
    const small = !hasFinePointer() || window.innerWidth < 768;
    let program: WebGLProgram;
    try {
      program = createProgram(gl, VERT, FRAG.replace("__OCTAVES__", small ? "3" : "5"));
    } catch {
      announce();
      return;
    }
    gl.useProgram(program);
    const u = uniforms(gl, program, U);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const setColors = () => {
      const bg = readColorToken("--bg");
      const raised = readColorToken("--raised");
      const accent = readColorToken("--accent");
      const dark = document.documentElement.classList.contains("dark");
      // Currents sit a little lighter than the page in dark mode, a little darker in light mode.
      const mid = bg.map((c, i) => Math.min(1, Math.max(0, c + (raised[i]! - c) * 2.2 - (dark ? 0 : 0.035))));
      gl.uniform3fv(u.uBg, bg);
      gl.uniform3fv(u.uMid, mid);
      gl.uniform3fv(u.uGlow, accent);
    };
    setColors();

    const state = { mx: 0.62, my: 0.45, tmx: 0.62, tmy: 0.45, on: 0, tOn: 0, intensity: reduced ? 1 : 0, scroll: 0 };
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      let scale = (small ? 0.35 : 0.5) * dpr;
      const px = rect.width * rect.height * scale * scale;
      if (px > 900_000) scale *= Math.sqrt(900_000 / px);
      width = Math.max(1, Math.round(rect.width * scale));
      height = Math.max(1, Math.round(rect.height * scale));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(u.uRes, width, height);
    };
    resize();

    let first = true;
    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      state.scroll = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
      state.mx += (state.tmx - state.mx) * 0.06;
      state.my += (state.tmy - state.my) * 0.06;
      state.on += (state.tOn - state.on) * 0.05;
      gl.uniform1f(u.uTime, time);
      gl.uniform2f(u.uMouse, state.mx, state.my);
      gl.uniform1f(u.uMouseOn, state.on);
      gl.uniform1f(u.uScroll, state.scroll);
      gl.uniform1f(u.uIntensity, state.intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (first) {
        first = false;
        announce();
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside = e.clientY >= rect.top && e.clientY <= rect.bottom;
      state.tOn = inside ? 1 : 0;
      state.tmx = (e.clientX - rect.left) / rect.width;
      state.tmy = 1 - (e.clientY - rect.top) / rect.height;
    };

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(40);
    });
    ro.observe(canvas);

    const themeObserver = new MutationObserver(() => {
      setColors();
      if (reduced) draw(40);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let stopEntrance = () => {};
    let tick: ((time: number) => void) | null = null;

    if (reduced) {
      draw(40);
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      tick = (time: number) => {
        if (visible && !document.hidden) draw(time);
      };
      gsap.ticker.add(tick);
      stopEntrance = whenAppReady(() => {
        gsap.to(state, { intensity: 1, duration: 2.2, ease: "power2.out", delay: 0.2 });
      });
      draw(0);
    }

    return () => {
      stopEntrance();
      if (tick) gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}

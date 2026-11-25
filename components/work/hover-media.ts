import { gsap } from "@/lib/gsap";
import { createProgram, createTexture, uniforms, uploadTexture } from "@/lib/gl";
import { CARD_H, CARD_W, paintBrandCard } from "@/lib/brand-card";
import { hostOf } from "@/lib/domain";
import type { Project } from "@/content/projects";

const SEG_X = 28;
const SEG_Y = 16;
const ASPECT = CARD_H / CARD_W;

const VERT = /* glsl */ `
attribute vec2 aUv;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform vec2 uSize;
// Shared with the fragment shader, so both must agree on precision.
uniform mediump vec2 uVel;
varying vec2 vUv;
void main() {
  vUv = aUv;
  vec2 local = (aUv - 0.5) * uSize;
  // The middle lags behind the edges, like a sheet dragged through water.
  local.x -= uVel.x * sin(aUv.y * 3.14159265) * 0.9;
  local.y -= uVel.y * sin(aUv.x * 3.14159265) * 0.9;
  vec2 clip = (uCenter + local) / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform sampler2D uTex0;
uniform sampler2D uTex1;
uniform float uMix;
uniform mediump vec2 uVel;
uniform float uAlpha;
uniform vec2 uPx;
uniform float uRadius;
uniform float uTime;
varying vec2 vUv;

vec3 split(sampler2D tex, vec2 uv, vec2 s) {
  return vec3(texture2D(tex, uv + s).r, texture2D(tex, uv).g, texture2D(tex, uv - s).b);
}

void main() {
  float speed = clamp(length(uVel) / 50.0, 0.0, 1.0);
  vec2 uv = vUv;
  uv.y += sin(uv.x * 10.0 + uTime * 5.0) * 0.007 * speed;
  uv.x += sin(uv.y * 8.0 + uTime * 4.0) * 0.004 * speed;
  vec2 s = (uVel / uPx) * 0.25;

  float m = smoothstep(0.0, 1.0, uMix);
  float wave = 0.5 + 0.5 * sin(vUv.y * 7.0 + uTime * 1.6);
  vec3 a = split(uTex0, uv + vec2(m * wave * 0.32, 0.0), s);
  vec3 b = split(uTex1, uv - vec2((1.0 - m) * wave * 0.32, 0.0), s);
  vec3 col = mix(a, b, m);

  vec2 p = (vUv - 0.5) * uPx;
  vec2 q = abs(p) - (uPx * 0.5 - uRadius);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float alpha = (1.0 - smoothstep(-0.75, 0.75, d)) * uAlpha;
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

const U = ["uRes", "uCenter", "uSize", "uVel", "uTex0", "uTex1", "uMix", "uAlpha", "uPx", "uRadius", "uTime"] as const;

/**
 * Floating preview that follows the pointer over the work list: one textured
 * plane, bent by pointer velocity, with an RGB split while moving and a
 * displacement wipe between projects. Renders only while visible.
 */
export class HoverMedia {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private u: Record<(typeof U)[number], WebGLUniformLocation | null>;
  private buffers: WebGLBuffer[] = [];
  private indexCount = 0;
  private textures: WebGLTexture[];
  private loaded: Array<Promise<void> | null>;
  private tex0 = -1;
  private tex1 = -1;
  private s = { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, alpha: 0, scale: 0.7, mix: 0 };
  private width = 0;
  private height = 0;
  private dpr = 1;
  private running = false;
  private mixTween: gsap.core.Tween | null = null;
  private onResize = () => this.resize();
  private tick = (time: number) => this.render(time);

  constructor(
    private canvas: HTMLCanvasElement,
    private projects: Project[],
    private fontFamily: string,
  ) {
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    this.program = createProgram(gl, VERT, FRAG);
    gl.useProgram(this.program);
    this.u = uniforms(gl, this.program, U);

    // Subdivided plane so the vertex shader can bend it.
    const verts: number[] = [];
    for (let y = 0; y <= SEG_Y; y++) for (let x = 0; x <= SEG_X; x++) verts.push(x / SEG_X, y / SEG_Y);
    const idx: number[] = [];
    for (let y = 0; y < SEG_Y; y++) {
      for (let x = 0; x < SEG_X; x++) {
        const i = y * (SEG_X + 1) + x;
        idx.push(i, i + 1, i + SEG_X + 1, i + 1, i + SEG_X + 2, i + SEG_X + 1);
      }
    }
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    const ibo = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    this.buffers.push(vbo, ibo);
    this.indexCount = idx.length;
    const aUv = gl.getAttribLocation(this.program, "aUv");
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

    this.textures = projects.map(() => createTexture(gl));
    this.loaded = projects.map(() => null);
    gl.uniform1i(this.u.uTex0, 0);
    gl.uniform1i(this.u.uTex1, 1);
    gl.clearColor(0, 0, 0, 0);

    this.resize();
    window.addEventListener("resize", this.onResize);
  }

  /** Loads every texture; call when the page is idle. */
  preload() {
    this.projects.forEach((_, i) => void this.load(i));
  }

  show(index: number) {
    void this.load(index);
    const hidden = this.s.alpha < 0.05;
    if (hidden || this.tex0 < 0) {
      this.mixTween?.kill();
      this.tex0 = index;
      this.tex1 = index;
      this.s.mix = 0;
      this.s.x = this.s.tx;
      this.s.y = this.s.ty;
    } else if (index !== this.tex1) {
      // Finish any wipe in progress, then wipe to the new project.
      this.mixTween?.kill();
      if (this.s.mix > 0.5) this.tex0 = this.tex1;
      this.tex1 = index;
      this.s.mix = 0;
      this.mixTween = gsap.to(this.s, {
        mix: 1,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          this.tex0 = this.tex1;
          this.s.mix = 0;
        },
      });
    }
    gsap.to(this.s, { alpha: 1, scale: 1, duration: 0.6, ease: "expo.out", overwrite: "auto" });
    this.start();
  }

  hide() {
    gsap.to(this.s, { alpha: 0, scale: 0.82, duration: 0.45, ease: "power3.out", overwrite: "auto" });
  }

  /**
   * Follow the pointer. The preview sits below and to the right of it so the
   * hovered row stays readable, flipping sides near the viewport edges.
   */
  moveTo(x: number, y: number, immediate = false) {
    const w = this.planeWidth();
    const h = w * ASPECT;
    const gap = 28;
    let cx = x + gap + w / 2;
    let cy = y + gap + h / 2;
    if (cx + w / 2 > this.width - 12) cx = x - gap - w / 2;
    if (cy + h / 2 > this.height - 12) cy = y - gap - h / 2;
    this.placeAt(cx, cy, immediate);
  }

  /** Put the preview's centre at a point (used for keyboard focus). */
  placeAt(cx: number, cy: number, immediate = false) {
    this.s.tx = cx;
    this.s.ty = cy;
    if (immediate) {
      this.s.x = cx;
      this.s.y = cy;
    }
    this.start();
  }

  private planeWidth() {
    return Math.min(Math.max(this.width * 0.24, 280), 420);
  }

  destroy() {
    window.removeEventListener("resize", this.onResize);
    gsap.ticker.remove(this.tick);
    this.mixTween?.kill();
    gsap.killTweensOf(this.s);
    const gl = this.gl;
    this.textures.forEach((t) => gl.deleteTexture(t));
    this.buffers.forEach((b) => gl.deleteBuffer(b));
    gl.deleteProgram(this.program);
  }

  private load(i: number): Promise<void> {
    const existing = this.loaded[i];
    if (existing) return existing;
    const p = this.projects[i]!;
    const tex = this.textures[i]!;
    const job = (async () => {
      if (p.image) {
        const img = new Image();
        img.decoding = "async";
        img.src = p.image;
        await img.decode();
        uploadTexture(this.gl, tex, img);
      } else if (p.brand) {
        await document.fonts.ready;
        const canvas = document.createElement("canvas");
        paintBrandCard(canvas, { name: p.name, host: hostOf(p.url), brand: p.brand }, this.fontFamily);
        uploadTexture(this.gl, tex, canvas);
      }
      this.start();
    })().catch(() => {});
    this.loaded[i] = job;
    return job;
  }

  private resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.start();
  }

  private start() {
    if (this.running) return;
    this.running = true;
    gsap.ticker.add(this.tick);
  }

  private render(time: number) {
    const s = this.s;
    const px = s.x;
    const py = s.y;
    s.x += (s.tx - s.x) * 0.13;
    s.y += (s.ty - s.y) * 0.13;
    const vx = Math.max(-70, Math.min(70, s.x - px));
    const vy = Math.max(-70, Math.min(70, s.y - py));
    s.vx += (vx - s.vx) * 0.25;
    s.vy += (vy - s.vy) * 0.25;

    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    const settled = Math.abs(s.vx) < 0.05 && Math.abs(s.vy) < 0.05 && Math.abs(s.tx - s.x) < 0.5 && Math.abs(s.ty - s.y) < 0.5;
    if (s.alpha < 0.002) {
      if (settled && !gsap.isTweening(s)) {
        this.running = false;
        gsap.ticker.remove(this.tick);
      }
      return;
    }
    if (this.tex0 < 0) return;

    const w = this.planeWidth() * s.scale;
    const h = w * ASPECT;
    gl.uniform2f(this.u.uRes, this.width, this.height);
    gl.uniform2f(this.u.uCenter, s.x, s.y);
    gl.uniform2f(this.u.uSize, w, h);
    gl.uniform2f(this.u.uVel, s.vx, s.vy);
    gl.uniform2f(this.u.uPx, w, h);
    gl.uniform1f(this.u.uRadius, 10);
    gl.uniform1f(this.u.uAlpha, s.alpha);
    gl.uniform1f(this.u.uMix, s.mix);
    gl.uniform1f(this.u.uTime, time);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[this.tex0]!);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[this.tex1 >= 0 ? this.tex1 : this.tex0]!);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}

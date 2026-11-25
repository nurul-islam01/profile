// Paints a site's typographic card (used as a WebGL texture). Mirrors the DOM
// <BrandCard>: host top-left, accent dot top-right, name large bottom-left.

export const CARD_W = 1496;
export const CARD_H = 801;

export type BrandCardData = {
  name: string;
  host: string;
  brand: { bg: string; fg: string; accent: string };
};

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function paintBrandCard(canvas: HTMLCanvasElement, data: BrandCardData, fontFamily: string) {
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { bg, fg, accent } = data.brand;
  const pad = 84;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const glow = ctx.createRadialGradient(CARD_W * 0.8, CARD_H * 0.16, 0, CARD_W * 0.8, CARD_H * 0.16, CARD_H * 1.1);
  glow.addColorStop(0, withAlpha(accent, 0.4));
  glow.addColorStop(1, withAlpha(accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.fillStyle = fg;
  ctx.globalAlpha = 0.82;
  ctx.font = `500 42px ${fontFamily}`;
  ctx.textBaseline = "top";
  ctx.fillText(data.host, pad, pad - 8);
  ctx.globalAlpha = 1;

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(CARD_W - pad - 18, pad + 14, 20, 0, Math.PI * 2);
  ctx.fill();

  const spaced = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  let size = 260;
  let lines: string[] = [];
  const maxWidth = CARD_W - pad * 2;
  for (; size >= 100; size -= 10) {
    ctx.font = `800 ${size}px ${fontFamily}`;
    spaced.letterSpacing = `${Math.round(size * -0.04)}px`;
    lines = wrap(ctx, data.name, maxWidth);
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
    if (lines.length <= 2 && widest <= maxWidth) break;
  }
  ctx.fillStyle = fg;
  ctx.textBaseline = "alphabetic";
  const lineHeight = size * 0.9;
  lines.forEach((line, i) => {
    ctx.fillText(line, pad - size * 0.03, CARD_H - pad - (lines.length - 1 - i) * lineHeight);
  });
  spaced.letterSpacing = "0px";
}

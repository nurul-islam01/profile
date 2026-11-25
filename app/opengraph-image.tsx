import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { hostOf, splitHost } from "@/lib/domain";

export const runtime = "nodejs";
export const alt = `${profile.name} — ${profile.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NIGHT = "#0F1626";
const LINE = "#2A3550";
const FG = "#EDF0F5";
const MUTED = "#9BA7BD";
const JUTE = "#E3B24C";

export default async function OGImage() {
  const fonts = join(process.cwd(), "app/fonts");
  const [heavy, medium] = await Promise.all([
    readFile(join(fonts, "schibsted-grotesk-latin-800-normal.woff")),
    readFile(join(fonts, "schibsted-grotesk-latin-500-normal.woff")),
  ]);

  const domains = projects.filter((p) => p.featured).map((p) => hostOf(p.url));
  const [site, siteSuffix] = splitHost(hostOf(profile.socials.website));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: NIGHT,
          color: FG,
          fontFamily: "Schibsted Grotesk",
          padding: "68px 80px 60px",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>
          <span>{site}</span>
          <span style={{ fontWeight: 500 }}>{siteSuffix}</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 64,
            fontSize: 124,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
          }}
        >
          {profile.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 30, fontSize: 38, fontWeight: 500 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: JUTE, marginRight: 18 }} />
          {profile.role}, {profile.company}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexWrap: "wrap",
            borderTop: `2px solid ${LINE}`,
            paddingTop: 26,
            fontSize: 25,
            fontWeight: 500,
            color: MUTED,
          }}
        >
          {domains.map((d) => (
            <span key={d} style={{ marginRight: 34, marginBottom: 6 }}>
              {d}
            </span>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Schibsted Grotesk", data: heavy, weight: 800, style: "normal" },
        { name: "Schibsted Grotesk", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}

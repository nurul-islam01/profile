import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const runtime = "nodejs";
export const alt = `${profile.name} — ${profile.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          display: "flex",
          flexDirection: "column",
          padding: 64,
        }}
      >
        {/* terminal titlebar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingBottom: 16,
            borderBottom: "1px solid #30363d",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#ff5f57" }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#febc2e" }} />
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#28c840" }} />
          <div style={{ marginLeft: 16, color: "#8b949e", fontSize: 22 }}>
            {`~/${profile.username} — zsh`}
          </div>
        </div>

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, fontSize: 28 }}>
            <span style={{ color: "#7ee787" }}>{`${profile.username}@dev`}</span>
            <span style={{ color: "#8b949e" }}>:</span>
            <span style={{ color: "#7ee787" }}>~</span>
            <span style={{ color: "#8b949e" }}>$</span>
            <span>whoami</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>{profile.name}</div>
            <div style={{ fontSize: 32, color: "#79c0ff" }}>{profile.jobTitle}</div>
            <div style={{ fontSize: 24, color: "#8b949e" }}>{`@ ${profile.company}`}</div>
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#8b949e",
            borderTop: "1px solid #30363d",
            paddingTop: 16,
          }}
        >
          <span>nurul.com.bd</span>
          <span style={{ color: "#7ee787" }}>$ _</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

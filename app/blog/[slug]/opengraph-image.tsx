import { ImageResponse } from "next/og";
import { getPostBySlug, formatPostDate } from "@/lib/mdx";
import { profile } from "@/content/profile";

export const runtime = "nodejs";
export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function PostOGImage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? "Post not found";
  const description = post?.description ?? "";
  const date = post?.date ? formatPostDate(post.date) : "";
  const readingTime = post?.readingTime ?? 0;

  const truncatedDesc =
    description.length > 160 ? `${description.slice(0, 157)}...` : description;

  const footerRight = [date, readingTime ? `${readingTime} min read` : null]
    .filter(Boolean)
    .join("  ·  ");

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
            {`~/blog/${slug}`}
          </div>
        </div>

        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, fontSize: 24, color: "#8b949e" }}>
            <span style={{ color: "#7ee787" }}>{`${profile.username}@dev`}</span>
            <span>:</span>
            <span style={{ color: "#7ee787" }}>~/blog</span>
            <span>$</span>
            <span style={{ color: "#e6edf3" }}>{`cat ${slug}.mdx`}</span>
          </div>

          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.1,
              color: "#e6edf3",
            }}
          >
            {title}
          </div>

          {truncatedDesc ? (
            <div
              style={{
                fontSize: 26,
                color: "#8b949e",
                lineHeight: 1.4,
              }}
            >
              {truncatedDesc}
            </div>
          ) : null}
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
          <span>{`${profile.name} · nurul.com.bd`}</span>
          <span>{footerRight}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

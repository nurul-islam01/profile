import Link from "next/link";
import { formatPostDate, type PostMeta } from "@/lib/mdx";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group rounded-lg border border-terminal-border bg-terminal-surface/40 p-5 transition-colors hover:border-terminal-prompt">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="flex items-center gap-3 font-mono text-xs text-terminal-muted">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h3 className="mt-2 font-mono text-lg font-semibold text-terminal-fg group-hover:text-terminal-prompt">
          {post.title}
        </h3>
        <p className="mt-2 font-sans text-sm leading-6 text-terminal-muted">
          {post.description}
        </p>
        {post.tags && post.tags.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-terminal-muted">
            {post.tags.map((t) => (
              <li key={t} className="rounded border border-terminal-border px-1.5 py-0.5">
                #{t}
              </li>
            ))}
          </ul>
        ) : null}
      </Link>
    </article>
  );
}

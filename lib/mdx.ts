import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: number;
};

export type Post = PostMeta & {
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

async function readPostFile(filename: string): Promise<Post | null> {
  if (!filename.endsWith(".mdx")) return null;
  const slug = filename.replace(/\.mdx$/, "");
  const raw = await fs.readFile(path.join(POSTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  if (!fm.title || !fm.date) return null;
  return {
    slug,
    title: fm.title,
    description: fm.description ?? "",
    date: fm.date,
    tags: fm.tags ?? [],
    draft: fm.draft ?? false,
    readingTime: estimateReadingTime(content),
    content,
  };
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getAllPosts(): Promise<PostMeta[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }
  const posts = await Promise.all(entries.map((f) => readPostFile(f)));
  return posts
    .filter((p): p is Post => p !== null && !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map(({ content: _content, ...meta }) => meta);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await readPostFile(`${slug}.mdx`);
    if (!post || post.draft) return null;
    return post;
  } catch {
    return null;
  }
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

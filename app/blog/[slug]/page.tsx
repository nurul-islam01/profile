import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { Prompt } from "@/components/terminal/prompt";
import { mdxComponents } from "@/components/blog/mdx-components";
import { getAllPosts, getPostBySlug, formatPostDate } from "@/lib/mdx";
import { pageMetadata, absoluteUrl } from "@/lib/seo";
import { profile } from "@/content/profile";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return pageMetadata({ title: "Not found", path: `/blog/${slug}` });
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: { dark: "github-dark-dimmed", light: "github-light" },
  keepBackground: false,
  defaultLang: "plaintext",
};

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags?.join(", "),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    url: absoluteUrl(`/blog/${post.slug}`),
    author: {
      "@type": "Person",
      name: profile.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Person",
      name: profile.name,
      url: absoluteUrl("/"),
    },
  };

  return (
    <article className="border-t border-terminal-border py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-10">
          <Prompt path={`~/blog/${post.slug}`} cmd={`cat ${post.slug}.mdx`} />
          <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-terminal-muted">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime} min read</span>
            {post.tags && post.tags.length > 0 ? (
              <>
                <span aria-hidden>·</span>
                <ul className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <li key={t}>#{t}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <h1 className="mt-3 font-mono text-2xl font-bold leading-tight text-terminal-fg sm:text-3xl">
            {post.title}
          </h1>
          {post.description ? (
            <p className="mt-3 font-sans text-base leading-7 text-terminal-muted">
              {post.description}
            </p>
          ) : null}
        </header>

        <div className="prose-terminal">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
              },
            }}
          />
        </div>

        <footer className="mt-16 border-t border-terminal-border pt-6 font-mono text-sm">
          <Link href="/blog" className="link-underline">
            <span className="text-terminal-prompt">$</span> cd ../
          </Link>
        </footer>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}

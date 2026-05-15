import { Prompt } from "@/components/terminal/prompt";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/mdx";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description: "Notes on engineering, infrastructure, and shipping web products at scale.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <section className="border-t border-terminal-border py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-10">
          <Prompt path="~/blog" cmd="ls -lt posts/" />
          <h1 className="sr-only">Blog</h1>
          <p className="mt-4 font-sans text-base leading-7 text-terminal-muted">
            Notes on shipping production web — Next.js on bare metal, Quintype/Bold internals,
            Go services, and whatever else I'm currently breaking.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="font-mono text-sm text-terminal-muted">
            <span className="text-terminal-prompt">›</span> no posts yet — check back soon.
          </p>
        ) : (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

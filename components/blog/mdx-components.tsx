import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { cn } from "@/lib/cn";

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

export const mdxComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-12 mb-6 scroll-mt-24 font-mono text-2xl font-bold text-terminal-fg",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, children, ...props }) => (
    <h2
      className={cn(
        "mt-12 mb-4 scroll-mt-24 font-mono text-xl font-semibold text-terminal-fg",
        className
      )}
      {...props}
    >
      <span className="text-terminal-prompt">## </span>
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }) => (
    <h3
      className={cn(
        "mt-8 mb-3 scroll-mt-24 font-mono text-lg font-semibold text-terminal-fg",
        className
      )}
      {...props}
    >
      <span className="text-terminal-prompt">### </span>
      {children}
    </h3>
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("my-5 font-sans text-base leading-7 text-terminal-fg", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-5 list-none space-y-2 pl-4 font-sans text-base text-terminal-fg [&>li]:relative [&>li]:pl-5 [&>li:before]:absolute [&>li:before]:left-0 [&>li:before]:text-terminal-prompt [&>li:before]:content-['-']",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn("my-5 list-decimal space-y-2 pl-6 font-sans text-base text-terminal-fg marker:text-terminal-muted", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }) => <li className={cn("leading-7", className)} {...props} />,
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-6 border-l-2 border-terminal-prompt bg-terminal-surface/60 px-4 py-2 font-sans italic text-terminal-muted",
        className
      )}
      {...props}
    />
  ),
  a: ({ href = "", className, children, ...props }) => {
    if (isInternal(href)) {
      return (
        <Link href={href} className={cn("link-underline", className)} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("link-underline", className)}
        {...props}
      >
        {children}
      </a>
    );
  },
  code: ({ className, children, ...props }) => {
    // rehype-pretty-code wraps block code in <pre><code>; inline code lacks data-language
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code
          className="rounded bg-terminal-surface px-1.5 py-0.5 font-mono text-[0.9em] text-terminal-keyword"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-lg border border-terminal-border bg-terminal-surface p-4 font-mono text-sm leading-6",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-10 border-terminal-border", className)} {...props} />
  ),
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-terminal-fg", className)} {...props} />
  ),
  em: ({ className, ...props }) => <em className={cn("italic", className)} {...props} />,
};

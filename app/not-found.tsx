import Link from "next/link";
import { Prompt } from "@/components/terminal/prompt";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-32">
      <Prompt path="~" cmd="cd /this/page">
        <div className="mt-4 font-mono text-sm">
          <p className="text-terminal-keyword">bash: cd: /this/page: No such file or directory</p>
          <p className="mt-1 text-terminal-muted">exit code: 404</p>
        </div>
      </Prompt>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-terminal-border bg-terminal-surface px-4 py-2 font-mono text-sm text-terminal-fg hover:border-terminal-prompt transition-colors"
        >
          <span className="text-terminal-prompt">$</span> cd ~
        </Link>
      </div>
    </section>
  );
}

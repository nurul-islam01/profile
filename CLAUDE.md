# CLAUDE.md

Guidance for AI coding agents working on this repo. Keep this file accurate — update it as decisions change.

## Project
Personal portfolio for **Nurul Islam** — Deputy Manager & Tech Lead at Navana Group. Replaces an older portfolio served at both `nurul.dev` and `nurul.com.bd`. Source of truth for content is `Nurul_Islam_CV.pdf` in this directory.

## Locked decisions
| Topic | Decision |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 + TypeScript strict |
| Styling | Tailwind CSS v3.4 + `@tailwindcss/typography`. Custom CSS variables for terminal palette. |
| Animation | Framer Motion (preferred over GSAP — lighter, tree-shakable) |
| Theming | `next-themes`, dark default, system-preference detected, user toggle |
| Visual style | **Terminal / dev-tool aesthetic.** Mono primary font (JetBrains Mono), prompt-style section headers, `git log` / `tree` / `cat` motifs. Don't drift into generic-gradient-hero territory. |
| Blog | MDX via `next-mdx-remote` + `gray-matter` + `rehype-pretty-code`. File-based posts in `content/posts/*.mdx`. No CMS. |
| Contact form | Real backend via **Resend** (`/api/contact`). Not mailto. Env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. |
| Deploy target | **Ubuntu server with nginx** as reverse proxy. `next start` managed by **PM2** (process name: `nurul`, config: `deploy/ecosystem.config.cjs`). NOT Vercel, NOT cPanel, NOT systemd. |
| Canonical domain | **`nurul.com.bd`**. `nurul.dev` 301-redirects to it at the nginx layer. |
| SEO | First-class. Metadata API, dynamic sitemap, robots, JSON-LD Person schema (root) + BlogPosting (per post), dynamic OG images via `next/og`. |
| Admin panel | None. Content is in TypeScript files (`content/*.ts`) and MDX. |

## Directory map
```
app/                Next.js App Router routes
  layout.tsx        root, fonts, theme provider, Person JSON-LD
  page.tsx          home — composes all sections
  blog/             [Phase 2] list + [slug] post page
  api/contact/      [Phase 2] POST → Resend
  sitemap.ts        dynamic sitemap
  robots.ts         robots.txt
components/
  terminal/         primitives: Prompt, TypedLine, CommandBlock, GitLogEntry, TreeNode, Caret
  sections/         page sections: Hero, About, Experience, Skills, Projects, Awards, Education, Contact
  blog/             [Phase 2] post card, MDX components
  ui/               low-level primitives (Button, Toast)
content/
  profile.ts        SOURCE OF TRUTH for name/role/links/bio. Import this anywhere instead of hard-coding.
  experience.ts     work history (Navana, Prothom Alo, Nassa, Wizdoor)
  projects.ts       featured projects (Navana sites + prothomalo.com)
  skills.ts         grouped skill categories from CV
  awards.ts         awards + activities
  education.ts      education history
  posts/            [Phase 2] *.mdx blog posts
lib/
  cn.ts             clsx + tailwind-merge helper
  seo.ts            SEO helpers, JSON-LD builders
  mdx.ts            [Phase 2] post loading + rendering
public/             static assets — photo, favicon, og fallback, resume PDF
deploy/             [Phase 3] PM2 ecosystem + nginx + deploy README
```

## Phase tracker
Phases are explicit so sessions stay scoped. Move work to the next phase if it would blow the budget.

**Phase 1 — Foundation (this session):**
- Scaffold, config, content data, terminal primitives
- Main `/` page with all sections (Contact uses mailto for now)
- SEO basics (metadata, sitemap, robots, JSON-LD Person)
- Build passes

**Phase 2 — Content systems (next session):**
- MDX blog: list page, post page, one seed post, BlogPosting JSON-LD
- Contact form → `/api/contact` → Resend
- Dynamic OG images (`opengraph-image.tsx` for `/` and `/blog/[slug]`)
- RSS feed
- Verify build + lighthouse

**Phase 3 — Deploy (next session):**
- `deploy/ecosystem.config.cjs` (PM2 process definition)
- `deploy/nginx.conf` (TLS, gzip/brotli, long static cache, `nurul.dev → nurul.com.bd` 301)
- `deploy/deploy.sh` (`git pull && npm ci && npm run build && pm2 reload nurul`)
- `deploy/README.md` (Let's Encrypt steps, first-time setup)

## Conventions

**Components.** Default to **React Server Components**. Only mark `"use client"` on components that genuinely need interactivity (theme toggle, typing animation, contact form, scroll triggers). Section wrappers stay server components.

**Imports.** Use the `@/*` alias (configured in `tsconfig.json`).

**Content edits.** All copy lives in `content/*.ts`. Don't hard-code names/dates/links in components — pull from the data files. This is how the site gets edited later without re-finding everywhere a string appears.

**Styles.** Tailwind utility classes. For theme-aware colors, use the `terminal.*` palette (e.g. `bg-terminal-bg`, `text-terminal-fg`, `border-terminal-border`). Light/dark values are defined as CSS variables in `app/globals.css`.

**Terminal aesthetic — keep it consistent:**
- Section headers render as a shell prompt (`~/section $ command`)
- Long-form text in blog/about is fine in `font-sans` (Inter) for readability
- Code-block content (Skills, Awards) uses `font-mono`
- No giant gradient hero. The Hero is a terminal window with a typed `whoami`.

**Accessibility.** All interactive components keyboard-navigable. `prefers-reduced-motion` respected — typing animations resolve to final state when reduced motion is set.

**SEO.** Every route exports `metadata` (or `generateMetadata`). Use `lib/seo.ts` helpers to build consistent OG/Twitter cards. Canonical URL is always `https://nurul.com.bd/...`.

## What NOT to do
- Don't add a CMS / admin panel.
- Don't introduce GSAP unless a specific scroll-timeline effect truly needs it — Framer Motion is the default.
- Don't add tests for this project (personal site, low blast radius). Type-check is the safety net.
- Don't change canonical domain or deploy target without updating this file.
- Don't `npm install` packages not in `package.json` casually — keep the dep list lean.

## How to run
```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run build        # production build
npm run start        # serve production build (PM2 invokes the equivalent in Phase 3)
```

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
| Theming | `next-themes`, dark default, system-preference detection **disabled** (every visitor sees dark on first load), user toggle still works |
| Visual style | **Terminal / dev-tool aesthetic.** Mono primary font (JetBrains Mono), prompt-style section headers, `git log` / `tree` / `cat` motifs. Don't drift into generic-gradient-hero territory. |
| Blog | **Removed.** No blog routes, no MDX pipeline, no `content/posts/`. Don't reintroduce without explicit ask. |
| Contact form | Real backend via **Resend** (`/api/contact`). Not mailto. Env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. |
| Deploy target | **Ubuntu server with nginx** as reverse proxy. `next start` managed by **PM2** (process name: `nurul`, config: `deploy/ecosystem.config.cjs`). NOT Vercel, NOT cPanel, NOT systemd. |
| Canonical domain | **`nurul.com.bd`**. `nurul.dev` 301-redirects to it at the nginx layer. |
| SEO | First-class. Metadata API, sitemap, robots, JSON-LD Person/WebSite schema, dynamic OG images via `next/og`. |
| Admin panel | None. Content is in TypeScript files (`content/*.ts`). |

## Directory map
```
app/                Next.js App Router routes
  layout.tsx        root, fonts, theme provider, Person JSON-LD
  page.tsx          home — composes all sections
  api/contact/      POST → Resend
  sitemap.ts        sitemap
  robots.ts         robots.txt
components/
  terminal/         primitives: Prompt, TypedLine, CommandBlock, GitLogEntry, TreeNode, Caret
  sections/         page sections: Hero, About, Experience, Skills, Projects, Awards, Education, Contact
  ui/               low-level primitives (Button, Toast)
content/
  profile.ts        SOURCE OF TRUTH for name/role/links/bio. Import this anywhere instead of hard-coding.
  experience.ts     work history (Navana, Prothom Alo, Nassa, Wizdoor)
  projects.ts       featured projects (Navana sites + prothomalo.com)
  skills.ts         grouped skill categories from CV
  awards.ts         awards + activities
  education.ts      education history
lib/
  cn.ts             clsx + tailwind-merge helper
  seo.ts            SEO helpers, JSON-LD builders
public/             static assets — photo, favicon, og fallback, resume PDF
deploy/             PM2 ecosystem + nginx + deploy script + README
```

## Phase tracker
Phases are explicit so sessions stay scoped. Move work to the next phase if it would blow the budget.

**Phase 1 — Foundation (this session):**
- Scaffold, config, content data, terminal primitives
- Main `/` page with all sections (Contact uses mailto for now)
- SEO basics (metadata, sitemap, robots, JSON-LD Person)
- Build passes

**Phase 2 — Content systems (done, minus blog):**
- ~~MDX blog~~ — removed; no admin/CMS planned, owner doesn't want to maintain MDX manually either.
- Contact form → `/api/contact` → Resend ✓
- Dynamic OG image for `/` ✓
- ~~RSS feed~~ — removed with blog.

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
- Long-form text in about is fine in `font-sans` (Inter) for readability
- Code-block content (Skills, Awards) uses `font-mono`
- No giant gradient hero. The Hero is a terminal window with a typed `whoami`.

**Accessibility.** All interactive components keyboard-navigable. `prefers-reduced-motion` respected — typing animations resolve to final state when reduced motion is set.

**SEO.** Every route exports `metadata` (or `generateMetadata`). Use `lib/seo.ts` helpers to build consistent OG/Twitter cards. Canonical URL is always `https://nurul.com.bd/...`.

## What NOT to do
- Don't add a CMS / admin panel.
- Don't reintroduce the blog (routes, MDX, RSS) without an explicit ask — it was deliberately removed.
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

# PLAN.md

Living plan for the portfolio rebuild. Update statuses as work progresses. `CLAUDE.md` has the locked decisions and conventions; this file has the to-do list.

## Status legend
- `[x]` done
- `[ ]` not started
- `[~]` in progress

---

## Phase 1 — Foundation
Goal: a deployable home page with all sections, theming, SEO basics, and content-driven data. Contact is mailto for now.

### Scaffold & tooling
- [x] `package.json` with locked dep versions
- [x] `tsconfig.json` strict, `@/*` alias
- [x] `next.config.mjs` with image config + cache headers
- [x] `tailwind.config.ts` with terminal palette + typography plugin
- [x] `postcss.config.mjs`
- [x] `.gitignore`, `.env.example`
- [x] `npm install` runs clean

### Theming & fonts
- [x] `app/globals.css` — CSS vars for light/dark terminal palette
- [x] `lib/fonts.ts` — `next/font` for JetBrains Mono + Inter
- [x] `components/theme-provider.tsx` — wraps `next-themes`
- [x] `components/theme-toggle.tsx` — client component

### Content (source of truth — pull from CV)
- [x] `content/profile.ts`
- [x] `content/experience.ts`
- [x] `content/projects.ts`
- [x] `content/skills.ts`
- [x] `content/awards.ts`
- [x] `content/education.ts`

### Terminal primitives (`components/terminal/`)
- [x] `prompt.tsx`
- [x] `typed-line.tsx` (respects `prefers-reduced-motion`)
- [x] `caret.tsx`
- [x] `window-chrome.tsx`
- [x] `section-shell.tsx` (replaces planned `command-block.tsx` — same role)
- [ ] `git-log-entry.tsx` — folded into `experience.tsx` directly; extract if reused
- [ ] `tree-node.tsx` — folded into `skills.tsx` directly; extract if reused

### Page sections (`components/sections/`)
- [x] `hero.tsx`
- [x] `about.tsx`
- [x] `experience.tsx` (git-log style timeline)
- [x] `skills.tsx` (tree command output)
- [x] `projects.tsx` (featured + more grid)
- [x] `awards.tsx`
- [x] `education.tsx`
- [x] `contact.tsx` (mailto for now — Phase 2 replaces with real form)

### Layout & shell
- [x] `app/layout.tsx` (fonts, theme provider, JSON-LD Person + WebSite, metadata)
- [x] `app/page.tsx`
- [x] `components/nav.tsx`
- [x] `components/footer.tsx`
- [x] `app/not-found.tsx` (terminal-style 404)
- [x] `app/icon.svg` + `app/apple-icon.svg`

### SEO
- [x] `lib/seo.ts` — `siteConfig`, `personJsonLd()`, `websiteJsonLd()`, `pageMetadata()`, `absoluteUrl()`
- [x] `app/sitemap.ts`
- [x] `app/robots.ts`
- [x] Root JSON-LD `Person` + `WebSite` in `layout.tsx`
- [ ] Static OG image in `public/og.png` — **TODO before deploy** (Phase 2 generates dynamic via `next/og`)

### Verification
- [x] `npm run typecheck` clean
- [x] `npm run build` clean (1.88 kB / 118 kB First Load, all static)
- [ ] Manual smoke test: `npm run dev`, click each section anchor (do this locally — I can't see browser)

---

## Phase 2 — Content systems

### MDX blog
- [x] `content/posts/hello-world.mdx` — seed post
- [x] `lib/mdx.ts` — `getAllPosts()`, `getPostBySlug()`, `formatPostDate()`; uses `gray-matter` + `next-mdx-remote/rsc`
- [x] `app/blog/page.tsx` — list page
- [x] `app/blog/[slug]/page.tsx` — post page with `generateStaticParams`, `generateMetadata`, BlogPosting JSON-LD
- [x] `components/blog/post-card.tsx`
- [x] `components/blog/mdx-components.tsx` — custom h1-h6, prose, code blocks via `rehype-pretty-code` (themes: `github-dark-dimmed` / `github-light`)
- [x] `app/feed.xml/route.ts` — RSS feed
- [x] Sitemap updated to include posts
- [ ] TOC (in-page) — folded; can revisit when a post grows long enough to need one

### Contact form
- [x] `components/sections/contact.tsx` upgraded to real form (server section + `contact-form.tsx` client child)
- [x] `lib/contact.ts` — zod schema shared by client + server
- [x] `app/api/contact/route.ts` — POST → Resend, IP rate-limited (5/hr), honeypot
- [x] Toast feedback via `sonner` (Toaster mounted in `app/layout.tsx`)

### Dynamic OG
- [x] `app/opengraph-image.tsx` — terminal-card style for home
- [x] `app/blog/[slug]/opengraph-image.tsx` — per-post
- [x] `lib/seo.ts` no longer hard-codes `/og.png`; lets Next.js auto-attach route-level `opengraph-image.tsx`
- [ ] `app/twitter-image.tsx` — not needed; `summary_large_image` falls back to the OG image automatically

### Verification
- [x] `npm run typecheck` clean
- [x] `npm run build` clean (all 12 pages prerender; `/blog/hello-world` is SSG)
- [ ] Lighthouse on `npm run start` build: aim 100/100/100/100 (do locally — needs a browser)
- [ ] Manual: submit a contact form to a test inbox (needs real `RESEND_API_KEY` in `.env.local`)
- [ ] Manual: visit `/blog`, open a post, check `/feed.xml` and `/opengraph-image`

---

## Phase 3 — Deploy
Target: Ubuntu + nginx + **PM2**. `nurul.com.bd` canonical, `nurul.dev` 301-redirects.

- [x] `deploy/ecosystem.config.cjs` — PM2 app `nurul`, `next start -p 3000 -H 127.0.0.1`, fork mode, autorestart, 512M memory cap, logs to `/var/log/pm2/`
- [x] `deploy/nginx.conf`:
  - upstream `nurul_next { server 127.0.0.1:3000; keepalive 32; }`
  - canonical server block for `nurul.com.bd` (proxy_pass with X-Forwarded-* headers)
  - `www.nurul.com.bd` + `nurul.dev` + `www.nurul.dev` → 301 to `https://nurul.com.bd`
  - HTTP→HTTPS redirect on :80 (with `.well-known/acme-challenge` carve-out for certbot)
  - HSTS + security headers, `gzip on`, brotli commented (uncomment if module present)
  - `/_next/static/` + asset-extension regex → `Cache-Control: public, max-age=31536000, immutable`
- [x] `deploy/deploy.sh` — git fetch/reset, `npm ci`, `npm run build`, `pm2 reload nurul --update-env && pm2 save`
- [x] `deploy/README.md`:
  - prerequisites (node 22, nginx, certbot, PM2 global, dedicated `nurul` user, DNS)
  - first-time setup: clone → env → build → `pm2 start ecosystem` → `pm2 startup` → bootstrap http-only nginx → certbot → swap in real config
  - Let's Encrypt commands for both apexes (covers www)
  - env var updates + `pm2 reload --update-env` workflow
  - PM2 cheat sheet + nginx log tips, common gotchas
  - post-deploy checklist (incl. reboot test to confirm PM2 startup)
- [x] `public/resume.pdf` — copied from `Nurul_Islam_CV.pdf` so the resume button doesn't 404

### Verification on server
- [ ] Both domains resolve, `nurul.dev` → 301 → `nurul.com.bd`
- [ ] TLS A grade on ssllabs
- [ ] Contact form works against production Resend key
- [ ] Sitemap accessible at `/sitemap.xml`, robots at `/robots.txt`
- [ ] Submit sitemap to Google Search Console + Bing Webmaster Tools

---

## Open questions / things the user owes
- [ ] Profile photo → drop as `public/me.jpg` (square, 800x800+)
- [x] Resume PDF → `public/resume.pdf` (copied from `Nurul_Islam_CV.pdf`)
- [ ] Resend API key (for Phase 2)
- [ ] Confirm featured project list (currently seeding from CV)
- [ ] Optional: a one-liner tagline preference (e.g. "Building scalable web for 6.6M+ daily readers")

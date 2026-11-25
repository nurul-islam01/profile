# CLAUDE.md

Guidance for AI coding agents working on this repo. Keep this file accurate — update it as decisions change.

## Project
Personal portfolio for **Nurul Islam** — Deputy Manager & Tech Lead at Navana Group. Replaces an older portfolio served at both `nurul.dev` and `nurul.com.bd`. Source of truth for content is `Nurul_Islam_CV.pdf` in this directory.

## Locked decisions
| Topic | Decision |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 + TypeScript strict |
| Styling | Tailwind CSS v3.4. Colour tokens are RGB-channel CSS variables in `app/globals.css` (`bg`, `raised`, `line`, `fg`, `muted`, `accent`, `accent-fg`, `danger`), so opacity modifiers work (`text-fg/50`). No typography plugin. |
| Fonts | Self-hosted with `next/font/local` (files + OFL licences in `app/fonts/`): **Schibsted Grotesk** for names, headings and UI; **Newsreader** for reading text (hero headline, bio, captions). Nothing is fetched from Google Fonts, so builds work offline. The `.woff` files are for the OG image (Satori can't read woff2). |
| Animation | CSS keyframes only, and only one load moment: the intro rises and the desktop preview reveals (`animate-rise`, `animate-reveal`). No animation library. `prefers-reduced-motion` is handled globally in `globals.css`. |
| Theming | `next-themes`, dark default, system-preference detection **disabled** (every visitor sees dark on first load), user toggle still works |
| Visual style | **"Delta night"**: river-night blue `#0F1626` with a jute-gold accent `#E3B24C` (`#8F6100` in light theme). Jute marks only "you are here" (active nav link, active domain, current role) and the primary action. The home page opens on the **domain index**: every site he has built, listed by its domain in large type; on desktop a sticky browser-frame preview shows the domain being pointed at or focused. Avoid: ALL-CAPS labels, monospace labels, middle-dot meta strings, `→` appended to text, fade-up animations on every section, gradient heroes. |
| Blog | **Removed.** No blog routes, no MDX pipeline, no `content/posts/`. Don't reintroduce without explicit ask. |
| Contact form | Real backend via **Resend** (`/api/contact`). Not mailto. Env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. |
| Deploy target | **Vercel** (project `profile`): pushes to `main` deploy to production; other branches get preview deployments. `nurul.com.bd` + `www` point at Vercel via Cloudflare DNS (grey cloud); `www` 308-redirects to the apex. The `deploy/` folder keeps the earlier Ubuntu + nginx + PM2 setup as a fallback; it is not what serves the site today. |
| Canonical domain | **`nurul.com.bd`**. `nurul.dev` lapsed in Nov 2026, so it is no longer linked anywhere (not in `sameAs`, not in the README). |
| SEO | First-class. Metadata API, sitemap, robots, JSON-LD Person/WebSite schema, dynamic OG image via `next/og` (`app/opengraph-image.tsx`). |
| Admin panel | None. Content is in TypeScript files (`content/*.ts`). |

## Directory map
```
app/                Next.js App Router routes
  layout.tsx        root: fonts, theme provider, skip link, nav/footer, palette, toaster, JSON-LD
  page.tsx          home — Showcase, then the sections in page order
  fonts/            self-hosted woff2 (site) + woff (OG image) + OFL licences
  icon.svg          "NI" monogram; apple-icon.png is the same at 180×180
  opengraph-image.tsx  1200×630 card (name, role, featured domains)
  api/contact/      POST → Resend
  sitemap.ts        sitemap
  robots.ts         robots.txt
components/
  showcase.tsx      intro (server) handed to work-index
  work-index.tsx    client: domain list + sticky preview; lazy-loads the other previews after idle
  section.tsx       <Section name="…"> wrapper (title column + content) and the shared `metaRow` grid
  sections/         Experience, About, Skills, Education, Awards, Contact (+ contact-form)
  nav.tsx           sticky header, active-section tracking, menu/search trigger
  command-palette.tsx  ⌘K / Ctrl K dialog (combobox + listbox); also the mobile menu
  theme-toggle.tsx, toaster.tsx, footer.tsx, theme-provider.tsx
content/
  profile.ts        SOURCE OF TRUTH for name/role/links/bio. Import this anywhere instead of hard-coding.
  experience.ts     work history (Navana, Prothom Alo, Nassa, Wizdoor)
  projects.ts       every site in the domain index, with `featured` and `image`
  skills.ts         grouped skill categories from CV
  awards.ts         awards + activities
  education.ts      education history
lib/
  sections.ts       section ids/titles + page and nav order (used by page, nav and palette)
  domain.ts         hostOf / splitHost helpers for showing domains
  fonts.ts          next/font/local setup
  cn.ts             clsx + tailwind-merge helper
  seo.ts            SEO helpers, JSON-LD builders
  contact.ts        zod schema shared by the form and the API route
public/             portrait.webp, me.jpg, resume.pdf, work/{slug}.webp screenshots
deploy/             PM2 ecosystem + nginx + deploy script + README (fallback only)
```

## Phase tracker
Phases are explicit so sessions stay scoped. Move work to the next phase if it would blow the budget.

**Phase 1 — Foundation:** done.

**Phase 2 — Content systems (done, minus blog):**
- ~~MDX blog~~ — removed; no admin/CMS planned, owner doesn't want to maintain MDX manually either.
- Contact form → `/api/contact` → Resend ✓
- Dynamic OG image for `/` ✓
- ~~RSS feed~~ — removed with blog.

**Phase 3 — Deploy:** superseded by Vercel. The PM2/nginx files in `deploy/` remain as a fallback.

**Phase 4 — Redesign (Nov 2026):** done. Replaced the terminal look with "Delta night" (above): domain index with live-site screenshots, local fonts, new OG image and icons. No content was added; every string comes from `content/*.ts`.

## Conventions

**Components.** Default to **React Server Components**. Only mark `"use client"` on components that genuinely need interactivity (theme toggle, nav tracking, work index, palette, contact form). Server-rendered parts can be passed into client components as props (see `showcase.tsx`).

**Imports.** Use the `@/*` alias (configured in `tsconfig.json`).

**Content edits.** All copy lives in `content/*.ts`. Don't hard-code names/dates/links in components — pull from the data files. This is how the site gets edited later without re-finding everywhere a string appears. Section names live in `lib/sections.ts`.

**Layout.** Use the `.page` class for the page container (max width + side padding). Sections use `<Section name="…">`; rows inside them use `metaRow` (a narrow column for dates/years/labels, then content). Keep reading text under ~70ch.

**Styles.** Tailwind utilities with the tokens above (`bg-bg`, `bg-raised`, `border-line`, `text-fg`, `text-muted`, `bg-accent text-accent-fg`). Shared classes in `globals.css`: `.page`, `.btn` + `.btn-primary` / `.btn-quiet`, `.link`, `.tnum`.

**Project screenshots.** `public/work/{slug}.webp`, 1496×801 (the first screen of the live site at 1512×801), cropped to remove cookie banners. Photos of people on news sites are blurred before saving. Static files are served with an immutable one-year cache, so **give a replaced screenshot a new filename** and update `image` in `content/projects.ts`.

**Accessibility.** All interactive components keyboard-navigable; visible focus ring (`:focus-visible`, jute). The desktop preview is `aria-hidden` because the list carries the same facts. Hidden-on-desktop taglines use `lg:sr-only`, not `hidden`, so screen readers still get them. `prefers-reduced-motion` respected.

**SEO.** Every route exports `metadata` (or `generateMetadata`). Use `lib/seo.ts` helpers to build consistent OG/Twitter cards. Canonical URL is always `https://nurul.com.bd/...`.

## What NOT to do
- Don't add a CMS / admin panel.
- Don't reintroduce the blog (routes, MDX, RSS) without an explicit ask — it was deliberately removed.
- Don't add an animation library for effects CSS can do; keep motion to the single load moment.
- Don't load fonts from Google at runtime or build time.
- Don't add tests for this project (personal site, low blast radius). Type-check is the safety net.
- Don't change canonical domain or deploy target without updating this file.
- Don't `npm install` packages not in `package.json` casually — keep the dep list lean.

## How to run
```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # tsc --noEmit
npm run build        # production build
npm run start        # serve production build
```

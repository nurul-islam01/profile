# nurul.com.bd — Portfolio

Personal portfolio for **Nurul Islam** — Deputy Manager & Tech Lead at Navana Group.

Built with Next.js 15 (App Router) + TypeScript + Tailwind CSS. Opens on an index of the live sites he has built, with a screenshot preview of each. SEO-first. Deployed on Vercel.

> **Working with AI?** Read [`CLAUDE.md`](./CLAUDE.md) first — it has locked decisions, directory conventions, and the phase plan.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js ESLint |

## Where the content lives

All copy is in `content/*.ts` so edits are one file away:

- `content/profile.ts` — name, role, bio, socials (**source of truth**, imported everywhere)
- `content/experience.ts` — work history
- `content/projects.ts` — every site in the work index (screenshots in `public/work/`)
- `content/skills.ts` — grouped skill tree
- `content/awards.ts` — awards & activities
- `content/education.ts` — education

Don't hardcode names/dates/links in components — pull from these files.

## Environment

Copy `.env.example` → `.env.local` and fill in:

```env
NEXT_PUBLIC_SITE_URL=https://nurul.com.bd
RESEND_API_KEY=
CONTACT_TO_EMAIL=nurul.islam3f@gmail.com
CONTACT_FROM_EMAIL=contact@nurul.com.bd
```

## Project status

- **Phase 1 (done):** scaffold, content, all home-page sections, SEO basics, sitemap/robots, JSON-LD
- **Phase 2 (done):** Resend contact form, dynamic OG image (the blog was removed)
- **Phase 3:** superseded by Vercel; `deploy/` keeps an nginx + PM2 fallback
- **Phase 4 (done, Nov 2026):** redesign — work index with live-site screenshots, self-hosted fonts

See [`PLAN.md`](./PLAN.md) for the original task list.

## Deploy

- **Canonical:** `https://nurul.com.bd` (`www` redirects to it)
- **Hosting:** Vercel project `profile` — pushes to `main` go to production, other branches get preview URLs
- **DNS:** Cloudflare, records not proxied

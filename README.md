# nurul.com.bd — Portfolio

Personal portfolio for **Nurul Islam** — Deputy Manager & Tech Lead at Navana Group.

Built with Next.js 15 (App Router) + TypeScript + Tailwind CSS. Terminal-style aesthetic. SEO-first. Deploys to Ubuntu + nginx.

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
| `npm run start` | Serve production build (used by systemd in production) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js ESLint |

## Where the content lives

All copy is in `content/*.ts` so edits are one file away:

- `content/profile.ts` — name, role, bio, socials (**source of truth**, imported everywhere)
- `content/experience.ts` — work history
- `content/projects.ts` — featured projects
- `content/skills.ts` — grouped skill tree
- `content/awards.ts` — awards & activities
- `content/education.ts` — education

Don't hardcode names/dates/links in components — pull from these files.

## Environment

Copy `.env.example` → `.env.local` and fill in:

```env
NEXT_PUBLIC_SITE_URL=https://nurul.com.bd
RESEND_API_KEY=             # Phase 2
CONTACT_TO_EMAIL=nurul.islam3f@gmail.com
CONTACT_FROM_EMAIL=contact@nurul.com.bd
```

## Project status

- **Phase 1 (done):** scaffold, content, all home-page sections, SEO basics, sitemap/robots, JSON-LD
- **Phase 2:** MDX blog, Resend contact form, dynamic OG images
- **Phase 3:** systemd + nginx deploy config, deploy README

See [`PLAN.md`](./PLAN.md) for the detailed task list.

## Deploy target

- **Canonical:** `https://nurul.com.bd`
- **Mirror (301):** `nurul.dev` → `nurul.com.bd`
- **Server:** Ubuntu + nginx reverse proxy → `next start` under systemd

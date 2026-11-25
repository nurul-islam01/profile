# CLAUDE.md

Guidance for AI coding agents working on this repo. Keep this file accurate — update it as decisions change.

## Project
Personal portfolio for **Nurul Islam** — Deputy Manager & Tech Lead at Navana Group. Replaces an older portfolio served at both `nurul.dev` and `nurul.com.bd`. Source of truth for content is `Nurul_Islam_CV.pdf` in this directory.

## Locked decisions
| Topic | Decision |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 + TypeScript strict |
| Styling | Tailwind CSS v3.4. Colour tokens are RGB-channel CSS variables in `app/globals.css` (`bg`, `raised`, `line`, `fg`, `muted`, `faint`, `accent`, `accent-fg`, `danger`), so opacity modifiers work (`text-fg/50`). No typography plugin. |
| Fonts | Self-hosted with `next/font/local` (files + OFL licences in `app/fonts/`): **Schibsted Grotesk** (variable 400–900) for names, headings and UI; **Newsreader** for reading text (hero headline, bio). Nothing is fetched from Google Fonts, so builds work offline. The `.woff` files are for the OG image (Satori can't read woff2). |
| Motion stack | **GSAP** (ScrollTrigger, SplitText — free since 3.13) + **Lenis** smooth scrolling (wheel/trackpad only; touch stays native) + **raw WebGL1** for the two shaders (no three.js). GSAP's ticker drives Lenis so they share one clock. |
| Motion inventory | First-visit loader with a real progress count (mouse devices only, once per tab session) → hero letters rise; hero name thickens near the cursor (variable `wght`); "night water" flow shader behind the hero; work rows float a WebGL preview (wave + RGB split + wipe between projects) beside the pointer; split-text reveals on section titles; scroll-lit bio; timeline rail that fills with scroll; velocity marquee for skills; magnetic buttons; custom cursor. |
| Motion rules | Every effect has a `prefers-reduced-motion` path where content is simply there (no loader, no Lenis, no shader animation, inline images). Phones/touch: no loader, no cursor, no hover previews — featured rows show images inline. Text never sits below 3:1 contrast in any animated state (the bio animates a `--p` colour mix from `faint` to `fg`, not opacity). |
| Performance budget | LCP < 2.5 s on a throttled phone (measured ~0.9 s at 4× CPU on slow 4G: the hero headline paints first, letters rise after hydration). Shaders render at reduced resolution, pause off-screen and in hidden tabs; hover previews load their textures only after the page is idle. Home first-load JS ≈ 210 kB. |
| Theming | `next-themes`, dark default, system-preference detection **disabled** (every visitor sees dark on first load), user toggle still works. Shaders read colours from the tokens and follow theme changes. |
| Visual style | **"Delta night"**: river-night blue `#0F1626` with a jute-gold accent `#E3B24C` (`#8F6100` in light theme). Jute marks only "you are here" and the primary action. Display type is huge and tight (name, section titles); reading text stays under ~70ch. Avoid: ALL-CAPS labels, monospace labels, middle-dot meta strings, `→` appended to text, gradient heroes. |
| Project images | Navana sites: screenshots in `public/work/{slug}.webp` (1496×801). News sites (Prothom Alo group): **brand cards** — the site's name, address and colours (`brand` in `content/projects.ts`), never screenshots, because their first screens are full of photos of people. Logos are not copied; cards are typographic. |
| Blog | **Removed.** No blog routes, no MDX pipeline, no `content/posts/`. Don't reintroduce without explicit ask. |
| Contact form | Real backend via **Resend** (`/api/contact`). Not mailto. Env vars: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. |
| Deploy target | **Vercel** (project `profile`): pushes to `main` deploy to production; other branches get preview deployments. `nurul.com.bd` + `www` point at Vercel via Cloudflare DNS (grey cloud); `www` 308-redirects to the apex. The `deploy/` folder keeps the earlier Ubuntu + nginx + PM2 setup as a fallback; it is not what serves the site today. |
| Canonical domain | **`nurul.com.bd`**. `nurul.dev` lapsed in Nov 2026, so it is no longer linked anywhere (not in `sameAs`, not in the README). |
| SEO | First-class. Metadata API, sitemap, robots, JSON-LD Person/WebSite schema, dynamic OG image via `next/og` (`app/opengraph-image.tsx`). |
| Admin panel | None. Content is in TypeScript files (`content/*.ts`). |

## Directory map
```
app/
  layout.tsx          root: boot script (js / loader / failsafe classes), fonts, theme, loader, Lenis, nav, footer, palette, cursor, JSON-LD
  page.tsx            Hero → Work → Experience → About → Skills → Education & Awards → Contact
  globals.css         tokens, loader, cursor, work-list blend rules, brand cards, reduced motion
  fonts/              self-hosted woff2 (site) + woff (OG image) + OFL licences
  icon.svg, apple-icon.png, opengraph-image.tsx, api/contact/, sitemap.ts, robots.ts
components/
  hero.tsx            kinetic name + entrance (waits for the loader) + CTAs
  section.tsx         <Section name="…"> with a display title that splits in on scroll
  motion/             preloader, smooth-scroll (Lenis), cursor, magnetic, reveal (SplitReveal, ScrubWords, MediaReveal, FadeUp, ScrollLine), marquee
  webgl/flow-field.tsx  hero shader
  work/               work-list (rows + hover handling), hover-media (WebGL class), brand-card (DOM)
  sections/           work, experience, about, skills, education-awards, contact (+ contact-form)
  nav.tsx, footer.tsx, local-time.tsx, command-palette.tsx, theme-toggle.tsx, toaster.tsx, theme-provider.tsx
content/              profile, experience, projects (with `image` or `brand`), skills, awards, education
lib/
  motion.ts           app-ready signal, reduced-motion / fine-pointer checks, scrollToSection, colour tokens for shaders
  gsap.ts             registers ScrollTrigger, SplitText, useGSAP once
  gl.ts               WebGL helpers + simplex noise GLSL
  brand-card.ts       paints a brand card to a canvas (WebGL texture)
  sections.ts, domain.ts, fonts.ts, cn.ts, seo.ts, contact.ts
public/               portrait.webp, me.jpg, resume.pdf, work/*.webp (Navana screenshots)
deploy/               PM2 ecosystem + nginx + deploy script + README (fallback only)
```

## Phase tracker
**Phase 1 — Foundation:** done. **Phase 2 — Content systems:** done (blog and RSS removed). **Phase 3 — Deploy:** superseded by Vercel; `deploy/` kept as a fallback.

**Phase 4 — Redesign (Nov 2026):** done in two steps. A first, quiet version was rejected by the owner as too plain; the current version is the animated one described above. No content was added; every string comes from `content/*.ts`.

## Conventions

**Components.** Default to **React Server Components**. Mark `"use client"` only where needed (motion, WebGL, nav tracking, palette, form). Client motion components take server-rendered children.

**Motion code.** Use `useGSAP` (from `lib/gsap.ts`) so tweens and ScrollTriggers are reverted on unmount. Check `prefersReducedMotion()` first in every effect. Anything visible before hydration that will animate needs a CSS pre-hide gated on `html.js:not([data-ready="true"])` plus the same start state in GSAP (set `y: 0` alongside `yPercent` so GSAP doesn't absorb the CSS transform).

**WebGL.** WebGL1, GLSL 100. Uniforms shared by vertex and fragment shaders need the same declared precision. Render loops go through `gsap.ticker` and must stop when nothing is visible.

**Imports.** Use the `@/*` alias.

**Content edits.** All copy lives in `content/*.ts`; section names in `lib/sections.ts`. Don't hard-code names/dates/links in components.

**Layout.** `.page` for the page container. Sections use `<Section name="…">`.

**Project screenshots.** Static files are cached immutably for a year, so **give a replaced screenshot a new filename** and update `image` in `content/projects.ts`.

**Accessibility.** Keyboard reachable everything; jute focus ring. Decorative motion layers (shader, previews, marquee, cursor) are `aria-hidden`; the scroll-lit bio has a plain screen-reader copy. Run axe in both themes after visual changes (0 violations at last check).

**SEO.** Every route exports `metadata`. Canonical URL is always `https://nurul.com.bd/...`.

## What NOT to do
- Don't add a CMS / admin panel, or reintroduce the blog without an explicit ask.
- Don't add three.js or another 3D library for effects the raw WebGL code already covers.
- Don't ship a motion feature without its reduced-motion and touch behaviour.
- Don't put screenshots of news pages (photos of people) or copied logos in `public/`.
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

# Cleanship Marine Services

Two applications, deployed independently.

```
frontend/   Next.js 15 marketing site — statically prerendered, SEO-first
backend/    Express + Drizzle API on Neon Postgres — enquiries, content, admin
```

They share no code at runtime. Each has its own `package.json`, `node_modules`,
build and deploy.

## Running both

```bash
# terminal 1 — the site
cd frontend && npm install && npm run dev        # http://localhost:3000

# terminal 2 — the API
cd backend && npm install
cp .env.example .env                             # DATABASE_URL + JWT_SECRET
npm run db:migrate && npm run db:seed
npm run dev                                      # http://localhost:4000
```

Setup details are in [frontend/README.md](frontend/README.md) and
[backend/README.md](backend/README.md).

## ⚠️ Deployment: the Vercel root directory changed

The site used to live at the repository root and now lives in `frontend/`.
**The existing Vercel project will fail to build until you update it:**

> Project → Settings → General → **Root Directory** → `frontend`

Nothing else about the deployment changes. The API is a separate service and
needs its own host (Render, Railway, Fly, or a second Vercel project) — it is a
long-running Express process, not serverless functions.

## Current state

- The site renders from its own typed taxonomy in
  `frontend/src/lib/services.ts`. **It does not call the API yet** — see the
  integration notes at the end of `backend/README.md`, and mind the warning
  there about keeping pages statically prerendered.
- Contact forms send email through Resend. Once the API is wired in, the
  database becomes the record and email stays the notification.

## SEO

Implemented and verified against the running build:

| Area | State |
| --- | --- |
| Rendering | All 41 routes statically prerendered; no client-side data fetching |
| Titles | All ≤ 60 chars incl. the `\| Cleanship` suffix |
| Descriptions | All ≤ 162 chars |
| Canonicals | Absolute, no trailing-slash duplicates |
| Headings | Exactly one `<h1>` per page, no level skips |
| Structured data | Organization + LocalBusiness, WebSite, BreadcrumbList, Service, FAQPage, ItemList, ContactPage, **plus one LocalBusiness per office (8)** |
| FAQs | 130+ questions across 10 pages, in the DOM *and* as `FAQPage` schema |
| Sitemap | 31 URLs with 25 `<image:image>` entries for Google Images |
| Social | Per-page `og:image` — each service previews as itself |
| Icons | favicon.ico, icon.png, apple-icon.png, webmanifest |
| robots.txt | Allow-all with sitemap + host; 404 is `noindex, follow` |

### Still worth doing (needs your input or access)

1. **Submit the sitemap** in Google Search Console and validate with the Rich
   Results Test once the domain is live.
2. **Set up a Google Business Profile** for each of the eight bases. The
   `LocalBusiness` nodes give search engines the structure, but only a
   verified profile earns a map pack listing — and the branch nodes carry no
   coordinates because inventing a pin is worse than omitting one.
3. **Fix or remove `siteConfig.social`** — those handles are assumed. `sameAs`
   pointing at profiles that do not exist is worse than omitting it.
4. **Publish real case studies.** `/projects` is placeholder, so it currently
   earns nothing.
5. **Consider a blog.** The competitor structure you referenced uses
   port-specific posts ("UWILD survey in Khalifa Port"). There is no blog
   route yet — that is the largest remaining organic-traffic opportunity.
6. **Bundle weight**: home and service routes carry ~193 kB of JS from GSAP +
   Motion. It does not affect LCP (pages are static HTML) but it does affect
   TBT/INP. Worth a Lighthouse run on the real deployment.

## Known gaps

- `frontend/scripts/compress-videos.sh` has **no source footage to run
  against** — the `videos/` masters were removed from the repo. The compressed
  output in `frontend/public/videos` and the posters still ship fine; restore
  the masters before re-encoding.
- **All photography is placeholder stock** (`frontend/public/images`, mapped in
  `frontend/src/lib/stock-images.ts`). Unsplash licence — free commercially, no
  attribution needed — downloaded and self-hosted, never hot-linked. Two
  caveats: they show real, named third-party vessels (unavoidable with marine
  stock), so they are used only as scrimmed hero backdrops where names are not
  legible, and they must never be presented as Cleanship's own work or
  clients. Replace with real photography when available; the source URL for
  each is recorded in that file.
- `frontend/src/app/projects/page.tsx` still uses `PLACEHOLDER_PROJECTS`.
  Illustrative scope patterns, not real contracts — replace before launch.
- Statistics on the home and about pages are indicative, not audited.
- Two supplied addresses need confirming (Colombo, Dammam) — flagged in
  `frontend/src/lib/site.ts`.
- The brand source images at the repo root (`Untitled design (9).png`,
  `cropped-Logos-…webp`) are the originals the logo and favicons were derived
  from. Nothing imports them; keep or archive them as you prefer.

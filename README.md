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
| Rendering | All 633 routes statically prerendered; no client-side data fetching |
| Titles | All ≤ 60 chars incl. the `\| Cleanship` suffix |
| Descriptions | All ≤ 162 chars |
| Canonicals | Absolute, no trailing-slash duplicates. Every page self-canonicalises except `/underwater-hull-cleaning` — see below |
| Headings | Exactly one `<h1>` per page, no level skips |
| Structured data | Organization + LocalBusiness, WebSite, BreadcrumbList, Service, FAQPage, ItemList, ContactPage, **plus one LocalBusiness per office (8)** |
| FAQs | 4,091 questions across 610 pages, in the DOM *and* as `FAQPage` schema |
| Sitemap | 620 URLs with 607 `<image:image>` entries for Google Images |
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
5. **Consider a blog.** There is no blog route yet. The port programme below
   now covers port-specific landing intent for hull cleaning; a blog would add
   the informational layer above it, and extend the pattern to hold and tank
   cleaning.
6. **Bundle weight**: home and service routes carry ~193 kB of JS from GSAP +
   Motion. It does not affect LCP (pages are static HTML) but it does affect
   TBT/INP. Worth a Lighthouse run on the real deployment.

## Port programme

The largest thing on the site. **583 generated port pages** across two regions
and three service lines, plus six region hubs, all from one root `[portPage]`
route:

```
/hull-cleaning-in-india                      region hub, one line
/hold-cleaning-in-uae
/hull-cleaning-in-kandla-port                port hub, one line
/underwater-hull-cleaning-in-kandla-port     one scope at one port
/cargo-hold-cleaning-in-kandla-port
/tanker-tank-cleaning-in-kandla-port
```

| | India | UAE |
| --- | --- | --- |
| Ports | 33 | 13 |
| Hull cleaning | 33 ports × 5 scopes | 13 × 5 |
| Hold cleaning | 32 ports × 3 scopes | 13 × 3 |
| Tank cleaning | 20 ports × 4 scopes | 4 × 4 |

### Where it lives

```
src/lib/ports/types.ts      Port shape, cargo classification, line gating
src/lib/ports/india.ts      33 ports
src/lib/ports/uae.ts        13 ports
src/lib/ports/brazil.ts     33 ports, LIST ONLY — no landing pages
src/lib/ports/lines.ts      3 lines, 12 scopes, all port-aware copy builders
src/lib/ports/registry.ts   regions, route registry, titles, FAQs, facts
src/app/[portPage]/page.tsx renders all three page kinds
```

Add a port to a region file and it is routed, linked, sitemapped and
schema-marked — no other file to touch. The build throws on a duplicate slug
rather than letting one page silently shadow another.

### Five things to know before extending it

1. **These pages self-canonicalise.** That is the whole point. The location
   pages they replace set `canonicalPath` to their parent service page, which
   told Google to consolidate the signal there and drop the location page —
   correct for a thin page, and the exact opposite of what a page meant to
   rank needs. A page that canonicalises away cannot rank for its own term.

2. **The legacy URLs are 301s, not deletions.** `next.config.ts` maps all
   twelve old location URLs onto their replacements. Do not remove those
   entries — the old URLs may be linked from agent emails, directories and
   quotes long after the pages are gone. (`/hold-cleaning-in-kakinada-port`
   is absent on purpose: the generated page took over that exact URL.)

3. **Lines are gated on cargo, not hand-flagged.** `linesFor()` derives them
   from the port's cargo list, so a pure ore anchorage never generates a tank
   cleaning page. `/tank-cleaning-in-belekeri-port` 404s by design. Use
   `lineOverrides` where the cargo list misleads — Jakhau has hold cleaning
   turned off for exactly that reason.

4. **Each line has its own framing, and must keep it.** Hull cleaning is a
   diving job: visibility, tidal stream, swell, the permit to dive. Hold and
   tank cleaning are not: cargo residue, discharge sequence, waste reception,
   enclosed-space entry, and in the Gulf, working temperature. `port.conditions`
   is written about diving and renders on hull pages only — an earlier cut put
   underwater visibility copy above a list of cargo hold scopes, which is the
   tell of a generated site. `workingConditions()` exists to prevent that.

5. **No sentence appears twice on a page.** Verified at 0 across all 633
   routes. Shared paragraphs are allocated to exactly one slot each —
   `methodNote` to the planning section, `windowAnswer` to the FAQ,
   `supervisionNote` to the delivery step — because an earlier version printed
   the same paragraph up to four times on one page. If you add a builder,
   check it against that rule.

### The quality bar, in numbers

Measured against the built output, over the 583 port pages:

| | |
| --- | --- |
| Unique titles / descriptions / canonicals | 583 / 583 / 583 |
| Titles ≤ 60 chars incl. brand suffix | all |
| Descriptions ≤ 162 chars | all |
| One `<h1>`, no heading level skips | all |
| BreadcrumbList + Service + FAQPage schema | all |
| Words per page | 1,315 min · 2,139 median |
| Unique body text vs a sibling port | ~360 words median |
| Repeated sentences within a page | 0 |

That ~360-word figure is the one that matters. Several hundred pages that
differ only by a find-and-replace on the port name is a doorway-page pattern
and Google treats it as one. What holds these up is the hand-written per-port
data — working conditions, permitting authority, cargo and vessel profile,
seasonal window, expected findings, and hold/tank notes for every port that
has those lines. **Adding a port with templated filler puts the whole set at
risk, not just the new page.**

### Deliberate exceptions

- **`/underwater-hull-cleaning`** still canonicalises to
  `/services/hull-cleaning/underwater-hull-cleaning`. That is correct: it is a
  true duplicate of the service page — same title, same description, same
  content — so consolidating is right and there is no port-specific content to
  make it its own page. Everything else on the site self-canonicalises.
- **`/hold-cleaning-at-port`** and **`/hold-cleaning-at-sea`** no longer
  canonicalise away. They target situational queries the service pages do not
  ("hold cleaning at sea" vs "Hold Cleaning Riding Crew"), so they now compete
  on their own.
- **Brazil has one country page, not 33 port pages.** We do not have the
  operational depth per Brazilian port that the India and UAE sets have, and
  publishing 33 pages of filler would endanger the whole programme. See the
  note at the top of `frontend/src/lib/ports/brazil.ts`.

### What it still needs

**Photographs and completed-job records per port.** The pages are honest about
scope and conditions but carry no evidence of work actually done at these
ports. That is the single biggest upgrade available and the one thing
competitors cannot copy. Both drop into the port data files and every page
picks them up.

**Confirm the coverage claims.** `serviceCoverage["underwater-hull-cleaning"]`
and `categoryCoverage["hull-cleaning"]` in `lib/site.ts` now lead with India
and the UAE — publishing 583 port pages while the coverage note said West
Africa only would have contradicted the site's own content. Check it is
accurate before launch.

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

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
| Rendering | All 884 routes statically prerendered; no client-side data fetching |
| Titles | All ≤ 60 chars incl. the `\| Cleanship` suffix |
| Descriptions | All ≤ 162 chars |
| Canonicals | Absolute, no trailing-slash duplicates. Every indexable page self-canonicalises |
| Headings | Exactly one `<h1>` per page, no level skips |
| Structured data | Organization + LocalBusiness, WebSite, BreadcrumbList, Service, FAQPage, ItemList, ContactPage, **plus one LocalBusiness per office (8)** |
| FAQs | 5,690 questions, in the DOM *and* as `FAQPage` schema |
| Sitemap | 223 URLs — indexable pages only. See the indexation policy below |
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
3. ~~**Fix or remove `siteConfig.social`**~~ — done. The four live profiles
   (LinkedIn, Instagram, Facebook, YouTube) are in `siteConfig.social` and feed
   both the footer icons and `sameAs` in the Organization schema. Adding a
   profile there is the only step needed; both surfaces pick it up.
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

The largest thing on the site. **~800 generated port pages** across five
regions and three service lines, plus fifteen region hubs, all from one root
`[portPage]` route:

```
/hull-cleaning-in-india                      region hub, one line
/hold-cleaning-in-west-africa
/hull-cleaning-in-kandla-port                port hub, one line
/underwater-hull-cleaning-in-kandla-port     one scope at one port
/cargo-hold-cleaning-in-kandla-port
/tanker-tank-cleaning-in-kandla-port
```

| Region | Ports | Base |
| --- | --- | --- |
| India | 33 | Kandla, Visakhapatnam |
| UAE | 13 | Ajman (HQ), Fujairah, Khor Fakkan |
| West Africa | 10 | Conakry |
| Saudi Arabia | 5 | Dammam |
| Sri Lanka | 4 | Colombo |
| Brazil | 33 | — *(country page only, see below)* |

Every advertised office now has port pages behind it and its own
`/locations/{city}` page carrying a `LocalBusiness` node.

### Where it lives

```
src/lib/ports/types.ts      Port shape, cargo classification, line gating
src/lib/ports/india.ts      33 ports
src/lib/ports/uae.ts        13 ports
src/lib/ports/west-africa.ts 10 ports
src/lib/ports/saudi.ts       5 ports
src/lib/ports/sri-lanka.ts   4 ports
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

### Indexation policy — read this before adding pages

**461 of the 583 port pages are `noindex, follow`.** That is deliberate and it
is reversible with one flag.

Six URLs per port were competing for one query. Someone searching "hull
cleaning Kandla" could land on the line hub or any of five scope pages, all
carrying the same facts table, the same working-conditions section and a
near-identical FAQ block. Google picks one and largely ignores the rest — and
on a domain with no authority behind it, it may index none.

| | Indexable | In sitemap |
| --- | --- | --- |
| Region hubs (`/hull-cleaning-in-india`) | yes | yes |
| Port line hubs (`/hull-cleaning-in-kandla-port`) | yes | yes |
| Scope pages (`/propeller-polishing-in-kandla-port`) | **no** | no |

Scope pages stay live, stay linked and still pass signal up to their hub —
`follow`, never `nofollow`. They just stop competing with it. That takes the
indexable set from ~600 to ~140, which is a sensible number for this domain's
authority today.

**To reverse:** flip `INDEX_SCOPE_PAGES` in `lib/ports/registry.ts`. Do it once
Search Console shows the hubs earning impressions — or sooner, if the Pages
report shows the scope pages were indexing cleanly all along. To let just one
scope back in (UWILD is the obvious candidate — distinct query, own
vocabulary, buyers search it by name), add its `urlPrefix` to `ALWAYS_INDEX`
rather than flipping the whole set.

### Redirects — do not delete these

`next.config.ts` holds three groups, all 301 (Next emits 308, which Google
treats identically):

1. **The previous Next.js location pages** — twelve thin URLs that
   canonicalised away.
2. **The WordPress site** — `/service/{slug}/`, `/contact-us/`, old location
   posts. These are the URLs Google still holds and that directories and agent
   emails link to. **This list is incomplete and cannot be completed from the
   repo** — export the full set from Search Console (Pages report, last 16
   months) and add whatever is missing. Do not rebuild it from memory.
3. **Flat service URLs** — `/underwater-hull-cleaning`,
   `/hold-cleaning-at-port`, `/hold-cleaning-at-sea` now 301 into the nested
   hierarchy. One URL per service.

Trailing-slash legacy URLs resolve in two hops (Next normalises the slash,
then the redirect fires). Verified end-to-end.

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

## Other content routes

| Route | What it is | Gate |
| --- | --- | --- |
| `/ports` | Crawl hub for the whole port network, linked from main nav | — |
| `/locations` + `/locations/{city}` | One `LocalBusiness` page per operating base | — |
| `/projects` + `/projects/{slug}` | Case studies, one URL each | `real: false` ⇒ **noindex** |
| `/insights` + `/insights/{slug}` | Editorial. Replaces the deleted WordPress blog | — |

**`/projects/{slug}` is gated on `project.real` in `lib/projects.ts`.** Every
entry is currently `false`, so the detail pages are `noindex, follow` and stay
out of the sitemap — nothing invented reaches the index. Flip the flag when a
real write-up replaces one and it becomes indexable automatically. Add `port`
and `date` at the same time; the template already renders them.

**`/insights` has two posts and needs more.** They are process explainers that
deliberately name no class society, no certification, no client and no cost
figure, because none of those can be verified from the repo. The posts that
actually earn links are the ones only the operations desk can write — see the
list at the top of `lib/insights.ts`. Two a month is enough, and they should
be attributed to a named person rather than to the company.

## Title and description lengths

`buildMetadata` clamps both, on a word boundary, never mid-word and never on a
dangling connective. This is enforced centrally on purpose: titles and
descriptions are assembled from free text in several generated templates, and
a template that fits one entry overflows for the next. Verified at 0 overflows
across all 884 routes.

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

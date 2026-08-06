# Cleanship Marine Services — Website

Marketing site for Cleanship Marine Services FZE, built with Next.js 15 (App
Router), TypeScript and Tailwind CSS v4. SEO is the primary architectural
driver: every page is statically prerendered, and the service taxonomy is the
single source that drives routing, navigation, the sitemap and structured data.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Development server                        |
| `npm run build`     | Production build (prerenders all pages)   |
| `npm start`         | Serve the production build                |
| `npm run lint`      | ESLint                                    |
| `npm run typecheck` | `tsc --noEmit`                            |

## How the content is organised

Almost all editable content lives in two files:

- **`src/lib/site.ts`** — company name, address, phone numbers, email, licence,
  opening hours, social links, ports served, main navigation.
- **`src/lib/services.ts`** — the full service taxonomy (5 categories, 21
  services) with SEO titles, meta descriptions, body copy, scope, process,
  vessel types and FAQs.

Adding a service to `services.ts` automatically gives it a page, a mega-menu
entry, footer links, sitemap inclusion, breadcrumbs and `Service` structured
data. There is no second place to register it.

### Service structure

```
Hold Cleaning      → Shore Gang · Riding Crew · Rope Access
Tank Cleaning      → Oil Tanker DPP & CPP · Demucking · Shore Tank Cleaning
                     · Offshore Vessel Tank Cleaning
Hull Cleaning      → Underwater Hull Cleaning · Thruster Cleaning & Polishing
                     · Propeller Super Polishing · In-Water Class Survey · UWILD
Offshore Services  → Offshore Support Vessel Services · Rig & Platform Cleaning
                     · Void Space & Cofferdam Cleaning · Offshore Riding Squad
NDT & Repair       → NDT Inspection · Remote Inspection Technology
                     · Riding Fabricator · Hydroblasting · Marine Painting
```

## SEO implementation

| Area              | Where                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| Metadata builder  | `src/lib/seo.ts` — canonical URL, OG and Twitter cards in one place    |
| Structured data   | `Organization` + `LocalBusiness`, `WebSite`, `BreadcrumbList`, `Service`, `FAQPage`, `ItemList`, `ContactPage` |
| Sitemap           | `src/app/sitemap.ts` — generated from the taxonomy (31 URLs)           |
| Robots            | `src/app/robots.ts`                                                   |
| Social card       | `src/app/opengraph-image.tsx` — generated at build time                |
| Rendering         | Every route is static (SSG); no client-side data fetching              |

Structural rules the codebase holds to:

- Exactly one `<h1>` per page, with a correct heading hierarchy beneath it.
- FAQs use native `<details>`/`<summary>`, so answers are in the initial HTML
  and pair correctly with the `FAQPage` schema.
- Scroll animations are progressive enhancement only. An inline script sets
  `data-js="true"` before first paint, and the CSS hides `.reveal` elements
  only under that attribute — if JavaScript fails, all content stays visible.
- Every service is linked from the footer, giving each page a shallow crawl
  depth from anywhere on the site.

## ⚠️ Before you launch

1. **Set the real domain.** `siteConfig.url` in `src/lib/site.ts` is
   `https://www.cleanship.co`. Canonicals, the sitemap and OG URLs all derive
   from it.
2. **Add the Resend credentials.** Email delivery is implemented
   (`src/lib/email.ts`) but needs environment variables — copy `.env.example`
   to `.env.local` and fill in `RESEND_API_KEY`. **You must also verify the
   sending domain** in the Resend dashboard (Domains → Add Domain → add the
   DKIM/SPF records to your DNS). Resend rejects sends from unverified
   domains; this is the most common reason a form works locally but not in
   production. Without the key the form shows an error and tells the user to
   email directly — it never silently drops an enquiry.
3. **Replace the placeholder projects.** `src/app/projects/page.tsx` contains
   `PLACEHOLDER_PROJECTS` — illustrative scope patterns, not real contracts.
   Swap in genuine, permission-cleared case studies and delete the on-page
   notice below the grid.
4. **Confirm the Offshore service line.** Your brief listed group 4 (Offshore)
   with four unnamed sub-services. I filled them with industry-standard
   offshore scopes — review the names and copy in `services.ts` and correct
   anything that does not match what you actually sell.
5. **Replace the statistics.** The counters on the home and about pages
   (300+ clients, 1,200+ holds, 18+ ports) are indicative. Put your audited
   numbers in and remove the caption beneath each stat band.
6. **Verify the address coordinates.** `siteConfig.address.latitude/longitude`
   are approximate for Ajman Free Zone. Use the exact pin from your Google
   Business Profile so the `LocalBusiness` schema matches.
7. **Check the social URLs.** `siteConfig.social` contains assumed handles.
   Correct or remove them — `sameAs` pointing at non-existent profiles is worse
   than omitting it.
8. **Add photography.** The site is currently illustration- and
   gradient-driven, which looks deliberate but real vessel and crew photos will
   convert better. Use `next/image` so they are served as AVIF/WebP.
9. **Post-deploy:** submit the sitemap in Google Search Console, validate the
   structured data with the Rich Results Test, and set up a Google Business
   Profile for the Ajman address.

## Contact form email

Submitting the form sends **two** emails through Resend (`src/lib/email.ts`):

| Email | To | Purpose |
| --- | --- | --- |
| Notification | `ENQUIRY_TO_EMAIL` (default `ops@cleanship.co`) | The enquiry, with `replyTo` set to the enquirer so replying just works |
| Acknowledgement | The enquirer | Confirms what they sent, with the operations-desk number |

Only the **notification** is allowed to fail the submission. If the company
copy fails the enquiry is genuinely lost and the user is told. If only the
acknowledgement fails, the lead is safe — that failure is logged and
swallowed rather than sending the user away over a confirmation email.

All user input is HTML-escaped before it reaches the email body, and
newlines are stripped from anything used in a subject line (header
injection).

## Motion

`gsap` + `motion` (Framer Motion). The split between them is deliberate and
documented at the top of `src/lib/motion.ts`:

- **GSAP + ScrollTrigger** — anything that reveals indexable content.
  `gsap.from()` writes nothing into the server HTML, so content is present and
  visible with JavaScript disabled.
- **Motion** — menus, hover, gestures and state transitions, where the initial
  state hides nothing a crawler needs. Motion renders its `initial` prop into
  the SSR HTML as an inline style, which is why it is kept away from body copy.

Rules the code holds to (see the global `web-motion` skill for the full set):

- **The hero `<h1>` is never animated** — it is the LCP element.
- Only `transform` and `opacity` are animated, so nothing triggers layout.
- `prefers-reduced-motion` is honoured in every motion component.
- Every GSAP effect is created inside `gsap.context()` and reverted on unmount.
- `ScrollTrigger.refresh()` runs on route change (`ScrollTriggerRefresh` in the
  layout), because ScrollTrigger caches document height.
- No scroll-jacking.

Motion adds ~86 kB to the home and service routes. Pages remain static HTML,
so LCP and FCP are unaffected; the cost lands on TBT.

## Design system

The site implements the **CleanShip Design System** in `cleanship design system/`.
Its tokens are mirrored into the `@theme` block of `src/app/globals.css` so
Tailwind utilities compile from the same values the DS defines. Add tokens
there first — never invent a colour, radius or duration in a component.

| Ramp | Role |
| --- | --- |
| `navy-600` → `navy-900` | Section bands, footer, CTA, photo scrims |
| `blue-50` → `blue-600` | Buttons, links, eyebrows, index numbers, tint panels |
| `aqua-200/500/600` | Rationed accent — 3px rules, active nav, counter `+` |
| `ink-*`, `slate-*`, `line-*`, `paper` | Cool neutrals, never warm |

Type is **Barlow Condensed** (display, uppercase), **Barlow** (body) and
**IBM Plex Mono** (spec figures, counters, phone numbers), loaded via
`next/font`. All three are flagged in the DS as substitutions for the
brochure's industrial sans — replace them if licensed faces arrive.

### House rules the code enforces

These are the DS constraints most easily broken by a future change:

- **Light-first.** White or `paper` for content; solid navy for bands only.
  Max two background colours per page.
- **No decorative gradients, no backdrop blur, no frosted glass, no blurred
  blobs.** The only gradients permitted are the navy photo scrims.
- **Near-square corners** — 2px default; pills only for badges.
- **Cards rest flat.** Shadow and a -2px lift appear on hover only, because
  elevation signals interaction, not hierarchy.
- **Motion is short and flat** — 140ms colour, 220ms surfaces, 700ms photo
  scale. No bounce, spring, parallax or animated counters.
- **Any navy surface must carry the `on-navy` class.** It flips headings to
  white and switches the focus ring to aqua. Headings set their own colour, so
  an inherited `text-white` alone is not enough.
- Motion respects `prefers-reduced-motion` throughout.

**Not yet implemented:** the DS is photography-driven and no imagery was
supplied, so `PhotoFrame` and the full-bleed vessel photography it expects are
absent. The home hero uses the brochure's other device — a numbered contents
index — in that slot.

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
2. **Wire up the contact form.** `src/app/contact/actions.ts` currently
   validates and logs enquiries but **does not deliver them**. Implement
   `deliverEnquiry()` with Resend, SendGrid, SES, SMTP or a CRM webhook — a
   worked example is in the file's comments. Until this is done, form
   submissions go nowhere.
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

## Design system

Tokens are defined in the `@theme` block of `src/app/globals.css`:

- **Abyss** (`abyss-50` → `abyss-950`) — deep ocean navy, used for backgrounds
- **Aqua** (`aqua-50` → `aqua-950`) — the accent, the "clean water" signal
- **Sand** (`sand-300` → `sand-500`) — sparing warm emphasis

Fonts are Sora (display) and Inter (body), self-hosted via `next/font`.
Motion respects `prefers-reduced-motion` throughout.

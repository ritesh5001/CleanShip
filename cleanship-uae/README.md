# CleanShip UAE — cleanship.ae

The UAE site: underwater hull cleaning, propeller polishing, UWILD, hold and tank cleaning and remote inspection across UAE ports, with 12 port pages from Ruwais to Khor Fakkan.

One self-contained Next.js app — no backend, no database, no CleanTrack. Everything (pages,
SEO, the quote form) lives in this folder and deploys as a single project. The only outside
services are Resend (email) and Cloudflare Turnstile (the form's CAPTCHA). Company details and
office addresses are kept the same as every Cleanship site.

- `src/content/uae.ts`: everything specific to this site (copy, services, UAE ports, FAQs,
  SEO titles, brand name). Edit content here.
- `src/content/company.ts`: name, phones, email, socials, **all office addresses** and the
  BW Class certificate. Keep in step with `frontend/src/lib/site.ts` and `cleanship-greece/src/content/company.ts`.
- The quote form (`src/app/contact/actions.ts`) checks the honeypot, the Turnstile token, the
  fields and the spam rules in `src/lib/spam.ts`, then emails the enquiry to the office through
  Resend, with "cleanship.ae" in the subject. Spam is dropped without an email. There is no inbox or
  database — the email is the record.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3100
```

## Deploy on Vercel

New project from this repository, **Root Directory `cleanship-uae`**, framework Next.js. Attach
`www.cleanship.ae` and redirect the bare `cleanship.ae` to it.

Environment variables (see `.env.example`):

- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (must be on a Resend-verified domain — `sales@cleanship.ae`
  works, cleanship.co is not verified), `ENQUIRY_TO_EMAIL` (defaults to admin@cleanship.co)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`: add `cleanship.ae` to the Turnstile
  widget's hostnames in Cloudflare first
- `NEXT_PUBLIC_GA_ID`: optional GA4 property for this domain

## After going live

1. Add `cleanship.ae` to Google Search Console and submit `/sitemap.xml`.
2. The home pages of cleanship.co, cleanship.ae and cleanship.gr carry matching `hreflang` links.
   If a domain changes, update `sisterSites` here, in `cleanship-greece`, and in
   `frontend/src/app/page.tsx`.
3. Google Business Profile listings should match the UAE office addresses exactly (Ajman, Fujairah, Khor Fakkan).

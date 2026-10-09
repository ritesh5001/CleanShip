# CleanShip Greece — cleanship.gr

The site for Greek shipowners and technical managers: riding crews, hull cleaning, UWILD, tank cleaning and remote inspection at the ports where Cleanship has offices — the UAE, Saudi Arabia, India, Sri Lanka and Guinea.

One self-contained Next.js app — no backend, no database, no CleanTrack. Everything (pages,
SEO, the quote form) lives in this folder and deploys as a single project. The only outside
services are Resend (email) and Cloudflare Turnstile (the form's CAPTCHA). Company details and
office addresses are kept the same as every Cleanship site.

- **The site is in Greek** (`lang="el-GR"`). Industry terms Greek technical departments use in
  English (grain clean, off-hire, UWILD, riding crew) stay in English, port names stay in Latin
  script, and URLs stay English so links never break. The enquiry notification to the office stays
  in English; the acknowledgement to the customer is in Greek.
- `src/content/greece.ts`: everything specific to this site (copy, services, ports we serve, FAQs,
  SEO titles, brand name). Edit content here.
- `src/content/labels.ts`: Greek display text for facts that live in `company.ts` (country names,
  hours, the certificate wording, the WhatsApp greeting). `company.ts` itself stays English and
  identical across sites.
- Fonts are Fira Sans / Fira Sans Condensed via `next/font/google`, because Barlow (used on the
  other sites) has no Greek letters. They are downloaded at build time and self-hosted.
- `src/content/company.ts`: name, phones, email, socials, **all office addresses** and the
  BW Class certificate. Keep in step with `frontend/src/lib/site.ts` and `cleanship-uae/src/content/company.ts`.
- The quote form (`src/app/contact/actions.ts`) checks the honeypot, the Turnstile token, the
  fields and the spam rules in `src/lib/spam.ts`, then emails the enquiry to the office through
  Resend, with "cleanship.gr" in the subject. Spam is dropped without an email. There is no inbox or
  database — the email is the record.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3200
```

## Deploy on Vercel

New project from this repository, **Root Directory `cleanship-greece`**, framework Next.js. Attach
`www.cleanship.gr` and redirect the bare `cleanship.gr` to it.

Environment variables (see `.env.example`):

- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (must be on a Resend-verified domain — `sales@cleanship.ae`
  works, cleanship.co is not verified), `ENQUIRY_TO_EMAIL` (defaults to admin@cleanship.co)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`: add `cleanship.gr` to the Turnstile
  widget's hostnames in Cloudflare first
- `NEXT_PUBLIC_GA_ID`: optional GA4 property for this domain

## After going live

1. Add `cleanship.gr` to Google Search Console and submit `/sitemap.xml`.
2. The home pages of cleanship.co, cleanship.ae and cleanship.gr carry matching `hreflang` links.
   If a domain changes, update `sisterSites` here, in `cleanship-uae`, and in
   `frontend/src/app/page.tsx`.
3. Cleanship has no office in Greece. Do not create a Greek Google Business Profile listing, and do not add Greek ports to `places` unless real work is done there.

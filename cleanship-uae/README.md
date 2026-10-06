# CleanShip UAE — cleanship.ae

The UAE site: underwater hull cleaning, propeller polishing, UWILD, hold and tank cleaning and remote inspection across UAE ports, with 12 port pages from Ruwais to Khor Fakkan.

This is its own Next.js app with its own Vercel project. It shares nothing at runtime with
cleanship.co or cleanship.gr. Company details and office addresses are kept the same as every
Cleanship site.

- `src/content/uae.ts`: everything specific to this site (copy, services, UAE ports, FAQs,
  SEO titles, brand name). Edit content here.
- `src/content/company.ts`: name, phones, email, socials, **all office addresses** and the
  BW Class certificate. Keep in step with `frontend/src/lib/site.ts` and `cleanship-greece/src/content/company.ts`.
- Enquiries go to the same CleanTrack inbox as cleanship.co, with "(via cleanship.ae)" added to the
  service so you can tell them apart. They're also emailed through Resend.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3100
```

## Deploy on Vercel

New project from this repository, **Root Directory `cleanship-uae`**, framework Next.js. Attach
`www.cleanship.ae` and redirect the bare `cleanship.ae` to it.

Environment variables (see `.env.example`):

- `BACKEND_URL`: the Render API, the same one cleanship.co uses
- `ENQUIRY_FORM_KEY`: `HMAC-SHA256(SESSION_SECRET, "cleanship-enquiry-form")` in hex, so the
  session secret itself never has to be copied here:
  `S='<SESSION_SECRET>' node -e "console.log(require('crypto').createHmac('sha256',process.env.S).update('cleanship-enquiry-form').digest('hex'))"`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ENQUIRY_TO_EMAIL`: same as cleanship.co
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`: add `cleanship.ae` to the Turnstile
  widget's hostnames in Cloudflare first
- `NEXT_PUBLIC_GA_ID`: optional GA4 property for this domain

## After going live

1. Add `cleanship.ae` to Google Search Console and submit `/sitemap.xml`.
2. The home pages of cleanship.co, cleanship.ae and cleanship.gr carry matching `hreflang` links.
   If a domain changes, update `sisterSites` here, in `cleanship-greece`, and in
   `frontend/src/app/page.tsx`.
3. Google Business Profile listings should match the UAE office addresses exactly (Ajman, Fujairah, Khor Fakkan).

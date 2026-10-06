# CleanShip Greece — cleanship.gr

The site for Greek shipowners and technical managers: riding crews, hull cleaning, UWILD, tank cleaning and remote inspection at the ports where Cleanship has offices — the UAE, Saudi Arabia, India, Sri Lanka and Guinea.

This is its own Next.js app with its own Vercel project. It shares nothing at runtime with
cleanship.co or cleanship.ae. Company details and office addresses are kept the same as every
Cleanship site.

- `src/content/greece.ts`: everything specific to this site (copy, services, ports we serve, FAQs,
  SEO titles, brand name). Edit content here.
- `src/content/company.ts`: name, phones, email, socials, **all office addresses** and the
  BW Class certificate. Keep in step with `frontend/src/lib/site.ts` and `cleanship-uae/src/content/company.ts`.
- Enquiries go to the same CleanTrack inbox as cleanship.co, with "(via cleanship.gr)" added to the
  service so you can tell them apart. They're also emailed through Resend.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3200
```

## Deploy on Vercel

New project from this repository, **Root Directory `cleanship-greece`**, framework Next.js. Attach
`www.cleanship.gr` and redirect the bare `cleanship.gr` to it.

Environment variables (see `.env.example`):

- `BACKEND_URL`: the Render API, the same one cleanship.co uses
- `ENQUIRY_FORM_KEY`: `HMAC-SHA256(SESSION_SECRET, "cleanship-enquiry-form")` in hex, so the
  session secret itself never has to be copied here:
  `S='<SESSION_SECRET>' node -e "console.log(require('crypto').createHmac('sha256',process.env.S).update('cleanship-enquiry-form').digest('hex'))"`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ENQUIRY_TO_EMAIL`: same as cleanship.co
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`: add `cleanship.gr` to the Turnstile
  widget's hostnames in Cloudflare first
- `NEXT_PUBLIC_GA_ID`: optional GA4 property for this domain

## After going live

1. Add `cleanship.gr` to Google Search Console and submit `/sitemap.xml`.
2. The home pages of cleanship.co, cleanship.ae and cleanship.gr carry matching `hreflang` links.
   If a domain changes, update `sisterSites` here, in `cleanship-uae`, and in
   `frontend/src/app/page.tsx`.
3. Cleanship has no office in Greece. Do not create a Greek Google Business Profile listing, and do not add Greek ports to `places` unless real work is done there.

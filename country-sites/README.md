# cleanship.ae and cleanship.gr

Two country websites from one codebase. `SITE=ae` builds **cleanship.ae** (UAE ports and
operators); `SITE=gr` builds **cleanship.gr** (Greek shipowners and managers). The build
refuses to run without `SITE`.

- `src/content/uae.ts` and `src/content/greece.ts`: everything country-specific (copy, services,
  ports, FAQs, SEO titles). Edit content here.
- `src/content/company.ts`: name, phones, email, socials, **all office addresses**, and the BW Class
  certificate. Same on both sites and kept in step with `frontend/src/lib/site.ts`.
- Enquiries go to the same CleanTrack inbox as cleanship.co, with "(via cleanship.ae)" or
  "(via cleanship.gr)" added to the service so you can tell them apart. They're also emailed through Resend.

## Run locally

```bash
npm install
npm run dev:ae     # http://localhost:3100
npm run dev:gr     # http://localhost:3200
```

## Deploy: two Vercel projects, one folder

Create two projects in Vercel from this repository. For both, set **Root Directory** to `country-sites`.

| Project      | Domain                         | `SITE` |
|--------------|--------------------------------|--------|
| cleanship-ae | www.cleanship.ae (+ apex redirect) | `ae` |
| cleanship-gr | www.cleanship.gr (+ apex redirect) | `gr` |

Environment variables for each project (see `.env.example`):

- `SITE`: `ae` or `gr`
- `BACKEND_URL`: the Render API, the same one cleanship.co uses
- `ENQUIRY_FORM_KEY`: `HMAC-SHA256(SESSION_SECRET, "cleanship-enquiry-form")` in hex. This means
  the session secret itself never has to be copied into these projects:
  `S='<SESSION_SECRET>' node -e "console.log(require('crypto').createHmac('sha256',process.env.S).update('cleanship-enquiry-form').digest('hex'))"`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ENQUIRY_TO_EMAIL`: same as cleanship.co
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`: add `cleanship.ae` and `cleanship.gr`
  to the Turnstile widget's hostnames in Cloudflare first
- `NEXT_PUBLIC_GA_ID`: optional, one GA4 property per domain

## After going live

1. Add each domain to Google Search Console and submit `/sitemap.xml`.
2. Nothing to set for country targeting: .ae and .gr are country-code domains, so Google already
   ties them to their country.
3. Create Google Business Profile entries only for real offices. cleanship.gr has no Greek office
   and must not get a Greek listing.
4. The three home pages (cleanship.co, .ae, .gr) carry matching `hreflang` links. If a domain
   changes, update `src/content/uae.ts` / `greece.ts`, `src/content/site.ts`, and
   `frontend/src/app/page.tsx` together.

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

## Known gaps

- `frontend/scripts/compress-videos.sh` has **no source footage to run
  against** — the `videos/` masters were removed from the repo. The compressed
  output in `frontend/public/videos` and the posters still ship fine; restore
  the masters before re-encoding.
- `frontend/src/app/projects/page.tsx` still uses `PLACEHOLDER_PROJECTS`.
  Illustrative scope patterns, not real contracts — replace before launch.
- Statistics on the home and about pages are indicative, not audited.
- Two supplied addresses need confirming (Colombo, Dammam) — flagged in
  `frontend/src/lib/site.ts`.
- The brand source images at the repo root (`Untitled design (9).png`,
  `cropped-Logos-…webp`) are the originals the logo and favicons were derived
  from. Nothing imports them; keep or archive them as you prefer.

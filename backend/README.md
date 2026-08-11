# Cleanship API

Backend for [Cleanship Marine Services](../README.md). Express + TypeScript +
Drizzle ORM on Postgres (Neon).

Deploys **independently** of the site — separate process, separate host,
separate `node_modules`. The two share no code at runtime.

## Quick start

```bash
cd backend
npm install
cp .env.example .env          # fill in DATABASE_URL and JWT_SECRET

npm run db:generate           # build SQL migrations from the schema
npm run db:migrate            # apply them
npm run db:seed               # load the 5 categories / 21 services

npm run dev                   # http://localhost:4000
```

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### Create the first admin

`/api/auth/bootstrap` is guarded twice — it needs `ADMIN_BOOTSTRAP_TOKEN` **and**
refuses to run once any user exists, so leaving it mounted cannot become a
backdoor.

```bash
curl -X POST http://localhost:4000/api/auth/bootstrap \
  -H 'content-type: application/json' \
  -H "x-bootstrap-token: $ADMIN_BOOTSTRAP_TOKEN" \
  -d '{"email":"ops@cleanship.co","password":"a-long-passphrase","name":"Ops Desk"}'
```

Then remove `ADMIN_BOOTSTRAP_TOKEN` from the environment and add further staff
through `POST /api/auth/users`.

## Endpoints

`GET` content routes are public — the site builds its pages from them.
Everything else needs a session cookie.

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | – | Liveness + database reachability |
| POST | `/api/auth/bootstrap` | token | Create the first admin, once |
| POST | `/api/auth/login` | – | Sets the session cookie |
| POST | `/api/auth/logout` | – | Clears it |
| GET | `/api/auth/me` | session | Restore a session in the admin UI |
| POST | `/api/auth/users` | admin | Add staff |
| POST | `/api/enquiries` | – | Public form submission |
| GET | `/api/enquiries` | session | Inbox, newest first, `?status=&page=&perPage=` |
| GET | `/api/enquiries/:id` | session | One enquiry |
| PATCH | `/api/enquiries/:id` | session | Set `status` / `notes` |
| GET | `/api/enquiries/stats/summary` | session | Dashboard counters |
| GET | `/api/content/services` | – | Full taxonomy, nested, ordered |
| GET | `/api/content/services/:category/:service` | – | One service |
| GET | `/api/content/projects` | – | Published case studies |
| POST/PATCH | `/api/content/categories\|services\|projects` | session | Create / edit |
| DELETE | `/api/content/…` | admin | Delete |

Unpublished rows are returned **only** to an authenticated caller, so a draft
cannot be found by guessing its slug.

## Design decisions

**JSONB for sub-structures.** Scope steps, process steps and FAQs are stored as
JSONB rather than child tables. They are always read whole with their parent,
never queried across rows, and edited as a unit. Normalising them would buy
joins nobody needs.

**Slugs unique per category, not globally.** `services` is unique on
`(category_id, slug)`, matching the `/services/[category]/[service]` URL shape.

**Deleting a category cascades to its services.** An orphaned service has no
reachable URL.

**Login does not reveal whether an account exists.** Wrong password and unknown
email return the same 401, and an unknown email is still compared against a
dummy hash so the timing matches.

**IPs are stored hashed**, salted with `JWT_SECRET` — enough for abuse triage,
not enough to identify a person.

**The honeypot is checked in the handler, not the schema.** Rejecting it during
validation returns a 400 naming the `website` field, which tells a bot exactly
which input trapped it. A filled honeypot gets `201 {"ok":true}` and is
discarded.

**CORS is not access control.** The allow-list stops a malicious *site* using a
visitor's cookies; it does nothing against curl. The auth guards are the actual
boundary.

**`trust proxy` is `1`, not `true`.** Behind one proxy that gives a real client
IP for rate limiting. `true` would let a client spoof `X-Forwarded-For` and
sidestep the limits entirely.

## Seed data

`src/db/seed-data.json` is a **committed snapshot** of the site's original
typed taxonomy, not a live import. This service deploys alone, so reaching into
the frontend's source would break the build (it sits outside `rootDir`) and
fail in production (that source is not deployed here).

Regenerate it — only while the site's in-code taxonomy is still the source of
truth — with:

```bash
npx tsx scripts/extract-taxonomy.mts > src/db/seed-data.json
```

The seed is idempotent: re-running upserts by slug rather than duplicating.

## Verified behaviour

Exercised end to end against a real Postgres:

- health, 404 handler, validation errors with field-level detail
- bootstrap: rejects a bad token, succeeds once, then 409s
- login: rejects wrong password, sets cookie, `/me` restores the session
- auth guard returns 401 without a cookie; role guard 403s on delete
- enquiry create → admin list → status PATCH → stats summary
- honeypot accepted silently and **not stored** (0 rows)
- rate limit engages on the 8th submission in the window
- CORS: allowed origin gets the header, disallowed gets none, no 500s
- seed re-run leaves 5 categories / 21 services, not 10 / 42

## Wiring the site to it — not done yet

The site still renders from its own typed `src/lib/services.ts`. Nothing here
is consumed yet. When you connect it, the thing that matters most is that
**the site's SEO depends on staying statically prerendered**:

1. Fetch `/api/content/services` in `generateStaticParams` and the page
   components, so pages are still built at build time.
2. Add `export const revalidate = 3600` (ISR) so edits appear without a
   redeploy, or call `revalidatePath()` from a webhook this API fires on write.
3. Do **not** switch to client-side fetching. That would empty the HTML of the
   content the whole SEO architecture depends on.

Point the forms at `POST /api/enquiries` and keep the existing Resend email —
the database becomes the record, email stays the notification.

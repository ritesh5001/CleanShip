# CleanTrack API

The backend for CleanShip's hold and tank cleaning tracker. A standalone Node
service — Express, Postgres, Drizzle — deployed on Render. The Next.js site in
`../frontend` runs on Vercel and calls it over HTTPS.

## The system in one paragraph

An **admin** creates a **vessel**: how many holds or tanks it has, and which
**stages** the crew works through. That produces one **compartment** per
hold/tank and one **cell** per compartment × stage — the grid on the paper
status sheet this replaces. The admin assigns a **supervisor**, who is then the
only person who can update it. The supervisor moves cells between *not started*,
*in progress*, *done* and *not applicable*, and can leave a short note on any
cell ("Water in tank"). Every move is appended to an audit trail. Customers get
a read-only link gated by the vessel's IMO number, and no account at all.

## Why the stage list lives on the vessel

`vessels.stages` is a JSON array on the row, copied from a template when the
vessel is created and editable per vessel — not a foreign key into a shared
table. A vessel's checklist is a record of what was agreed and worked, so
editing the "hold cleaning" template six months later must not silently rewrite
what a completed job says it did. Nothing reads a template at request time;
`vessel.stages` is always the answer.

Renaming a stage keeps its key, so the work already recorded survives. Adding
one creates its cells as *pending*. Removing one deletes its cells, and with
them that column's history — which is why the UI asks first.

## Running it locally

```bash
cp .env.example .env          # then edit DATABASE_URL and SESSION_SECRET
npm install
npm run migrate               # brings the schema forward; safe to re-run
npm run seed                  # first admin; skips one that already exists
npm run dev                   # http://localhost:4000
```

`SESSION_SECRET` must be at least 32 characters and **identical to the one in
`../frontend/.env.local`**. See "Sessions" below.

There is one Postgres — Neon — and no staging instance. Pointing `.env` at it
means a local run is working on production data.

### Passwords

There is no "forgot password" email, deliberately: the users are a handful of
staff, and an email reset flow is a whole attack surface to maintain for
something that happens twice a year. An admin resets anyone from the People
screen. For the one case that screen cannot cover — nobody able to sign in as
an admin at all — there is a command:

```bash
npm run set-password -- someone@cleanship.co              # generates one
npm run set-password -- someone@cleanship.co "a password" # sets one
```

## Layout

```
src/
  index.ts            boot: validate env, listen, shut down cleanly
  app.ts              the Express app, assembled
  env.ts              environment schema, validated lazily
  db/
    schema.ts         every table, in one file
    index.ts          the pool, created on first query
    migrate.ts        applies migrations/*.sql, once each
    seed.ts           the first admin
  auth/               passwords, session tokens, roles and access rules
  domain/             the actual logic: vessels, cells, stages, users, share
  routes/             HTTP: parse, authorise, call domain, respond
  http/               errors, validation, the session middleware
migrations/           hand-written SQL, applied in filename order
```

Routes do no business logic and the domain does no HTTP. That split is what
lets a rule like "only the assigned supervisor may write" be stated once, in
`auth/roles.ts`, and enforced everywhere.

## Sessions

Sign-in returns a JWT (HS256, 24h by default). The caller stores it; this
service sets no cookie, because it is called from a different origin than the
one that can hold a first-party cookie. The Next app keeps it in an httpOnly
cookie and forwards it as `Authorization: Bearer …` on server-side calls.

The frontend also **verifies** those tokens locally with the same secret, so
rendering a page does not cost a round trip here. That is the only reason
`SESSION_SECRET` is shared. Local verification decides what the app *shows*;
every piece of data still comes from this service, which authorises the token
again on its own terms.

There is no session table, so signing out clears the cookie and a stolen token
stays valid until it expires. The lever that actually revokes access is
deactivating the user: every guarded request checks `users.active`, so it takes
effect immediately.

## API

All paths are prefixed `/api/v1`. Errors are always
`{ "error": { "code", "message", "details? } }`.

### Auth
| Method | Path | Who | Notes |
|---|---|---|---|
| POST | `/auth/login` | anyone | `{email, password, allow?}` → `{token, expiresIn, user, landing}`. `allow` is the roles the door admits, so a supervisor at the office login is told where to go instead of "wrong password". |
| GET | `/auth/me` | signed in | The current user. |

### Vessels
| Method | Path | Who | Notes |
|---|---|---|---|
| GET | `/vessels` | signed in | Admins get everything; supervisors get only what is assigned to them. Includes rolled-up progress. |
| GET | `/vessels/templates?count=N` | signed in | Stage templates and default compartment names, for the create form. |
| POST | `/vessels` | admin | Creates the vessel, its compartments and every cell in one transaction. |
| GET | `/vessels/:id` | admin, assigned supervisor | Full detail: compartments, cells keyed by stage, progress, share URL. |
| PATCH | `/vessels/:id` | admin | Details and a status override. |
| DELETE | `/vessels/:id` | admin | Cascades to compartments, cells and the trail. |
| POST | `/vessels/:id/assign` | admin | `{supervisorId}` or `null` to unassign. |
| PUT | `/vessels/:id/stages` | admin | Replaces the stage list. See the note above on what is kept. |
| PUT | `/vessels/:id/compartments` | admin | Replaces the compartment labels, matched by position. |
| GET | `/vessels/:id/version` | admin, assigned supervisor | Two integers. The poll target. |
| GET | `/vessels/:id/events` | admin, assigned supervisor | The audit trail, newest first. |
| POST | `/vessels/:id/share/rotate` | admin | New token; every old link dies. |
| POST | `/vessels/:id/share/revoke` | admin | `{revoked: true|false}`. |

### The supervisor's writes
| Method | Path | Who | Notes |
|---|---|---|---|
| POST | `/vessels/:id/cells` | admin, assigned supervisor | `{changes: [{compartmentId, stageKey, status, note?, occurredAt?, idempotencyKey?}]}`, up to 200, applied as one transaction. |
| POST | `/vessels/:id/columns/:stageKey` | same | One stage across every compartment. |
| POST | `/vessels/:id/rows/:compartmentId` | same | Every stage of one compartment. |
| PATCH | `/vessels/:id/compartments/:cid` | same | A note on the compartment itself. |

Every write bumps `vessels.version` inside the same transaction, so a client
polling for changes can never see an updated cell with an unchanged version.
Vessel status is recomputed from the cells on every write — nobody sets it by
hand, because that is a step people forget and clients then chase the office.

`idempotencyKey` is enforced by a unique index, not a pre-check: two offline
replays arriving together would both pass a check and both apply. That is what
makes the offline queue safe to retry.

### People, clients, enquiries
| Method | Path | Who |
|---|---|---|
| GET/POST | `/users`, `/users/:id` (PATCH) | admin |
| GET | `/users/supervisors` | admin |
| POST | `/users/:id/reset-password` | admin — returns a new password once |
| GET | `/clients` | signed in |
| POST/PATCH | `/clients`, `/clients/:id` | admin |
| POST | `/enquiries` | anyone — the website contact forms, throttled per IP |
| GET/PATCH | `/enquiries`, `/enquiries/:id` | admin, editor |

### The customer link
| Method | Path | Notes |
|---|---|---|
| GET | `/share/:token` | Vessel name and reference only — enough to recognise, nothing about the work. |
| POST | `/share/:token/verify` | `{imo}` → `{proof, vessel}`. Constant-time compare. A vessel with no IMO on record opens on the link alone. |
| GET | `/share/:token/vessel` | Needs `X-Share-Proof`. |
| GET | `/share/:token/version` | Poll target for the customer view. |

`GET /health` reports the database too: a service that answers 200 while unable
to reach Postgres looks healthy on the dashboard and is useless to everyone
using it.

## Migrations

Plain SQL in `migrations/`, applied in filename order by `npm run migrate`,
recorded in a `_migrations` table, and safe to re-run. They are hand-written
rather than generated so that what runs against production is a file someone
read. `drizzle-kit` is still available for `npm run db:generate` when you want a
starting point for a new one.

The build command on Render runs the migration, so every deploy brings the
schema forward.

## Deploying

See `../render.yaml` — it carries the service definition and the ordered
first-deploy steps. The short version: `rootDir: backend`, build with
`npm ci && npm run build && npm run migrate`, start with `npm start`, health
check `/health`, and set `DATABASE_URL`, `SESSION_SECRET`, `CLEANTRACK_URL`
and `CORS_ORIGINS` on the service.

**Postgres is Neon, not a Render-managed database.** `render.yaml` has no
`databases:` block on purpose — one would provision a second, empty instance
and wire the API to it, and the first symptom would be a working deploy with
no vessels and no accounts in it, which reads like data loss and is not.

`CLEANTRACK_URL` is what customer share links are built from. A wrong value
sends every link you issue to the wrong host, and you will not notice until a
customer says so.

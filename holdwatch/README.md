# Hold Watch

Live hold and tank cleaning progress. A supervisor taps stages on their phone
at the vessel; the client watches the same job update as it happens.

Runs on its own subdomain, separate from the marketing site.

```
holdwatch/     this app  — supervisor PWA, admin console, client portal
frontend/      the marketing site (unrelated deploy)
backend/       the marketing API (unrelated deploy, shares the database)
```

## Three surfaces, one codebase

| Route | Who | What |
| --- | --- | --- |
| `/app` | Supervisor | Their assigned jobs. Tap through stages. Installable, works offline. |
| `/admin` | Office | Every job, client and account. Creates jobs, assigns supervisors, issues client links. |
| `/client` | Client | Read-only. Their company's jobs only. |
| `/j/{token}` | Anyone with the link | One job, read-only, no account needed. |

## Running it

```bash
cd holdwatch
npm install
cp .env.example .env          # fill in DATABASE_URL and SESSION_SECRET
npm run db:push               # creates the hw_* tables
npm run db:seed               # demo accounts + three jobs
npm run dev                   # http://localhost:3200
```

The seed prints three logins. **They share one published password — delete
them or change every password before this touches anything real.**

## Decisions worth knowing before you change anything

### The supervisor app is a PWA, not a native app

Installed to the home screen it is indistinguishable from a native app to the
person using it: own icon, full screen, works with no signal. What it avoids is
an app store review sitting between a bug found on a dock and the fix reaching
the supervisor's phone — for a tool whose entire value is "the update is
instant", that is the wrong trade.

If a native shell is ever needed (camera depth for Phase 3 photos, push
notifications), `/api/stage` and `/api/jobs/[id]/state` already serve it.

### The vessel is 2D, and that is not a placeholder

The original plan proposes a rotatable Three.js hull. This is a flat SVG plan
view, and for the job it does it is better, not lesser. A supervisor is holding
a phone on a windy deck, possibly gloved: they need to hit the right hold first
time. Rectangles in a fixed plan give large, unambiguous tap targets that never
rotate away from a finger, and cost no JavaScript on a dock connection.

The geometry is computed, so any compartment count lays out correctly — a real
vessel has whatever number of holds it has.

If the 3D view is built later, `VesselDiagram`'s props are the contract it
should honour so the surrounding screens do not change.

### Offline is localStorage, not the service worker

Every tap is written to `localStorage` **before** it is sent, and the UI updates
from local state. A queue flushes in the background and replays on reconnect.
Each queued tap carries a client-generated idempotency key, and the database has
a unique index on it — so a retried sync cannot double-apply.

The service worker deliberately **does not cache job data**. A supervisor
opening the app to yesterday's progress with no indication it was stale is worse
than seeing nothing, because they would act on it.

### Progress is stored twice, on purpose

`hw_compartments.completed` is a denormalised array; `hw_stage_events` is an
append-only log. The array is what every screen reads (no joins, cheap to poll).
The log answers *"when exactly was Hold 3 finished, and who said so"* — the
question that matters when a client disputes a timeline.

**If they ever disagree, the event log is the truth.**

### Live updates are polling, not websockets

Ten-second polling against a `version` integer. On serverless a held-open socket
is billed for its whole life and killed at the platform timeout anyway, and
phones on dock mobile data drop sockets constantly. Ten seconds is well inside
"live" for a job measured in hours.

### The share link is a bearer credential

Anyone holding `/j/{token}` sees that job. That is the point — it is what lets a
client watch progress on day one without an account. So the token is 24 random
bytes, the page is `noindex`, it exposes one job and no way to walk to another,
and it can be revoked and rotated from the admin job page.

### Status is derived, never set by hand

A job goes `scheduled → in-progress` on the first tap and `→ complete` when
every compartment finishes. Supervisors forget to close jobs; clients then chase
the office. The admin override exists only for cancelling or reopening.

## Where things live

```
src/lib/stages.ts        The checklist. Change the stages here, once.
src/lib/db/schema.ts     Tables, all prefixed hw_
src/lib/jobs.ts          Queries, the stage-change transaction, access rules
src/lib/auth.ts          Session cookie, role gates
src/components/vessel-diagram.tsx   The 2D vessel
src/components/stage-board.tsx      Tapping + offline queue
```

## Deploying to a subdomain

Vercel, as a **separate project** from the marketing site with the root
directory set to `holdwatch`. Point `holdwatch.cleanship.co` (or similar) at it
and set `APP_URL` to that exact origin — client share links are built from it,
so if it is wrong every link you send points at localhost.

Environment: `DATABASE_URL`, `SESSION_SECRET`, `APP_URL`.

Safe to reuse the marketing database. Every table is prefixed `hw_` and
`drizzle.config.ts` is filtered to that prefix, so a push from either project
cannot touch the other's tables.

## Open questions

1. **The tank sequence is a guess.** Hold cleaning uses the six stages exactly
   as supplied. Tank cleaning uses Pre-Wash → Chemical Wash → HP Rinse → Mucking
   Out → Gas-Freeing → Tank Ready, which is a plausible default and **not
   confirmed**. Fix it in `src/lib/stages.ts`; every screen follows.
2. **Branding.** Currently plain. Logo, colours and a client-facing header are a
   contained change once supplied.

## Not built yet

Phase 3 and 4 from the plan, deliberately:

- **Photos and notes per stage.** The data model has room (`hw_compartments.notes`)
  but there is no upload or storage. This is the one that changes the offline
  design — queued photos need IndexedDB, not localStorage.
- **PDF completion report.** The event log holds everything it needs.
- **Notifications** on job start and finish.
- **Password reset.** Admins set passwords by hand today.
- **Multi-supervisor jobs.** One assigned supervisor per job; the schema would
  need a join table.

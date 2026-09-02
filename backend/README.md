# @cleanship/backend

The database, authentication primitives and CleanTrack domain logic.

**This is a package, not a service.** It is imported directly by the Next app
in `../frontend`, which is the only thing deployed. There is no API between
them and no second process to run — an HTTP hop between two pieces of the same
codebase talking to the same Postgres would buy latency and nothing else.

## The line between here and frontend

| Here | `frontend/` |
| --- | --- |
| Database schema and queries | Pages, components, server actions |
| Password hashing, token signing | Cookie handling (`next/headers`) |
| Access rules — who may see a job | Which page to redirect to |
| CleanTrack domain: stages, progress | Marketing content, SEO, port data |

Nothing here imports from Next. That is the rule that keeps the boundary
real: the moment this package needs `next/headers`, it has stopped being a
backend and become part of the app.

Cookies are the clearest case. Signing the session token lives here because it
is cryptography; reading and writing the cookie lives in `frontend/src/lib/
session.ts` because that is framework plumbing.

## Layout

```
src/env.ts               environment, validated lazily
src/db/schema.ts         every table
src/db/index.ts          the connection, created on first query
src/db/bootstrap.ts      creates the first admin account
src/auth/passwords.ts    bcrypt
src/auth/tokens.ts       session token sign and verify
src/auth/roles.ts        roles and where each one belongs
src/users.ts             user lookup and credential checking
src/enquiries.ts         enquiry inbox queries
src/cleantrack/stages.ts the cleaning checklist — change stages here, once
src/cleantrack/jobs.ts   job queries, the stage-change transaction, access rules
src/cleantrack/share.ts  IMO gate for customer share links
```

## Scripts

Run from the repository root:

```bash
npm run db:push                                        # apply the schema
npm run db:bootstrap -- "you@cleanship.co" "Your Name" # first admin
npm run db:studio                                      # browse the data
```

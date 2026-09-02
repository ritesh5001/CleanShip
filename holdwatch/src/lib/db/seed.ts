import "dotenv/config";
import { eq } from "drizzle-orm";
import { db, pool } from "./index";
import { clients, compartments, jobs, users } from "./schema";
import { hashPassword } from "../auth-node";
import { compartmentLabel, stagesFor } from "../stages";
import { newShareToken } from "./seed-helpers";

/**
 * Seeds a working demo: three accounts, two clients, three jobs at different
 * stages of completion.
 *
 * Idempotent by email/name lookup, so running it twice does not duplicate.
 * Passwords are printed at the end because there is no reset flow yet — see
 * the README.
 */

const DEMO_PASSWORD = "holdwatch-demo-2026";

async function main() {
  /* This plants accounts with a password that is published in this file and
     left in terminal history. That is fine for a throwaway local database and
     a liability anywhere else — Hold Watch shares its database with the
     marketing API, so "anywhere else" includes the default configuration.
     Use `npm run db:bootstrap` for a real system. */
  const local =
    /localhost|127\.0\.0\.1|::1/.test(process.env.DATABASE_URL ?? "") ||
    process.env.ALLOW_DEMO_SEED === "yes";

  if (!local) {
    console.error(`
Refusing to seed.

DATABASE_URL does not point at localhost, and this script creates demo accounts
that share one published password.

  · For a real system:   npm run db:bootstrap -- "you@cleanship.co" "Your Name"
  · To override anyway:  ALLOW_DEMO_SEED=yes npm run db:seed
`);
    process.exit(1);
  }

  console.log("Seeding Hold Watch…\n");

  const [acme] = await upsertClient("Meridian Bulk Carriers", "Ops Desk", "ops@example.com");
  const [orion] = await upsertClient("Orion Tanker Management", "Fleet Team", "fleet@example.com");

  const admin = await upsertUser({
    name: "Office Admin",
    email: "admin@cleanship.co",
    role: "admin",
    clientId: null,
  });
  const supervisor = await upsertUser({
    name: "Ravi Menon",
    email: "supervisor@cleanship.co",
    role: "supervisor",
    clientId: null,
  });
  await upsertUser({
    name: "Meridian Ops",
    email: "client@example.com",
    role: "client",
    clientId: acme.id,
  });

  await upsertJob({
    reference: "HW-DEMO-01",
    vesselName: "MV Kandla Trader",
    imo: "9123456",
    port: "Kandla",
    berth: "Berth 8",
    jobType: "hold-cleaning",
    clientId: acme.id,
    supervisorId: supervisor.id,
    compartmentCount: 5,
    /* Holds 1–2 finished, hold 3 part-way — the state a demo needs to show
       all three colours at once. */
    fill: [6, 6, 3, 0, 0],
  });

  await upsertJob({
    reference: "HW-DEMO-02",
    vesselName: "MT Orion Spirit",
    imo: "9456789",
    port: "Fujairah",
    berth: "Anchorage",
    jobType: "tank-cleaning",
    clientId: orion.id,
    supervisorId: supervisor.id,
    compartmentCount: 6,
    fill: [6, 6, 6, 6, 2, 0],
  });

  await upsertJob({
    reference: "HW-DEMO-03",
    vesselName: "MV Gulf Pioneer",
    imo: null,
    port: "Mundra",
    berth: null,
    jobType: "hold-cleaning",
    clientId: acme.id,
    supervisorId: supervisor.id,
    compartmentCount: 7,
    fill: [0, 0, 0, 0, 0, 0, 0],
  });

  console.log(`
Done. Sign in at http://localhost:3200/login

  Admin       admin@cleanship.co
  Supervisor  supervisor@cleanship.co
  Client      client@example.com

  Password for all three: ${DEMO_PASSWORD}

⚠️  These are demo accounts with a shared, published password. Delete them or
    change every password before this touches a real deployment.
`);
  console.log(`Admin user id ${admin.id}`);
}

async function upsertClient(name: string, contactName: string, email: string) {
  const found = await db.select().from(clients).where(eq(clients.name, name)).limit(1);
  if (found.length) return found;
  return db
    .insert(clients)
    .values({ name, contactName, contactEmail: email })
    .returning();
}

async function upsertUser(input: {
  name: string;
  email: string;
  role: "admin" | "supervisor" | "client";
  clientId: number | null;
}) {
  const [found] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);
  if (found) return found;
  const [created] = await db
    .insert(users)
    .values({
      ...input,
      passwordHash: await hashPassword(DEMO_PASSWORD),
    })
    .returning();
  return created;
}

async function upsertJob(input: {
  reference: string;
  vesselName: string;
  imo: string | null;
  port: string;
  berth: string | null;
  jobType: "hold-cleaning" | "tank-cleaning";
  clientId: number;
  supervisorId: number;
  compartmentCount: number;
  /** How many stages are complete on each compartment, in order. */
  fill: number[];
}) {
  const [found] = await db
    .select()
    .from(jobs)
    .where(eq(jobs.reference, input.reference))
    .limit(1);
  if (found) {
    console.log(`  · ${input.reference} already present, skipping`);
    return found;
  }

  const stages = stagesFor(input.jobType);
  const anyStarted = input.fill.some((n) => n > 0);
  const allDone = input.fill.every((n) => n >= stages.length);

  const [job] = await db
    .insert(jobs)
    .values({
      reference: input.reference,
      vesselName: input.vesselName,
      imo: input.imo,
      port: input.port,
      berth: input.berth,
      jobType: input.jobType,
      clientId: input.clientId,
      supervisorId: input.supervisorId,
      compartmentCount: input.compartmentCount,
      status: allDone ? "complete" : anyStarted ? "in-progress" : "scheduled",
      startedAt: anyStarted ? new Date(Date.now() - 5 * 3600_000) : null,
      scheduledFor: new Date(),
      shareToken: newShareToken(),
      version: 1,
    })
    .returning();

  await db.insert(compartments).values(
    Array.from({ length: input.compartmentCount }, (_, i) => ({
      jobId: job.id,
      position: i,
      label: compartmentLabel(input.jobType, i),
      completed: stages.slice(0, input.fill[i] ?? 0).map((s) => s.key),
    })),
  );

  console.log(`  ✓ ${input.reference}  ${input.vesselName}`);
  return job;
}

main()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    pool.end();
    process.exit(1);
  });

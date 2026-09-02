import "server-only";
import crypto from "node:crypto";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import {
  clients,
  compartments,
  jobs,
  stageEvents,
  users,
  type Compartment,
  type Job,
} from "./db/schema";
import {
  compartmentLabel,
  progressOf,
  stagesFor,
  stateOf,
  type JobType,
} from "./stages";

export type JobWithMeta = Job & {
  clientName: string;
  supervisorName: string | null;
};

export type JobDetail = JobWithMeta & {
  compartments: Compartment[];
};

/* -------------------------------------------------------------------- */
/* Reads                                                                */
/* -------------------------------------------------------------------- */

const jobSelect = {
  job: jobs,
  clientName: clients.name,
  supervisorName: users.name,
};

function shape(rows: { job: Job; clientName: string; supervisorName: string | null }[]) {
  return rows.map((r) => ({
    ...r.job,
    clientName: r.clientName,
    supervisorName: r.supervisorName,
  }));
}

async function listJobsWhere(where: ReturnType<typeof eq> | undefined) {
  const q = db
    .select(jobSelect)
    .from(jobs)
    .innerJoin(clients, eq(jobs.clientId, clients.id))
    .leftJoin(users, eq(jobs.supervisorId, users.id))
    .orderBy(desc(jobs.createdAt));
  const rows = where ? await q.where(where) : await q;
  return shape(rows);
}

export const listAllJobs = () => listJobsWhere(undefined);
export const listJobsForSupervisor = (userId: number) =>
  listJobsWhere(eq(jobs.supervisorId, userId));
export const listJobsForClient = (clientId: number) =>
  listJobsWhere(eq(jobs.clientId, clientId));

export async function getJobDetail(jobId: number): Promise<JobDetail | null> {
  const [row] = await db
    .select(jobSelect)
    .from(jobs)
    .innerJoin(clients, eq(jobs.clientId, clients.id))
    .leftJoin(users, eq(jobs.supervisorId, users.id))
    .where(eq(jobs.id, jobId))
    .limit(1);
  if (!row) return null;

  const comps = await db
    .select()
    .from(compartments)
    .where(eq(compartments.jobId, jobId))
    .orderBy(compartments.position);

  return { ...row.job, clientName: row.clientName, supervisorName: row.supervisorName, compartments: comps };
}

export async function getJobByShareToken(token: string) {
  const [row] = await db
    .select({ id: jobs.id, revoked: jobs.shareRevoked })
    .from(jobs)
    .where(eq(jobs.shareToken, token))
    .limit(1);
  if (!row || row.revoked) return null;
  return getJobDetail(row.id);
}

/** Full audit trail for a job, newest first. */
export async function getJobEvents(jobId: number, limit = 200) {
  return db
    .select({
      event: stageEvents,
      compartmentLabel: compartments.label,
    })
    .from(stageEvents)
    .innerJoin(compartments, eq(stageEvents.compartmentId, compartments.id))
    .where(eq(stageEvents.jobId, jobId))
    .orderBy(desc(stageEvents.occurredAt))
    .limit(limit);
}

/* -------------------------------------------------------------------- */
/* Progress rollup                                                      */
/* -------------------------------------------------------------------- */

export function jobProgress(job: { jobType: string }, comps: Compartment[]) {
  const type = job.jobType as JobType;
  const totalStages = stagesFor(type).length * comps.length;
  const doneStages = comps.reduce(
    (n, c) => n + progressOf(c.completed ?? [], type).done,
    0,
  );
  const complete = comps.filter(
    (c) => stateOf(c.completed ?? [], type) === "complete",
  ).length;
  return {
    doneStages,
    totalStages,
    ratio: totalStages === 0 ? 0 : doneStages / totalStages,
    compartmentsComplete: complete,
    compartmentsTotal: comps.length,
  };
}

/* -------------------------------------------------------------------- */
/* Writes                                                               */
/* -------------------------------------------------------------------- */

export function newShareToken() {
  return crypto.randomBytes(24).toString("base64url");
}

/** HW-YYMM-NN, unique per month. Readable over a phone line. */
export async function nextReference() {
  const now = new Date();
  const stem = `HW-${String(now.getUTCFullYear()).slice(2)}${String(
    now.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(jobs)
    .where(sql`${jobs.reference} like ${stem + "%"}`);
  return `${stem}-${String(count + 1).padStart(2, "0")}`;
}

export type CreateJobInput = {
  vesselName: string;
  imo?: string | null;
  port: string;
  berth?: string | null;
  jobType: JobType;
  clientId: number;
  supervisorId?: number | null;
  compartmentCount: number;
  scheduledFor?: Date | null;
  notes?: string | null;
};

export async function createJob(input: CreateJobInput) {
  const reference = await nextReference();

  /* One transaction: a job without its compartments is a job the supervisor
     opens to an empty screen, which is worse than the create failing. */
  return db.transaction(async (tx) => {
    const [job] = await tx
      .insert(jobs)
      .values({
        reference,
        vesselName: input.vesselName,
        imo: input.imo || null,
        port: input.port,
        berth: input.berth || null,
        jobType: input.jobType,
        clientId: input.clientId,
        supervisorId: input.supervisorId ?? null,
        compartmentCount: input.compartmentCount,
        scheduledFor: input.scheduledFor ?? null,
        notes: input.notes || null,
        shareToken: newShareToken(),
      })
      .returning();

    await tx.insert(compartments).values(
      Array.from({ length: input.compartmentCount }, (_, i) => ({
        jobId: job.id,
        position: i,
        label: compartmentLabel(input.jobType, i),
      })),
    );

    return job;
  });
}

export type StageToggle = {
  compartmentId: number;
  stageKey: string;
  /** true = mark done, false = undo. */
  done: boolean;
  /** When the supervisor tapped — not when the server heard about it. */
  occurredAt: Date;
  /** Client-generated. Makes an offline replay safe to retry. */
  idempotencyKey?: string | null;
};

export type ApplyResult =
  | { ok: true; jobId: number; version: number; duplicate: boolean }
  | { ok: false; reason: string };

/**
 * Applies one stage change.
 *
 * Everything happens in a single transaction that also bumps `jobs.version`,
 * so a client polling for changes can never observe a compartment updated but
 * the version unchanged — which would make it stop polling and show stale
 * progress to someone standing on a deck disputing it.
 *
 * Idempotency is enforced by a unique index on `idempotencyKey`, not by a
 * pre-check: two offline taps replaying concurrently would both pass a check
 * and both apply. Letting the constraint reject the second is the only version
 * that is actually safe under concurrency.
 */
export async function applyStageChange(
  toggle: StageToggle,
  actor: { id: number; name: string },
): Promise<ApplyResult> {
  return db.transaction(async (tx) => {
    const [comp] = await tx
      .select()
      .from(compartments)
      .where(eq(compartments.id, toggle.compartmentId))
      .limit(1)
      .for("update");

    if (!comp) return { ok: false as const, reason: "Compartment not found" };

    const [job] = await tx
      .select()
      .from(jobs)
      .where(eq(jobs.id, comp.jobId))
      .limit(1);
    if (!job) return { ok: false as const, reason: "Job not found" };

    const valid = stagesFor(job.jobType as JobType).some(
      (s) => s.key === toggle.stageKey,
    );
    if (!valid) {
      return { ok: false as const, reason: `Unknown stage "${toggle.stageKey}"` };
    }

    if (toggle.idempotencyKey) {
      const [seen] = await tx
        .select({ id: stageEvents.id })
        .from(stageEvents)
        .where(eq(stageEvents.idempotencyKey, toggle.idempotencyKey))
        .limit(1);
      if (seen) {
        return {
          ok: true as const,
          jobId: job.id,
          version: job.version,
          duplicate: true,
        };
      }
    }

    const current = new Set(comp.completed ?? []);
    if (toggle.done) current.add(toggle.stageKey);
    else current.delete(toggle.stageKey);

    /* Persist in stage order, so the array reads the way the checklist does
       and nothing downstream has to sort it. */
    const ordered = stagesFor(job.jobType as JobType)
      .map((s) => s.key)
      .filter((k) => current.has(k));

    await tx
      .update(compartments)
      .set({ completed: ordered, updatedAt: new Date() })
      .where(eq(compartments.id, comp.id));

    await tx.insert(stageEvents).values({
      jobId: job.id,
      compartmentId: comp.id,
      stageKey: toggle.stageKey,
      action: toggle.done ? "completed" : "undone",
      userId: actor.id,
      userName: actor.name,
      occurredAt: toggle.occurredAt,
      idempotencyKey: toggle.idempotencyKey ?? null,
    });

    /* A job moves to in-progress on its first tap and to complete when every
       compartment is finished — the supervisor never sets job status by hand,
       because that is a step people forget and clients then chase. */
    const allComps = await tx
      .select()
      .from(compartments)
      .where(eq(compartments.jobId, job.id));
    const type = job.jobType as JobType;
    const everyDone =
      allComps.length > 0 &&
      allComps.every((c) => stateOf(c.completed ?? [], type) === "complete");
    const anyStarted = allComps.some((c) => (c.completed ?? []).length > 0);

    const status = everyDone
      ? ("complete" as const)
      : anyStarted
        ? ("in-progress" as const)
        : ("scheduled" as const);

    const [updated] = await tx
      .update(jobs)
      .set({
        version: job.version + 1,
        status: job.status === "cancelled" ? job.status : status,
        startedAt: job.startedAt ?? (anyStarted ? toggle.occurredAt : null),
        completedAt: everyDone ? (job.completedAt ?? toggle.occurredAt) : null,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, job.id))
      .returning({ version: jobs.version });

    return {
      ok: true as const,
      jobId: job.id,
      version: updated.version,
      duplicate: false,
    };
  });
}

/** Lightweight poll target — one integer, no joins. */
export async function getJobVersion(jobId: number) {
  const [row] = await db
    .select({ version: jobs.version, status: jobs.status })
    .from(jobs)
    .where(eq(jobs.id, jobId))
    .limit(1);
  return row ?? null;
}

/* -------------------------------------------------------------------- */
/* Access control                                                       */
/* -------------------------------------------------------------------- */

/**
 * Whether a session may view a job. Called by every job route.
 *
 * Written as one function rather than inline checks because "supervisors see
 * only their jobs, clients see only their company's" is exactly the rule that
 * rots when it is restated in six places.
 */
export function canViewJob(
  session: { role: string; sub: number; clientId: number | null },
  job: { supervisorId: number | null; clientId: number },
) {
  if (session.role === "admin") return true;
  if (session.role === "supervisor") return job.supervisorId === session.sub;
  if (session.role === "client") return job.clientId === session.clientId;
  return false;
}

/** Only the assigned supervisor and admins may change a stage. */
export function canUpdateJob(
  session: { role: string; sub: number },
  job: { supervisorId: number | null },
) {
  if (session.role === "admin") return true;
  return session.role === "supervisor" && job.supervisorId === session.sub;
}

export { clients, compartments, jobs, stageEvents, users, and, eq, inArray, desc };

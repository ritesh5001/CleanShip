import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { hwJobs as jobs } from "@/lib/db/schema";
import { applyStageChange, canUpdateJob } from "@/lib/holdwatch/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  jobId: z.number().int().positive(),
  compartmentId: z.number().int().positive(),
  stageKey: z.string().min(1).max(40),
  done: z.boolean(),
  /* The supervisor's clock, not ours. Bounded so a wrong device clock cannot
     write an event dated 2031 into the audit trail. */
  occurredAt: z.string().datetime(),
  idempotencyKey: z.string().min(8).max(64),
});

/**
 * The single write endpoint for stage changes.
 *
 * Used by the online path and by the offline queue replay alike — one code
 * path means a queued tap and a live tap cannot diverge in behaviour, which
 * is exactly the class of bug that makes an offline feature untrustworthy.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const occurredAt = new Date(parsed.data.occurredAt);
  const skewMs = Math.abs(Date.now() - occurredAt.getTime());
  /* Seven days back covers any realistic offline stretch; anything in the
     future is a broken device clock and gets clamped to now rather than
     rejected, so the supervisor's work is never lost to a bad setting. */
  const safeOccurredAt =
    occurredAt.getTime() > Date.now() || skewMs > 7 * 24 * 3600 * 1000
      ? new Date()
      : occurredAt;

  const [job] = await db
    .select({ id: jobs.id, supervisorId: jobs.supervisorId })
    .from(jobs)
    .where(eq(jobs.id, parsed.data.jobId))
    .limit(1);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  if (!canUpdateJob(session, job)) {
    return NextResponse.json(
      { error: "You are not assigned to this job" },
      { status: 403 },
    );
  }

  const result = await applyStageChange(
    {
      compartmentId: parsed.data.compartmentId,
      stageKey: parsed.data.stageKey,
      done: parsed.data.done,
      occurredAt: safeOccurredAt,
      idempotencyKey: parsed.data.idempotencyKey,
    },
    { id: session.sub, name: session.name },
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    version: result.version,
    duplicate: result.duplicate,
  });
}

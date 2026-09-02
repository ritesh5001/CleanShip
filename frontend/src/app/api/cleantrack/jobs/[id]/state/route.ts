import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { canViewJob, getJobDetail } from "@cleanship/backend/cleantrack/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Poll target for live progress.
 *
 * Polling rather than websockets or SSE, deliberately. This runs on serverless
 * functions where a held-open connection is billed for its whole life and is
 * killed at the platform timeout anyway; and the consumers are phones on dock
 * mobile data, where a dropped socket needs reconnect logic that a poll gets
 * for free. Ten seconds is well inside "live" for a job measured in hours.
 *
 * Clients hold a `version`; when it has not moved they can ignore the body.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await params;
  const jobId = Number(id);
  if (!Number.isInteger(jobId)) {
    return NextResponse.json({ error: "Bad job id" }, { status: 400 });
  }

  const job = await getJobDetail(jobId);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canViewJob(session, job)) {
    return NextResponse.json({ error: "Not permitted" }, { status: 403 });
  }

  return NextResponse.json(
    {
      version: job.version,
      status: job.status,
      compartments: job.compartments.map((c) => ({
        id: c.id,
        label: c.label,
        position: c.position,
        completed: c.completed ?? [],
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}

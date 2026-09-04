import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ApiError, getVessel } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Poll target for live progress.
 *
 * Polling rather than websockets or SSE, deliberately. This runs on serverless
 * functions where a held-open connection is billed for its whole life and is
 * killed at the platform timeout anyway; and the consumers are phones on dock
 * mobile data, where a dropped socket needs reconnect logic that a poll gets
 * for free. Ten seconds is well inside "live" for work measured in hours.
 *
 * Clients hold a `version`; when it has not moved they ignore the body.
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
  const vesselId = Number(id);
  if (!Number.isInteger(vesselId)) {
    return NextResponse.json({ error: "Bad vessel id" }, { status: 400 });
  }

  try {
    const { vessel } = await getVessel(vesselId);
    return NextResponse.json(
      {
        version: vessel.version,
        status: vessel.status,
        compartments: vessel.compartments.map((c) => ({
          id: c.id,
          label: c.label,
          position: c.position,
          notes: c.notes,
          cells: Object.fromEntries(
            Object.entries(c.cells).map(([k, cell]) => [
              k,
              {
                status: cell.status,
                note: cell.note,
                startedAt: cell.startedAt,
                completedAt: cell.completedAt,
              },
            ]),
          ),
        })),
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
}

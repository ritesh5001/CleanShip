import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { ApiError, applyCellChanges } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The single write path for cell changes.
 *
 * It exists rather than the browser calling the API directly because the
 * session token lives in an httpOnly cookie the browser cannot read — this
 * route is what attaches it. Online taps and offline replays both come through
 * here, so a queued tap and a live tap cannot diverge in behaviour, which is
 * exactly the class of bug that makes an offline feature untrustworthy.
 */
const schema = z.object({
  vesselId: z.number().int().positive(),
  changes: z
    .array(
      z.object({
        compartmentId: z.number().int().positive(),
        stageKey: z.string().min(1).max(40),
        status: z.enum(["pending", "in_progress", "done", "na"]),
        note: z.string().max(160).nullish(),
        occurredAt: z.string().datetime(),
        idempotencyKey: z.string().min(8).max(64),
      }),
    )
    .min(1)
    .max(200),
});

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

  const now = Date.now();
  const changes = parsed.data.changes.map((c) => {
    const at = new Date(c.occurredAt);
    /* Seven days back covers any realistic offline stretch. Anything in the
       future is a broken device clock and is clamped to now rather than
       rejected, so a wrong phone setting never costs a supervisor their work. */
    const skew = Math.abs(now - at.getTime());
    const safe =
      at.getTime() > now || skew > 7 * 24 * 3600 * 1000 ? new Date() : at;
    return { ...c, occurredAt: safe.toISOString() };
  });

  try {
    const result = await applyCellChanges(parsed.data.vesselId, changes);
    return NextResponse.json(result, {
      headers: { "cache-control": "no-store" },
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[cells] unexpected", err);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}

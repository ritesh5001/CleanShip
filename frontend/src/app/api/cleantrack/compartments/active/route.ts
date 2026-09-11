import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { ApiError, setCompartmentActive } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Toggles "a gang is physically in this hold right now" from the console.
 *
 * Same shape as the cells route and for the same reason: the session token
 * lives in an httpOnly cookie the browser cannot read, so this is what
 * attaches it before the request reaches the API.
 */
const schema = z.object({
  vesselId: z.number().int().positive(),
  compartmentId: z.number().int().positive(),
  active: z.boolean(),
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

  try {
    const result = await setCompartmentActive(
      parsed.data.vesselId,
      parsed.data.compartmentId,
      parsed.data.active,
    );
    return NextResponse.json(result, {
      headers: { "cache-control": "no-store" },
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[compartments/active] unexpected", err);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}

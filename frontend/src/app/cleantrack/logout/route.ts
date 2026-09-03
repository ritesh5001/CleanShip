import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

/**
 * POST, not GET — a GET logout can be fired by any image tag pointing at it,
 * which is a nuisance that signs supervisors out mid-shift.
 *
 * The redirect is built from the request URL rather than a configured origin,
 * so it works on the marketing domain and the CleanTrack subdomain alike
 * without a second variable to keep in step.
 */
export async function POST(request: Request) {
  await destroySession();
  return NextResponse.redirect(new URL("/cleantrack/login", request.url), {
    status: 303,
  });
}

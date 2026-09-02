import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";
import { env } from "@cleanship/backend/env";

/**
 * POST, not GET — a GET logout can be fired by any image tag pointing at it,
 * which is a nuisance that signs supervisors out mid-job.
 */
export async function POST() {
  await destroySession();
  return NextResponse.redirect(new URL("/cleantrack/login", env.APP_URL), {
    status: 303,
  });
}

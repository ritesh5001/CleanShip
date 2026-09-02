import { redirect } from "next/navigation";
import { getSession, landingFor } from "@/lib/auth";

/** Sends each role to its own surface. Nothing lives at the Hold Watch root. */
export default async function HoldWatchRoot() {
  const session = await getSession();
  redirect(session ? landingFor(session.role) : "/holdwatch/login");
}

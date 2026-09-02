import { redirect } from "next/navigation";
import { getSession, landingFor } from "@/lib/auth";

/** Sends each role to its own surface. Nothing lives at the root. */
export default async function RootPage() {
  const session = await getSession();
  redirect(session ? landingFor(session.role) : "/login");
}

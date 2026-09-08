import Link from "next/link";
import type { ReactNode } from "react";
import type { Session } from "@/lib/session";
import { NavTabs } from "./nav-tabs";

/**
 * Shared chrome for all three signed-in surfaces.
 *
 * One component rather than three because the header is the place a role
 * mistake shows up — someone seeing an "All jobs" tab they cannot open. Nav
 * items are derived from the session role here, in one place.
 *
 * The bar is navy: this is the office end of the same product the crew carries,
 * and a white chrome made the two read as different applications.
 */

const NAV: Record<Session["role"], { href: string; label: string }[]> = {
  admin: [
    { href: "/cleantrack/admin", label: "Vessels" },
    { href: "/cleantrack/admin/clients", label: "Clients" },
    { href: "/cleantrack/admin/users", label: "Users" },
    { href: "/admin", label: "Enquiries" },
  ],
  /* An editor works the enquiry inbox and has no CleanTrack surface; they can
     reach this shell only by URL, so it points them back rather than showing
     an empty nav. */
  editor: [{ href: "/admin", label: "Enquiries" }],
  supervisor: [{ href: "/cleantrack/app", label: "My vessels" }],
};

export function AppShell({
  session,
  children,
  wide = false,
}: {
  session: Session;
  children: ReactNode;
  wide?: boolean;
}) {
  const nav = NAV[session.role];

  return (
    <div className="min-h-screen bg-[#f6f8fa]">
      <header className="sticky top-0 z-40 bg-[#0a2e52]">
        <div
          className={`mx-auto flex h-14 items-stretch gap-6 px-5 ${
            wide ? "max-w-7xl" : "max-w-5xl"
          }`}
        >
          <Link
            href="/cleantrack"
            className="flex shrink-0 items-center gap-3 self-center"
          >
            <span className="font-[family-name:var(--font-display)] text-[17px] font-bold uppercase tracking-[0.06em] text-white">
              CleanShip
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[#9de3e7] sm:inline">
              CleanTrack
            </span>
          </Link>

          <NavTabs items={nav} />

          <div className="flex shrink-0 items-center gap-3 self-center">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 md:inline">
              {session.role}
            </span>
            <span className="hidden font-mono text-[11px] text-white/75 lg:inline">
              {session.email}
            </span>
            <form action="/cleantrack/logout" method="post">
              <button
                type="submit"
                className="px-2 py-1 text-[13px] font-medium text-white/60 transition-colors hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className={`mx-auto px-5 py-7 ${wide ? "max-w-7xl" : "max-w-5xl"}`}>
        {children}
      </main>
    </div>
  );
}

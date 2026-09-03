import Link from "next/link";
import type { ReactNode } from "react";
import type { Session } from "@/lib/session";

/**
 * Shared chrome for all three signed-in surfaces.
 *
 * One component rather than three because the header is the place a role
 * mistake shows up — someone seeing an "All jobs" tab they cannot open. Nav
 * items are derived from the session role here, in one place.
 */

const NAV: Record<Session["role"], { href: string; label: string }[]> = {
  admin: [
    { href: "/cleantrack/admin", label: "Vessels" },
    { href: "/cleantrack/admin/clients", label: "Clients" },
    { href: "/cleantrack/admin/users", label: "People" },
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
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div
          className={`mx-auto flex h-14 items-center gap-4 px-4 ${
            wide ? "max-w-7xl" : "max-w-5xl"
          }`}
        >
          <Link href="/cleantrack" className="flex shrink-0 items-baseline gap-2">
            <span className="text-[15px] font-bold tracking-tight text-slate-900">
              CleanTrack
            </span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-blue-700 sm:inline">
              {session.role}
            </span>
          </Link>

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-md px-3 py-2 text-[14px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form action="/cleantrack/logout" method="post" className="shrink-0">
            <button
              type="submit"
              className="rounded-md px-3 py-2 text-[14px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main
        className={`mx-auto px-4 py-6 ${wide ? "max-w-7xl" : "max-w-5xl"}`}
      >
        {children}
      </main>
    </div>
  );
}

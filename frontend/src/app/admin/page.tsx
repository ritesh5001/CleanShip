import type { Metadata } from "next";
import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/db/schema";
import { formatDateTime, relativeTime } from "@/lib/format";
import { setEnquiryStatusAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Enquiries",
  robots: { index: false, follow: false },
};

const STATUSES = ["new", "in-progress", "quoted", "won", "lost", "spam"] as const;

const STATUS_STYLE: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-300",
  "in-progress": "bg-amber-100 text-amber-800 border-amber-400",
  quoted: "bg-violet-100 text-violet-800 border-violet-300",
  won: "bg-emerald-100 text-emerald-800 border-emerald-400",
  lost: "bg-slate-100 text-slate-600 border-slate-300",
  spam: "bg-red-100 text-red-800 border-red-300",
};

/**
 * The enquiry inbox.
 *
 * Previously a client component fetching an Express API on another origin,
 * with all the cross-origin cookie handling that needed. It is now a server
 * component reading the database directly — same data, no network hop, no
 * loading state, and no second service to deploy.
 */
export default async function AdminInboxPage() {
  const session = await requireSession("admin", "editor");

  const [rows, counts] = await Promise.all([
    db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(200),
    db
      .select({ status: enquiries.status, n: sql<number>`count(*)::int` })
      .from(enquiries)
      .groupBy(enquiries.status),
  ]);

  const total = counts.reduce((n, c) => n + c.n, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-baseline gap-3">
            <span className="text-[15px] font-bold text-slate-900">
              Cleanship admin
            </span>
            <Link
              href="/holdwatch/admin"
              className="text-[13px] font-medium text-blue-700 hover:underline"
            >
              Hold Watch →
            </Link>
          </div>
          <form action="/holdwatch/logout" method="post">
            <button
              type="submit"
              className="rounded-md px-3 py-2 text-[14px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Enquiries
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {total} total · signed in as {session.name}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {counts.map((c) => (
            <span
              key={c.status}
              className={`rounded-full border px-3 py-1 text-[12px] font-semibold capitalize ${STATUS_STYLE[c.status]}`}
            >
              {c.status.replace("-", " ")} · {c.n}
            </span>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-base font-semibold text-slate-900">
              No enquiries yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              Submissions from the contact form and every service and port page
              land here.
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {rows.map((e) => (
              <li
                key={e.id}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{e.name}</p>
                    <p className="mt-0.5 text-[13px] text-slate-600">
                      <a href={`mailto:${e.email}`} className="text-blue-700 hover:underline">
                        {e.email}
                      </a>
                      {e.phone ? ` · ${e.phone}` : ""}
                      {e.company ? ` · ${e.company}` : ""}
                    </p>
                    {e.service && (
                      <p className="mt-1 text-[12px] text-slate-500">
                        From: {e.service}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[12px] font-semibold capitalize ${STATUS_STYLE[e.status]}`}
                    >
                      {e.status.replace("-", " ")}
                    </span>
                    <p
                      className="mt-1 text-[12px] text-slate-400"
                      title={formatDateTime(e.createdAt)}
                    >
                      {relativeTime(e.createdAt)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-line border-t border-slate-100 pt-3 text-[14px] leading-relaxed text-slate-700">
                  {e.message}
                </p>

                <form action={setEnquiryStatusAction} className="mt-4 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={e.id} />
                  <label htmlFor={`status-${e.id}`} className="text-[12px] font-medium text-slate-500">
                    Status
                  </label>
                  <select
                    id={`status-${e.id}`}
                    name="status"
                    defaultValue={e.status}
                    className="min-h-9 rounded-md border border-slate-300 px-2 text-[13px]"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("-", " ")}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="min-h-9 rounded-md border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Save
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

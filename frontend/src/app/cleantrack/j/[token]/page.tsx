import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientJobView } from "@/components/cleantrack/client-job-view";
import { getJobByShareToken } from "@/lib/cleantrack/jobs";

export const dynamic = "force-dynamic";

/**
 * Public read-only job view, reached by an unguessable link.
 *
 * The whole point is that a client can watch progress without an account —
 * the fastest thing to put in front of someone on day one. The trade-off is
 * that the URL is the credential, so:
 *   - it is noindex (also set globally in the root layout)
 *   - it can be revoked and rotated from the admin job page
 *   - it shows the job and nothing else: no client list, no other vessels,
 *     no way to walk to another job from here
 */
export const metadata: Metadata = {
  title: "Cleaning progress",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SharedJobPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const job = await getJobByShareToken(token);
  if (!job) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <span className="text-[15px] font-bold tracking-tight text-slate-900">
            CleanTrack
          </span>
          <span className="text-[13px] text-slate-500">
            Cleanship Marine Services
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <ClientJobView job={job} />
        <p className="mt-8 text-center text-[12px] text-slate-500">
          Live progress for {job.clientName}. This link is private — please do
          not share it further.
        </p>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientJobView } from "@/components/cleantrack/client-job-view";
import { getJobByShareToken } from "@cleanship/backend/cleantrack/jobs";
import { hasShareAccess } from "@/lib/share-session";
import { ShareGate } from "./gate";

export const dynamic = "force-dynamic";

/**
 * The customer's view. No account, ever.
 *
 * Access is the share link plus the vessel's IMO number. See lib/share-access
 * for what that does and does not protect against — briefly, an IMO is public
 * information, so this stops a forwarded link opening straight into a job but
 * does not stop someone who knows the vessel.
 *
 * The page shows this job and nothing else: no client list, no other vessels,
 * no navigation to walk anywhere from here.
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

  /* A vessel with no IMO — a barge, a workboat — has nothing to gate on.
     Inventing a challenge it cannot answer would lock the customer out of
     their own job, so those open on the link alone. Admins can still revoke. */
  const gated = Boolean(job.imo);
  const unlocked = !gated || (await hasShareAccess(token));

  if (!unlocked) {
    return <ShareGate token={token} vesselHint={job.vesselName} />;
  }

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

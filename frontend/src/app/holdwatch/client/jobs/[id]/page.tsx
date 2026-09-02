import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/holdwatch/app-shell";
import { ClientJobView } from "@/components/holdwatch/client-job-view";
import { canViewJob, getJobDetail } from "@/lib/holdwatch/jobs";

export const dynamic = "force-dynamic";

export default async function ClientJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession("client");
  const { id } = await params;
  const job = await getJobDetail(Number(id));

  /* notFound rather than a 403: telling someone "this job exists but is not
     yours" leaks that a competitor's vessel is being worked on. */
  if (!job || !canViewJob(session, job)) notFound();

  return (
    <AppShell session={session}>
      <Link href="/holdwatch/client" className="text-[13px] font-medium text-blue-700 hover:underline">
        ← All your jobs
      </Link>
      <div className="mt-3">
        <ClientJobView job={job} />
      </div>
    </AppShell>
  );
}

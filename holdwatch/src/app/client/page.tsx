import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { JobCard } from "@/components/job-card";
import { EmptyState, PageTitle } from "@/components/ui";
import { getJobDetail, jobProgress, listJobsForClient } from "@/lib/jobs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Our jobs" };

export default async function ClientDashboard() {
  const session = await requireSession("client");

  /* A client session without a company can see nothing — that is correct, and
     it is a data problem for an admin to fix, not something to paper over by
     showing them everything. */
  const jobs = session.clientId ? await listJobsForClient(session.clientId) : [];

  const withProgress = await Promise.all(
    jobs.map(async (job) => {
      const detail = await getJobDetail(job.id);
      return { job, progress: jobProgress(job, detail?.compartments ?? []) };
    }),
  );

  const live = withProgress.filter((j) => j.job.status === "in-progress");
  const rest = withProgress.filter((j) => j.job.status !== "in-progress");

  return (
    <AppShell session={session}>
      <PageTitle
        title="Your vessels"
        subtitle={
          jobs.length === 0
            ? "No jobs on record yet."
            : `${live.length} in progress · ${jobs.length} total`
        }
      />

      {jobs.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nothing here yet"
            body="Jobs appear the moment our office schedules one against your account. If you were sent a direct link to a job, that link works without signing in."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {live.length > 0 && (
            <section>
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-amber-700">
                In progress
              </h2>
              <div className="space-y-3">
                {live.map(({ job, progress }) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    progress={progress}
                    href={`/client/jobs/${job.id}`}
                    showClient={false}
                  />
                ))}
              </div>
            </section>
          )}
          {rest.length > 0 && (
            <section>
              {live.length > 0 && (
                <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                  Scheduled and completed
                </h2>
              )}
              <div className="space-y-3">
                {rest.map(({ job, progress }) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    progress={progress}
                    href={`/client/jobs/${job.id}`}
                    showClient={false}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </AppShell>
  );
}

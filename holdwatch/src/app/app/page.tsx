import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { JobCard } from "@/components/job-card";
import { EmptyState, PageTitle } from "@/components/ui";
import { getJobDetail, jobProgress, listJobsForSupervisor } from "@/lib/jobs";
import { InstallPrompt } from "@/components/install-prompt";

export const dynamic = "force-dynamic";
export const metadata = { title: "My jobs" };

export default async function SupervisorJobsPage() {
  const session = await requireSession("supervisor", "admin");
  const jobs = await listJobsForSupervisor(session.sub);

  /* Progress needs the compartments, which the list query does not join —
     a job has a handful of them, and this page shows a handful of jobs. */
  const withProgress = await Promise.all(
    jobs.map(async (job) => {
      const detail = await getJobDetail(job.id);
      return { job, progress: jobProgress(job, detail?.compartments ?? []) };
    }),
  );

  const active = withProgress.filter((j) => j.job.status !== "complete");
  const done = withProgress.filter((j) => j.job.status === "complete");

  return (
    <AppShell session={session}>
      <InstallPrompt />
      <PageTitle
        title={`Hello, ${session.name.split(" ")[0]}`}
        subtitle={
          jobs.length === 0
            ? "No jobs assigned to you yet."
            : `${active.length} active ${active.length === 1 ? "job" : "jobs"}`
        }
      />

      {jobs.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nothing assigned yet"
            body="When the office assigns you a vessel it will appear here. You can open this page on the dock — it works without signal once it has loaded."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <section className="space-y-3">
            {active.map(({ job, progress }) => (
              <JobCard
                key={job.id}
                job={job}
                progress={progress}
                href={`/app/jobs/${job.id}`}
              />
            ))}
          </section>

          {done.length > 0 && (
            <section>
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                Completed
              </h2>
              <div className="space-y-3">
                {done.map(({ job, progress }) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    progress={progress}
                    href={`/app/jobs/${job.id}`}
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

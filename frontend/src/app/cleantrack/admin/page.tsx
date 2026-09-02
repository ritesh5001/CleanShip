import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/cleantrack/app-shell";
import { JobCard } from "@/components/cleantrack/job-card";
import { EmptyState, LinkButton, PageTitle } from "@/components/cleantrack/ui";
import { getJobDetail, jobProgress, listAllJobs } from "@/lib/cleantrack/jobs";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jobs" };

export default async function AdminJobsPage() {
  const session = await requireSession("admin");
  const jobs = await listAllJobs();

  const withProgress = await Promise.all(
    jobs.map(async (job) => {
      const detail = await getJobDetail(job.id);
      return { job, progress: jobProgress(job, detail?.compartments ?? []) };
    }),
  );

  const live = withProgress.filter((j) => j.job.status === "in-progress");
  const rest = withProgress.filter((j) => j.job.status !== "in-progress");

  return (
    <AppShell session={session} wide>
      <PageTitle
        title="Jobs"
        subtitle={`${jobs.length} total · ${live.length} running now`}
        action={<LinkButton href="/cleantrack/admin/jobs/new">New job</LinkButton>}
      />

      {jobs.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No jobs yet"
            body="Create a job with the vessel, client, port and number of holds. Assign a supervisor and they will see it on their phone immediately."
            action={<LinkButton href="/cleantrack/admin/jobs/new">Create the first job</LinkButton>}
          />
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {live.length > 0 && (
            <section>
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-amber-700">
                Running now
              </h2>
              <div className="grid gap-3 lg:grid-cols-2">
                {live.map(({ job, progress }) => (
                  <JobCard key={job.id} job={job} progress={progress} href={`/cleantrack/admin/jobs/${job.id}`} />
                ))}
              </div>
            </section>
          )}
          <section>
            {live.length > 0 && (
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                Everything else
              </h2>
            )}
            <div className="grid gap-3 lg:grid-cols-2">
              {rest.map(({ job, progress }) => (
                <JobCard key={job.id} job={job} progress={progress} href={`/cleantrack/admin/jobs/${job.id}`} />
              ))}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}

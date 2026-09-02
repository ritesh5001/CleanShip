import { asc, eq, sql } from "drizzle-orm";
import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/cleantrack/app-shell";
import { Card, PageTitle } from "@/components/cleantrack/ui";
import { db } from "@/lib/db";
import { ctClients as clients, ctJobs as jobs } from "@/lib/db/schema";
import { NewClientForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const session = await requireSession("admin");

  const rows = await db
    .select({
      client: clients,
      jobCount: sql<number>`count(${jobs.id})::int`,
    })
    .from(clients)
    .leftJoin(jobs, eq(jobs.clientId, clients.id))
    .groupBy(clients.id)
    .orderBy(asc(clients.name));

  return (
    <AppShell session={session}>
      <PageTitle title="Clients" subtitle={`${rows.length} companies`} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          {rows.length === 0 ? (
            <p className="px-5 py-8 text-center text-[14px] text-slate-500">
              No clients yet. Add the first one to create a job against it.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {rows.map(({ client, jobCount }) => (
                <li key={client.id} className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{client.name}</p>
                    <p className="mt-0.5 text-[13px] text-slate-600">
                      {[client.contactName, client.contactEmail, client.contactPhone]
                        .filter(Boolean)
                        .join(" · ") || "No contact recorded"}
                    </p>
                  </div>
                  <span className="text-[13px] text-slate-500">
                    {jobCount} {jobCount === 1 ? "job" : "jobs"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <NewClientForm />
      </div>
    </AppShell>
  );
}

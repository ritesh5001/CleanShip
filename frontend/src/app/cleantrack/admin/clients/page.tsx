import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/cleantrack/app-shell";
import { Card, PageTitle } from "@/components/cleantrack/ui";
import { ApiUnavailable } from "@/components/cleantrack/api-unavailable";
import { listClients } from "@/lib/api";
import { NewClientForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const session = await requireSession("admin");

  let rows;
  try {
    rows = await listClients();
  } catch (err) {
    return (
      <AppShell session={session}>
        <ApiUnavailable error={err} />
      </AppShell>
    );
  }

  return (
    <AppShell session={session}>
      <PageTitle title="Clients" subtitle={`${rows.length} companies`} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          {rows.length === 0 ? (
            <p className="px-5 py-8 text-center text-[14px] text-slate-500">
              No clients yet. Add the first one to create a vessel against it.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {rows.map((client) => (
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
                    {client.vesselCount}{" "}
                    {client.vesselCount === 1 ? "vessel" : "vessels"}
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

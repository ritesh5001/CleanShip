import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/cleantrack/app-shell";
import { PageTitle } from "@/components/cleantrack/ui";
import { ApiUnavailable } from "@/components/cleantrack/api-unavailable";
import { ApiError, getVessel, listClients } from "@/lib/api";
import { EditVesselForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit vessel" };

/** Admins and the superadmin can edit; supervisors never reach this page. */
export default async function EditVesselPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession("admin");
  const { id } = await params;

  let data, clients;
  try {
    [data, clients] = await Promise.all([getVessel(Number(id)), listClients()]);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    return (
      <AppShell session={session} wide>
        <ApiUnavailable error={err} />
      </AppShell>
    );
  }

  const { vessel } = data;

  return (
    <AppShell session={session} wide>
      <Link
        href={`/cleantrack/admin/vessels/${vessel.id}`}
        className="text-[13px] font-medium text-blue-700 hover:underline"
      >
        ← Back to {vessel.name}
      </Link>
      <div className="mt-3">
        <PageTitle
          title="Edit vessel"
          subtitle={`${vessel.reference} · Stages and the supervisor are changed on the vessel page.`}
        />
      </div>

      <div className="mt-6">
        <EditVesselForm
          vessel={{
            id: vessel.id,
            name: vessel.name,
            imo: vessel.imo,
            port: vessel.port,
            berth: vessel.berth,
            type: vessel.type,
            clientId: vessel.clientId,
            scheduledFor: vessel.scheduledFor,
            notes: vessel.notes,
            labels: [...vessel.compartments]
              .sort((a, b) => a.position - b.position)
              .map((c) => c.label),
          }}
          clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>
    </AppShell>
  );
}

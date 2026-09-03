import Link from "next/link";
import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/cleantrack/app-shell";
import { PageTitle } from "@/components/cleantrack/ui";
import { ApiUnavailable } from "@/components/cleantrack/api-unavailable";
import { getVesselTemplates, listClients, listSupervisors } from "@/lib/api";
import { NewVesselForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata = { title: "New vessel" };

export default async function NewVesselPage() {
  const session = await requireSession("admin");

  let clients, supervisors, templates;
  try {
    [clients, supervisors, templates] = await Promise.all([
      listClients(),
      listSupervisors(),
      getVesselTemplates(60),
    ]);
  } catch (err) {
    return (
      <AppShell session={session} wide>
        <ApiUnavailable error={err} />
      </AppShell>
    );
  }

  return (
    <AppShell session={session} wide>
      <Link
        href="/cleantrack/admin"
        className="text-[13px] font-medium text-blue-700 hover:underline"
      >
        ← All vessels
      </Link>
      <div className="mt-3">
        <PageTitle
          title="New vessel"
          subtitle="Set the holds or tanks and the stages the crew works through. Both can be edited afterwards."
        />
      </div>

      <div className="mt-6">
        <NewVesselForm
          clients={clients.map((c) => ({ id: c.id, name: c.name }))}
          supervisors={supervisors}
          templates={templates.templates}
          defaultLabels={templates.defaultLabels}
        />
      </div>
    </AppShell>
  );
}

import Link from "next/link";
import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/cleantrack/app-shell";
import { PageTitle } from "@/components/cleantrack/ui";
import { ApiUnavailable } from "@/components/cleantrack/api-unavailable";
import { getVesselTemplates, listClients, listJoiners, listSupervisors, listVessels } from "@/lib/api";
import { NewVesselForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata = { title: "New vessel" };

/** Every port and destination already on record, for the destination picker. */
function placesFrom(vessels: { port: string; destination: string | null }[]) {
  return [...new Set(vessels.flatMap((v) => [v.port, v.destination]).filter((p): p is string => Boolean(p?.trim())))]
    .sort((a, b) => a.localeCompare(b));
}

export default async function NewVesselPage() {
  const session = await requireSession("admin");

  let clients, supervisors, templates, vessels, joiners;
  try {
    [clients, supervisors, templates, vessels, joiners] = await Promise.all([
      listClients(),
      listSupervisors(),
      getVesselTemplates(60),
      listVessels(),
      listJoiners(),
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
          joiners={joiners}
          templates={templates.templates}
          defaultLabels={templates.defaultLabels}
          places={placesFrom(vessels)}
        />
      </div>
    </AppShell>
  );
}

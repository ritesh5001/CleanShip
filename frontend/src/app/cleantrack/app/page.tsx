import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/cleantrack/app-shell";
import { VesselCard } from "@/components/cleantrack/vessel-card";
import { EmptyState, PageTitle } from "@/components/cleantrack/ui";
import { ApiUnavailable } from "@/components/cleantrack/api-unavailable";
import { InstallPrompt } from "@/components/cleantrack/install-prompt";
import { listVessels } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "My vessels" };

/**
 * The supervisor's home.
 *
 * The list comes back already filtered by the API — a supervisor is only ever
 * sent the vessels assigned to them, so there is no filter to forget here.
 */
export default async function SupervisorVesselsPage() {
  const session = await requireSession("supervisor", "admin");

  let vessels;
  try {
    vessels = await listVessels();
  } catch (err) {
    return (
      <AppShell session={session}>
        <ApiUnavailable error={err} />
      </AppShell>
    );
  }

  const active = vessels.filter((v) => v.status !== "complete");
  const done = vessels.filter((v) => v.status === "complete");

  return (
    <AppShell session={session}>
      <InstallPrompt />
      <PageTitle
        title={`Hello, ${session.name.split(" ")[0]}`}
        subtitle={
          vessels.length === 0
            ? "No vessels assigned to you yet."
            : `${active.length} active ${active.length === 1 ? "vessel" : "vessels"}`
        }
      />

      {vessels.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nothing assigned yet"
            body="When the office assigns you a vessel it will appear here. You can open it on the dock — it keeps working without signal once it has loaded."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <section className="space-y-3">
            {active.map((v) => (
              <VesselCard
                key={v.id}
                vessel={v}
                href={`/cleantrack/app/vessels/${v.id}`}
              />
            ))}
          </section>

          {done.length > 0 && (
            <section>
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                Completed
              </h2>
              <div className="space-y-3">
                {done.map((v) => (
                  <VesselCard
                    key={v.id}
                    vessel={v}
                    href={`/cleantrack/app/vessels/${v.id}`}
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

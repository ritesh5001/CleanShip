import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/cleantrack/app-shell";
import { VesselCard } from "@/components/cleantrack/vessel-card";
import { EmptyState, LinkButton, PageTitle } from "@/components/cleantrack/ui";
import { listVessels } from "@/lib/api";
import { ApiUnavailable } from "@/components/cleantrack/api-unavailable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Vessels" };

export default async function AdminVesselsPage() {
  const session = await requireSession("admin");

  let vessels;
  try {
    vessels = await listVessels();
  } catch (err) {
    return (
      <AppShell session={session} wide>
        <ApiUnavailable error={err} />
      </AppShell>
    );
  }

  const live = vessels.filter((v) => v.status === "in-progress");
  const rest = vessels.filter((v) => v.status !== "in-progress");
  const unassigned = vessels.filter((v) => !v.supervisorId).length;

  return (
    <AppShell session={session} wide>
      <PageTitle
        title="Vessels"
        subtitle={`${vessels.length} total · ${live.length} alongside now${
          unassigned ? ` · ${unassigned} awaiting a supervisor` : ""
        }`}
        action={<LinkButton href="/cleantrack/admin/vessels/new">New vessel</LinkButton>}
      />

      {vessels.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No vessels yet"
            body="Create a vessel with its holds or tanks and the stages your crew works through. Assign a supervisor and it appears on their phone immediately."
            action={
              <LinkButton href="/cleantrack/admin/vessels/new">
                Create the first vessel
              </LinkButton>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {live.length > 0 && (
            <section>
              <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-amber-700">
                Working now
              </h2>
              <div className="grid gap-3 lg:grid-cols-2">
                {live.map((v) => (
                  <VesselCard
                    key={v.id}
                    vessel={v}
                    href={`/cleantrack/admin/vessels/${v.id}`}
                  />
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
              {rest.map((v) => (
                <VesselCard
                  key={v.id}
                  vessel={v}
                  href={`/cleantrack/admin/vessels/${v.id}`}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}

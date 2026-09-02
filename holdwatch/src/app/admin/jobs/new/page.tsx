import { asc, eq } from "drizzle-orm";
import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { PageTitle } from "@/components/ui";
import { db } from "@/lib/db";
import { clients, users } from "@/lib/db/schema";
import { NewJobForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata = { title: "New job" };

export default async function NewJobPage() {
  const session = await requireSession("admin");

  const [clientRows, supervisorRows] = await Promise.all([
    db.select().from(clients).orderBy(asc(clients.name)),
    db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.role, "supervisor"))
      .orderBy(asc(users.name)),
  ]);

  return (
    <AppShell session={session}>
      <PageTitle
        title="New job"
        subtitle="The supervisor sees it on their phone the moment you save."
      />
      <div className="mt-6">
        <NewJobForm clients={clientRows} supervisors={supervisorRows} />
      </div>
    </AppShell>
  );
}

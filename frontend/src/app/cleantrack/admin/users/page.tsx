import { asc } from "drizzle-orm";
import { requireSession } from "@/lib/auth";
import { AppShell } from "@/components/cleantrack/app-shell";
import { Card, PageTitle } from "@/components/cleantrack/ui";
import { db } from "@/lib/db";
import { ctClients as clients, users } from "@/lib/db/schema";
import { toggleUserActiveAction } from "../actions";
import { NewUserForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata = { title: "People" };

const ROLE_STYLE: Record<string, string> = {
  admin: "bg-blue-100 text-blue-800 border-blue-300",
  supervisor: "bg-amber-100 text-amber-800 border-amber-300",
  client: "bg-slate-100 text-slate-700 border-slate-300",
};

export default async function UsersPage() {
  const session = await requireSession("admin");

  const [people, clientRows] = await Promise.all([
    db.select().from(users).orderBy(asc(users.role), asc(users.name)),
    db.select({ id: clients.id, name: clients.name }).from(clients).orderBy(asc(clients.name)),
  ]);

  const clientName = new Map(clientRows.map((c) => [c.id, c.name]));

  return (
    <AppShell session={session}>
      <PageTitle title="People" subtitle={`${people.length} accounts`} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <ul className="divide-y divide-slate-100">
            {people.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{u.name}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${ROLE_STYLE[u.role]}`}>
                      {u.role}
                    </span>
                    {u.active === 0 && (
                      <span className="rounded-full border border-red-300 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                        Disabled
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[13px] text-slate-600">
                    {u.email}
                    {u.clientId ? ` · ${clientName.get(u.clientId) ?? "Unknown company"}` : ""}
                  </p>
                </div>
                {u.id !== session.sub && (
                  <form action={toggleUserActiveAction}>
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="active" value={u.active === 1 ? "0" : "1"} />
                    <button
                      type="submit"
                      className="min-h-11 rounded-md border border-slate-300 px-3 text-[13px] font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      {u.active === 1 ? "Disable" : "Enable"}
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <NewUserForm clients={clientRows} />
      </div>
    </AppShell>
  );
}

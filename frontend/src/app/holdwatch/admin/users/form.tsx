"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createUserAction, type FormState } from "../actions";
import { Button, Card, Field, inputClass } from "@/components/holdwatch/ui";

const initial: FormState = {};

export function NewUserForm({ clients }: { clients: { id: number; name: string }[] }) {
  const [state, action] = useActionState(createUserAction, initial);
  const [role, setRole] = useState("supervisor");

  return (
    <Card className="h-fit p-5">
      <h2 className="text-base font-bold text-slate-900">Add a person</h2>
      <form action={action} className="mt-4 space-y-4">
        {state.error && (
          <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-800">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p role="status" className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
            {state.ok}
          </p>
        )}

        <Field label="Name">
          <input name="name" required className={inputClass} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required autoCapitalize="none" className={inputClass} />
        </Field>
        <Field label="Role">
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClass}
          >
            <option value="supervisor">Supervisor — updates jobs on site</option>
            <option value="client">Client — read-only, their company only</option>
            <option value="admin">Admin — everything</option>
          </select>
        </Field>

        {role === "client" && (
          <Field label="Company" hint="Which client's jobs they can see.">
            <select name="clientId" required defaultValue="" className={inputClass}>
              <option value="" disabled>Choose a company</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Phone" hint="Optional">
          <input name="phone" className={inputClass} />
        </Field>
        <Field
          label="Temporary password"
          hint="At least 10 characters. Send it to them privately — there is no reset email yet."
        >
          <input name="password" type="text" required minLength={10} className={inputClass} />
        </Field>

        <Submit />
      </form>
    </Card>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating…" : "Create account"}
    </Button>
  );
}

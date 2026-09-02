"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createClientAction, type FormState } from "../actions";
import { Button, Card, Field, inputClass } from "@/components/ui";

const initial: FormState = {};

export function NewClientForm() {
  const [state, action] = useActionState(createClientAction, initial);

  return (
    <Card className="h-fit p-5">
      <h2 className="text-base font-bold text-slate-900">Add a client</h2>
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
        <Field label="Company name">
          <input name="name" required className={inputClass} />
        </Field>
        <Field label="Contact name" hint="Optional">
          <input name="contactName" className={inputClass} />
        </Field>
        <Field label="Contact email" hint="Optional">
          <input name="contactEmail" type="email" className={inputClass} />
        </Field>
        <Field label="Contact phone" hint="Optional">
          <input name="contactPhone" className={inputClass} />
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
      {pending ? "Adding…" : "Add client"}
    </Button>
  );
}

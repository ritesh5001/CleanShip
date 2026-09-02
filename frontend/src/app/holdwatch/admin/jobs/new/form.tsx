"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createJobAction, type FormState } from "../../actions";
import { Button, Card, Field, inputClass } from "@/components/holdwatch/ui";
import { compartmentLabel, compartmentNoun, stagesFor, type JobType } from "@/lib/holdwatch/stages";

const initial: FormState = {};

export function NewJobForm({
  clients,
  supervisors,
}: {
  clients: { id: number; name: string }[];
  supervisors: { id: number; name: string }[];
}) {
  const [state, action] = useActionState(createJobAction, initial);
  const [jobType, setJobType] = useState<JobType>("hold-cleaning");
  const [count, setCount] = useState(5);

  const stages = stagesFor(jobType);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      <Card className="p-5 lg:col-span-2">
        {state.error && (
          <p
            role="alert"
            className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-800"
          >
            {state.error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Vessel name">
              <input name="vesselName" required className={inputClass} placeholder="MV Example" />
            </Field>
          </div>

          <Field label="IMO number" hint="7 digits. Leave blank for craft without one.">
            <input name="imo" inputMode="numeric" className={inputClass} placeholder="9123456" />
          </Field>

          <Field label="Client">
            <select name="clientId" required defaultValue="" className={inputClass}>
              <option value="" disabled>Choose a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Port">
            <input name="port" required className={inputClass} placeholder="Kandla" />
          </Field>

          <Field label="Berth or anchorage" hint="Optional">
            <input name="berth" className={inputClass} placeholder="Oil jetty 3" />
          </Field>

          <Field label="Job type">
            <select
              name="jobType"
              value={jobType}
              onChange={(e) => setJobType(e.target.value as JobType)}
              className={inputClass}
            >
              <option value="hold-cleaning">Hold cleaning</option>
              <option value="tank-cleaning">Tank cleaning</option>
            </select>
          </Field>

          <Field
            label={`Number of ${compartmentNoun(jobType, true).toLowerCase()}`}
            hint="Creates one checklist per compartment."
          >
            <input
              name="compartmentCount"
              type="number"
              min={1}
              max={30}
              required
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className={inputClass}
            />
          </Field>

          <Field label="Supervisor" hint="Can be assigned later.">
            <select name="supervisorId" defaultValue="" className={inputClass}>
              <option value="">Unassigned</option>
              {supervisors.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Scheduled for" hint="Optional">
            <input name="scheduledFor" type="date" className={inputClass} />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Notes for the supervisor" hint="Previous cargo, next fixture, anything they need on the day.">
              <textarea name="notes" rows={3} className={`${inputClass} min-h-24 py-2`} />
            </Field>
          </div>
        </div>

        <div className="mt-6">
          <SubmitButton />
        </div>
      </Card>

      {/* Live preview — the number of holds is the field people get wrong,
          and seeing "Hold 1 … Hold 12" appear catches it before saving. */}
      <Card className="h-fit p-5">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
          What gets created
        </h2>
        <p className="mt-3 text-[13px] text-slate-600">
          {count} {compartmentNoun(jobType, count !== 1).toLowerCase()}, each with
          a {stages.length}-stage checklist.
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {Array.from({ length: Math.min(count, 30) }, (_, i) => (
            <li
              key={i}
              className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[12px] font-medium text-slate-700"
            >
              {compartmentLabel(jobType, i)}
            </li>
          ))}
        </ul>
        <h3 className="mt-5 text-[13px] font-semibold uppercase tracking-wider text-slate-500">
          Stages
        </h3>
        <ol className="mt-2 space-y-1 text-[13px] text-slate-700">
          {stages.map((s, i) => (
            <li key={s.key}>
              <span className="font-mono text-slate-400">{i + 1}.</span> {s.label}
            </li>
          ))}
        </ol>
      </Card>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating…" : "Create job"}
    </Button>
  );
}

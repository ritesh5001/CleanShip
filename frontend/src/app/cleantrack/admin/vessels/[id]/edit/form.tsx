"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateVesselAction, type FormState } from "../../../actions";
import { Button, Card, Field, inputClass } from "@/components/cleantrack/ui";
import { compartmentNoun, type VesselType } from "@/lib/cleantrack/types";

const initial: FormState = {};

type EditableVessel = {
  id: number;
  name: string;
  imo: string | null;
  port: string;
  berth: string | null;
  destination: string | null;
  type: VesselType;
  clientId: number | null;
  scheduledFor: string | null;
  notes: string | null;
  labels: string[];
};

/**
 * Edits an existing vessel: its details, and the number and names of its
 * holds or tanks.
 *
 * Holds are matched by position, so removing some deletes the last ones along
 * with everything recorded against them. The form says so, and asks again on
 * save, before that can happen.
 */
export function EditVesselForm({
  vessel,
  clients,
  places,
}: {
  vessel: EditableVessel;
  clients: { id: number; name: string }[];
  /** Ports and destinations already used, offered as suggestions. */
  places: string[];
}) {
  const [state, action] = useActionState(updateVesselAction, initial);
  const [labels, setLabels] = useState<string[]>(vessel.labels);

  const noun = compartmentNoun(vessel.type).toLowerCase();
  const nouns = compartmentNoun(vessel.type, true).toLowerCase();
  const removed = Math.max(0, vessel.labels.length - labels.length);
  const labelsChanged =
    labels.length !== vessel.labels.length ||
    labels.some((l, i) => l.trim() !== vessel.labels[i]);

  function setCount(next: number) {
    const count = Math.min(60, Math.max(1, next || 1));
    setLabels((prev) =>
      count <= prev.length
        ? prev.slice(0, count)
        : [
            ...prev,
            /* Same defaults the API gives a new vessel: numbered holds, and
               tanks in port/starboard pairs (1p, 1s, 2p…). */
            ...Array.from({ length: count - prev.length }, (_, i) => {
              const index = prev.length + i;
              return vessel.type === "hold"
                ? `Hold No. ${index + 1}`
                : `${Math.floor(index / 2) + 1}${index % 2 === 0 ? "p" : "s"}`;
            }),
          ],
    );
  }

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          removed > 0 &&
          !window.confirm(
            `Removing ${removed} ${removed === 1 ? noun : nouns} also deletes everything recorded on ${
              removed === 1 ? "it" : "them"
            }. Continue?`,
          )
        ) {
          e.preventDefault();
        }
      }}
      className="grid gap-6 lg:grid-cols-3"
    >
      <input type="hidden" name="vesselId" value={vessel.id} />
      {labelsChanged && (
        <input
          type="hidden"
          name="compartmentLabels"
          value={JSON.stringify(labels.map((l) => l.trim()))}
        />
      )}

      <div className="space-y-6 lg:col-span-2">
        <Card className="p-5">
          {state.error && (
            <p
              role="alert"
              className="mb-4 rounded-none border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-800"
            >
              {state.error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Vessel name">
                <input name="name" required defaultValue={vessel.name} className={inputClass} />
              </Field>
            </div>

            <Field label="IMO number" hint="7 digits. Optional.">
              <input
                name="imo"
                inputMode="numeric"
                defaultValue={vessel.imo ?? ""}
                className={inputClass}
              />
            </Field>

            <Field label="Client">
              <select name="clientId" defaultValue={vessel.clientId ?? ""} className={inputClass}>
                <option value="">No client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Port">
              <input name="port" required defaultValue={vessel.port} className={inputClass} />
            </Field>

            <Field label="Berth or anchorage" hint="Optional">
              <input name="berth" defaultValue={vessel.berth ?? ""} className={inputClass} />
            </Field>

            <Field label="Destination" hint="Optional. Where the vessel sails to next.">
              <input
                name="destination"
                list="destination-suggestions"
                autoComplete="off"
                className={inputClass}
                placeholder="Singapore"
                defaultValue={vessel.destination ?? ""}
              />
              <datalist id="destination-suggestions">
                {places.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </Field>

            <Field label="Scheduled for" hint="Optional">
              <input
                name="scheduledFor"
                type="date"
                defaultValue={vessel.scheduledFor?.slice(0, 10) ?? ""}
                className={inputClass}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Notes for the supervisor">
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={vessel.notes ?? ""}
                  className={`${inputClass} min-h-24 py-2`}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
            {compartmentNoun(vessel.type, true)}
          </h2>

          <div className="mt-4 max-w-xs">
            <Field label={`Number of ${nouns}`}>
              <input
                type="number"
                min={1}
                max={60}
                value={labels.length}
                onChange={(e) => setCount(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          </div>

          {removed > 0 && (
            <p className="mt-3 rounded-none border border-amber-300 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
              The last {removed} {removed === 1 ? noun : nouns} and everything recorded on{" "}
              {removed === 1 ? "it" : "them"} will be deleted when you save.
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {labels.map((label, i) => (
              <input
                key={i}
                value={label}
                maxLength={40}
                onChange={(e) =>
                  setLabels((prev) => prev.map((l, j) => (j === i ? e.target.value : l)))
                }
                aria-label={`${compartmentNoun(vessel.type)} ${i + 1} name`}
                className="min-h-10 rounded-none border border-slate-300 px-2 text-[13px] text-slate-900 outline-none focus:border-blue-600"
              />
            ))}
          </div>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton />
          <Link
            href={`/cleantrack/admin/vessels/${vessel.id}`}
            className="text-[14px] font-medium text-slate-600 hover:underline"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </Button>
  );
}

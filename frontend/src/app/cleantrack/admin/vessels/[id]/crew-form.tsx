"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  assignCrewAction,
  setCrewListsAction,
  type FormState,
} from "../../actions";

const initial: FormState = {};

/**
 * Putting people on a vessel's crew.
 *
 * A multi-select rather than one-at-a-time, because a gang is rostered in one
 * sitting — four people off the same flight — and four round trips through a
 * server action is four page reloads to do one thing.
 *
 * Supervisors are in the list alongside crew on purpose: a supervisor joins
 * the ship the same way, carries the same documents and fills in the same
 * sheet. Leaving them off would mean a board that reads "ready to fly" while
 * the person leading the job has no passport recorded.
 */
export function AddCrewForm({
  vesselId,
  joiners,
  alreadyOn,
  disabled,
}: {
  vesselId: number;
  joiners: { id: number; name: string; email: string; role: string }[];
  alreadyOn: number[];
  disabled: boolean;
}) {
  const [state, action] = useActionState(assignCrewAction, initial);
  const on = new Set(alreadyOn);
  const available = joiners.filter((j) => !on.has(j.id));

  if (disabled) {
    return (
      <p className="px-5 py-4 text-[13px] text-slate-600">
        The crew have reported to the hold. Reopen joining above to change the
        roster.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-3 px-5 py-4">
      <input type="hidden" name="vesselId" value={vesselId} />

      <div>
        <label
          htmlFor="crew-userId"
          className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"
        >
          Add to crew
        </label>
        {available.length === 0 ? (
          <p className="text-[13px] text-slate-600">
            Everyone on the books is already on this vessel. Add more people
            under <span className="font-semibold">Users</span>.
          </p>
        ) : (
          <select
            id="crew-userId"
            name="userId"
            multiple
            size={Math.min(6, Math.max(3, available.length))}
            className="w-full rounded-none border border-slate-300 px-2 py-2 text-[14px] text-slate-900"
          >
            {available.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name} — {j.role}
              </option>
            ))}
          </select>
        )}
        <p className="mt-1 text-[11px] text-slate-500">
          Hold ⌘ or Ctrl to pick several.
        </p>
      </div>

      {state.error && (
        <p className="border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="border border-emerald-300 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
          {state.ok}
        </p>
      )}

      {available.length > 0 && <Submit label="Add to crew" />}
    </form>
  );
}

/**
 * What this vessel asks its joiners for.
 *
 * One label per line, which is the fastest way to reorder and reword a list of
 * twenty short strings — a row of drag handles would be prettier and slower.
 *
 * Renaming a row keeps every answer already recorded against it: the API only
 * derives a key for rows that arrive without one, and the rows submitted here
 * carry theirs implicitly by position. Deleting a row stops it being counted
 * rather than destroying anything, so putting it back brings the answers with
 * it.
 */
export function CrewListsForm({
  vesselId,
  documents,
  checklist,
  disabled,
}: {
  vesselId: number;
  documents: { key: string; label: string }[];
  checklist: { key: string; label: string }[];
  disabled: boolean;
}) {
  const [state, action] = useActionState(setCrewListsAction, initial);

  if (disabled) {
    return (
      <p className="px-5 py-4 text-[13px] text-slate-600">
        The crew are aboard — the joining sheet for this vessel is now a record
        and its rows are fixed.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-3 px-5 py-4">
      <input type="hidden" name="vesselId" value={vesselId} />

      <div>
        <label
          htmlFor="crew-documents"
          className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"
        >
          Documents — one per line
        </label>
        <textarea
          id="crew-documents"
          name="documents"
          rows={8}
          defaultValue={documents.map((d) => d.label).join("\n")}
          className="w-full rounded-none border border-slate-300 px-2 py-2 font-mono text-[13px] text-slate-900"
        />
      </div>

      <div>
        <label
          htmlFor="crew-checklist"
          className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"
        >
          Checklist — one per line
        </label>
        <textarea
          id="crew-checklist"
          name="checklist"
          rows={12}
          defaultValue={checklist.map((c) => c.label).join("\n")}
          className="w-full rounded-none border border-slate-300 px-2 py-2 font-mono text-[13px] text-slate-900"
        />
      </div>

      {state.error && (
        <p className="border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="border border-emerald-300 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
          {state.ok}
        </p>
      )}

      <Submit label="Save joining sheet" />
    </form>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 w-full rounded-none bg-[#1461a0] px-4 text-[14px] font-semibold text-white hover:bg-[#0e3d6b] disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

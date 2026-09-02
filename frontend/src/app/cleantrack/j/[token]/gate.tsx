"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { unlockShare, type GateState } from "./actions";

const initial: GateState = {};

/**
 * The IMO gate.
 *
 * Deliberately spare: whoever lands here has been sent a link and told a
 * vessel name. One field, and copy that says exactly where to find the number
 * rather than assuming they know.
 */
export function ShareGate({
  token,
  vesselHint,
}: {
  token: string;
  /** Shown so the person knows which vessel's IMO to enter. */
  vesselHint: string;
}) {
  const [state, action] = useActionState(unlockShare, initial);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-700">
            Cleanship
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Cleaning progress
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter the IMO number for <strong>{vesselHint}</strong> to view live
            progress.
          </p>
        </div>

        <form
          action={action}
          className="space-y-4 rounded-lg border border-slate-200 bg-white p-6"
        >
          <input type="hidden" name="token" value={token} />

          {state.error && (
            <p
              role="alert"
              className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[13px] text-red-800"
            >
              {state.error}
            </p>
          )}

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">
              IMO number
            </span>
            <input
              name="imo"
              required
              inputMode="numeric"
              autoComplete="off"
              placeholder="9123456"
              className="w-full min-h-11 rounded-md border border-slate-300 bg-white px-3 text-[16px] tracking-wider text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <span className="mt-1 block text-[12px] text-slate-500">
              Seven digits, on the vessel&apos;s particulars or certificate of
              registry.
            </span>
          </label>

          <Submit />
        </form>

        <p className="mt-6 text-center text-[13px] text-slate-500">
          Trouble getting in? Contact the operations desk.
        </p>
      </div>
    </main>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 w-full rounded-md bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
    >
      {pending ? "Checking…" : "View progress"}
    </button>
  );
}

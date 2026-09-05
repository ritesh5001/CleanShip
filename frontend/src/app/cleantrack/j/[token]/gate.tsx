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
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#060b14] px-4 py-12">
      {/* Same light as the page behind it: the gate is the first impression,
          and a light door onto a dark room reads as two different products. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(56,189,248,0.12), transparent 65%)",
        }}
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-sky-400">
            Cleanship
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white">
            Cleaning progress
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter the IMO number for <strong>{vesselHint}</strong> to view live
            progress.
          </p>
        </div>

        <form
          action={action}
          className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
        >
          <input type="hidden" name="token" value={token} />

          {state.error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[13px] text-red-300"
            >
              {state.error}
            </p>
          )}

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-slate-300">
              IMO number
            </span>
            <input
              name="imo"
              required
              inputMode="numeric"
              autoComplete="off"
              placeholder="9123456"
              className="min-h-12 w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 text-[16px] tracking-[0.2em] text-white outline-none transition-colors placeholder:text-slate-600 focus:border-sky-400/60 focus:bg-white/[0.08] focus:ring-2 focus:ring-sky-500/20"
            />
            <span className="mt-1.5 block text-[12px] text-slate-500">
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
      className="min-h-12 w-full rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-4 text-sm font-bold text-slate-950 transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Checking…" : "View progress"}
    </button>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminLogin, type LoginState } from "./actions";

const initial: LoginState = {};

/**
 * The office door.
 *
 * Separate from the crew login at /cleantrack/login on purpose. They check the
 * same credentials, but a supervisor on a dock and an admin at a desk are
 * different arrivals: the crew page is phone-shaped and goes straight to the
 * job list, this one is for the inbox and the job board.
 */
export default function AdminLoginPage() {
  const [state, action] = useActionState(adminLogin, initial);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-700">
            Cleanship
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Office sign-in
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enquiries and CleanTrack job management.
          </p>
        </div>

        <form
          action={action}
          className="space-y-4 rounded-lg border border-slate-200 bg-white p-6"
        >
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
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              autoCapitalize="none"
              className="w-full min-h-11 rounded-md border border-slate-300 bg-white px-3 text-[16px] text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full min-h-11 rounded-md border border-slate-300 bg-white px-3 text-[16px] text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <Submit />
        </form>

        <p className="mt-6 text-center text-[13px] text-slate-500">
          Supervisors sign in at{" "}
          <Link href="/cleantrack/login" className="text-blue-700 hover:underline">
            the CleanTrack crew login
          </Link>
          .
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
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

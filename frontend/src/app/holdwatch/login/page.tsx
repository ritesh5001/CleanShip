"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type LoginState } from "./actions";
import { Button, Field, inputClass } from "@/components/holdwatch/ui";

const initial: LoginState = {};

export default function LoginPage() {
  const [state, action] = useActionState(login, initial);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-700">
            Cleanship
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Hold Watch
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Live cleaning progress, from the vessel to the client.
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

          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              autoCapitalize="none"
              className={inputClass}
            />
          </Field>

          <Field label="Password">
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </Field>

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-[13px] text-slate-500">
          Clients with a share link do not need an account.
        </p>
      </div>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

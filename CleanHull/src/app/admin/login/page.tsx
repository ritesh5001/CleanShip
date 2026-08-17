"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";

const fieldClass =
  "w-full min-h-11 border border-line-200 bg-white px-4 py-2.5 text-[15px] text-ink-900 placeholder:text-slate-400 transition-colors duration-[140ms] focus:border-blue-400 focus:outline-none";

const labelClass = "label-caps mb-2 block text-[11px] text-slate-500";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      await api.post("/api/auth/login", { email, password });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Could not reach the API. Check your connection and try again.",
      );
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-20">
      <h1 className="font-display text-[26px] font-bold uppercase leading-tight text-ink-900">
        Admin sign in
      </h1>
      <p className="mt-2 text-[14px] text-slate-500">
        Operations desk access — enquiries inbox and site content.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {error && (
          <p
            role="alert"
            className="border border-danger-600/30 bg-danger-100 px-4 py-3 text-[14px] text-danger-600"
          >
            {error}
          </p>
        )}

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="label-caps inline-flex h-12 w-full items-center justify-center bg-blue-600 px-6 text-white transition-colors duration-[140ms] hover:bg-navy-700 active:scale-[.985] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

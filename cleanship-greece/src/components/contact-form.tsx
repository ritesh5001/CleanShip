"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";
import { Turnstile } from "./turnstile";

const initial: EnquiryState = { status: "idle", message: "" };
const input =
  "w-full min-h-11 border border-line-200 bg-white px-3.5 py-2.5 text-[15px] text-ink-900 outline-none focus:border-blue-600";

export function ContactForm({
  services,
  defaultService,
  defaultMessage,
}: {
  services: string[];
  defaultService?: string;
  defaultMessage?: string;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);

  if (state.status === "success") {
    return (
      <div role="status" className="border border-success-600 bg-success-100 p-6 text-[16px] text-ink-900">
        {state.message}
      </div>
    );
  }

  const err = (k: string) =>
    state.errors?.[k] ? <p className="mt-1 text-[13px] text-danger-600">{state.errors[k]}</p> : null;

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <label htmlFor="name" className="label-caps text-[11px] text-slate-600">Name *</label>
        <input id="name" name="name" required autoComplete="name" className={`${input} mt-1.5`} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="email" className="label-caps text-[11px] text-slate-600">Email *</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={`${input} mt-1.5`} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="phone" className="label-caps text-[11px] text-slate-600">Phone / WhatsApp</label>
        <input id="phone" name="phone" autoComplete="tel" className={`${input} mt-1.5`} />
        {err("phone")}
      </div>
      <div>
        <label htmlFor="company" className="label-caps text-[11px] text-slate-600">Company</label>
        <input id="company" name="company" autoComplete="organization" className={`${input} mt-1.5`} />
        {err("company")}
      </div>
      <div>
        <label htmlFor="vessel" className="label-caps text-[11px] text-slate-600">Vessel name / IMO</label>
        <input id="vessel" name="vessel" className={`${input} mt-1.5`} />
        {err("vessel")}
      </div>
      <div>
        <label htmlFor="service" className="label-caps text-[11px] text-slate-600">Service</label>
        <select id="service" name="service" defaultValue={defaultService ?? ""} className={`${input} mt-1.5`}>
          <option value="">Choose a service</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="label-caps text-[11px] text-slate-600">Port, window and scope *</label>
        <textarea id="message" name="message" rows={5} required defaultValue={defaultMessage} className={`${input} mt-1.5`} placeholder="Port, ETA, how long the ship is there, and what you need done." />
        {err("message")}
      </div>
      <div className="sm:col-span-2">
        <Turnstile resetKey={state} />
      </div>
      {state.status === "error" && (
        <p role="alert" className="border border-danger-600 bg-danger-100 p-3 text-[14px] text-ink-900 sm:col-span-2">
          {state.message}
        </p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center bg-blue-600 px-7 text-[14px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-navy-700 disabled:opacity-60">
          {pending ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}

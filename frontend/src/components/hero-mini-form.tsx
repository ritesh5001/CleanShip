"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";
import { serviceCategories } from "@/lib/services";
import { ArrowIcon, CheckIcon } from "./icons";

const initialState: EnquiryState = { status: "idle", message: "" };

/* Fields sit on navy, so the light-surface field spec is inverted: translucent
   white fill, white-alpha border, aqua focus ring. 44px control height floor. */
const field =
  "w-full min-h-11 border border-white/25 bg-white/10 px-3.5 py-2.5 text-[15px] text-white placeholder:text-white/45 transition-colors duration-[140ms] focus:border-aqua-500 focus:bg-white/15 focus:outline-none";
const label = "label-caps mb-1.5 block text-[11px] text-white/60";
const errorText = "mt-1.5 text-[12px] text-aqua-200";

/**
 * Compact enquiry form for the homepage hero.
 *
 * Four fields only — email, phone, service, submit. The full form on the
 * contact and service pages asks for the vessel, port and window, which is the
 * right question once someone has decided to enquire. In the hero it is the
 * wrong one: it asks a visitor who has read two lines of copy to compose a
 * paragraph. Four fields is the version people actually complete.
 *
 * The server action is shared with the full form, so validation, the honeypot
 * and delivery all behave identically. `message` is posted as a short marker
 * because the action requires one — the service and phone carry the intent.
 */
export function HeroMiniForm() {
  const [state, formAction] = useActionState(submitEnquiry, initialState);

  if (state.status === "success") {
    return (
      <div className="rule-accent-top border border-white/20 bg-abyss-950/80 p-6">
        <div className="flex gap-3">
          <CheckIcon className="mt-0.5 size-5 shrink-0 text-aqua-500" />
          <div>
            <h2 className="font-display text-[18px] font-bold uppercase leading-tight text-white">
              Enquiry received
            </h2>
            <p className="mt-2 text-[14px] leading-[1.6] text-white/72">
              {state.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rule-accent-top border border-white/20 bg-abyss-950/80 p-6">
      <h2 className="font-display text-[20px] font-bold uppercase leading-tight text-white">
        Request a quote
      </h2>
      <p className="mt-2 text-[13px] leading-[1.55] text-white/65">
        Scoped reply, usually the same working day.
      </p>

      <form action={formAction} className="mt-5 space-y-3.5" noValidate>
        {/* Honeypot — only automated submitters fill this in. */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="mini-website">Leave this field empty</label>
          <input id="mini-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {/* The shared action requires a message; the service field carries the
            intent here, so a marker keeps the payload valid without asking
            the visitor for prose they have not decided to write yet. */}
        <input
          type="hidden"
          name="message"
          value="Quick enquiry from the homepage form."
        />
        <input type="hidden" name="name" value="Website enquiry" />

        {state.status === "error" && !state.errors && (
          <p
            role="alert"
            className="border border-danger-600/40 bg-danger-600/20 px-3 py-2 text-[13px] text-white"
          >
            {state.message}
          </p>
        )}

        <div>
          <label htmlFor="mini-email" className={label}>
            Email <span className="text-aqua-500">*</span>
          </label>
          <input
            id="mini-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={state.errors?.email ? true : undefined}
            aria-describedby={state.errors?.email ? "mini-email-err" : undefined}
            className={field}
          />
          {state.errors?.email && (
            <p id="mini-email-err" role="alert" className={errorText}>
              {state.errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="mini-phone" className={label}>
            Phone
          </label>
          <input
            id="mini-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+971 …"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="mini-service" className={label}>
            Service <span className="text-aqua-500">*</span>
          </label>
          <select
            id="mini-service"
            name="service"
            required
            defaultValue=""
            aria-invalid={state.errors?.service ? true : undefined}
            aria-describedby={
              state.errors?.service ? "mini-service-err" : undefined
            }
            className={`${field} appearance-none bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300b0b9' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceCategories.map((category) => (
              <optgroup key={category.slug} label={category.name}>
                {category.services.map((service) => (
                  <option
                    key={service.slug}
                    value={service.name}
                    className="text-ink-900"
                  >
                    {service.name}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value="Other / not sure" className="text-ink-900">
              Other / not sure
            </option>
          </select>
          {state.errors?.service && (
            <p id="mini-service-err" role="alert" className={errorText}>
              {state.errors.service}
            </p>
          )}
        </div>

        <SubmitButton />

        <p className="text-[12px] leading-[1.5] text-white/50">
          Need a scoped quote? The{" "}
          <Link
            href="/contact"
            className="text-aqua-200 underline underline-offset-4"
          >
            full enquiry form
          </Link>{" "}
          asks for the vessel, port and window.
        </p>
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="label-caps group inline-flex h-11 w-full items-center justify-center gap-2 bg-aqua-500 px-6 text-abyss-950 transition-colors duration-[140ms] hover:bg-aqua-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Sending…" : "Submit"}
      {!pending && (
        <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
      )}
    </button>
  );
}

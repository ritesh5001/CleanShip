"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";
import { ArrowIcon, CheckIcon } from "./icons";
import { siteConfig } from "@/lib/site";

const initialState: EnquiryState = { status: "idle", message: "" };

/* Fields sit on navy here rather than white, so the DS light-surface field
   spec is inverted: translucent white fill, white-alpha border, aqua focus
   ring. Control height stays at the 44px hard floor. */
const fieldBase =
  "w-full min-h-11 border border-white/25 bg-white/10 px-3.5 py-2.5 text-[15px] text-white placeholder:text-white/45 transition-colors duration-[140ms] focus:border-aqua-500 focus:bg-white/15 focus:outline-none";

const labelClass = "label-caps mb-1.5 block text-[11px] text-white/60";

/**
 * Compact quote form for the service hero.
 *
 * Shares `submitEnquiry` with the full contact form, so validation, the
 * honeypot and the Resend delivery path are identical — there is no second
 * code path to keep in sync. The service name is passed as a hidden field so
 * the enquiry arrives already attributed to the page it came from.
 *
 * Deliberately short: name, email, phone, message. Asking a superintendent
 * for six fields in a hero is how you get an empty inbox; the full form on
 * /contact is still there for anyone who wants to give more detail.
 */
export function HeroEnquiryForm({ serviceName }: { serviceName: string }) {
  const [state, formAction] = useActionState(submitEnquiry, initialState);

  if (state.status === "success") {
    return (
      <div className="rule-accent-top border border-white/20 bg-abyss-950/85 p-7">
        <span className="flex size-11 items-center justify-center bg-aqua-500 text-abyss-950">
          <CheckIcon className="size-5" />
        </span>
        <h2 className="mt-5 font-display text-[20px] font-bold uppercase leading-tight text-white">
          Enquiry received
        </h2>
        <p className="mt-3 text-[14px] leading-[1.6] text-white/75">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <div className="rule-accent-top border border-white/20 bg-abyss-950/85 p-6 sm:p-7">
      <h2 className="font-display text-[20px] font-bold uppercase leading-tight text-white">
        Get a quote
      </h2>
      <p className="mt-2 text-[13px] leading-[1.55] text-white/65">
        Tell us the vessel, the port and the window. Scoped reply, usually the
        same working day.
      </p>

      <form action={formAction} className="mt-5 space-y-3.5" noValidate>
        {/* Attributes the enquiry to this page without asking the user. */}
        <input type="hidden" name="service" value={serviceName} />

        {state.status === "error" && !state.errors && (
          <p
            role="alert"
            className="border border-danger-600/40 bg-danger-600/20 px-3 py-2 text-[13px] text-white"
          >
            {state.message}
          </p>
        )}

        <div>
          <label htmlFor="hero-name" className={labelClass}>
            Your name <span className="text-aqua-500">*</span>
          </label>
          <input
            id="hero-name"
            name="name"
            required
            autoComplete="name"
            aria-invalid={state.errors?.name ? true : undefined}
            aria-describedby={state.errors?.name ? "hero-name-err" : undefined}
            className={fieldBase}
          />
          {state.errors?.name && (
            <p id="hero-name-err" role="alert" className="mt-1.5 text-[12px] text-aqua-200">
              {state.errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="hero-email" className={labelClass}>
              Email <span className="text-aqua-500">*</span>
            </label>
            <input
              id="hero-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              aria-invalid={state.errors?.email ? true : undefined}
              aria-describedby={
                state.errors?.email ? "hero-email-err" : undefined
              }
              className={fieldBase}
            />
            {state.errors?.email && (
              <p
                id="hero-email-err"
                role="alert"
                className="mt-1.5 text-[12px] text-aqua-200"
              >
                {state.errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="hero-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="hero-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={fieldBase}
            />
          </div>
        </div>

        <div>
          <label htmlFor="hero-message" className={labelClass}>
            Vessel, port and window <span className="text-aqua-500">*</span>
          </label>
          <textarea
            id="hero-message"
            name="message"
            rows={3}
            required
            placeholder="e.g. Supramax, Fujairah anchorage, 12–15 of next month."
            aria-invalid={state.errors?.message ? true : undefined}
            aria-describedby={
              state.errors?.message ? "hero-message-err" : undefined
            }
            className={fieldBase}
          />
          {state.errors?.message && (
            <p
              id="hero-message-err"
              role="alert"
              className="mt-1.5 text-[12px] text-aqua-200"
            >
              {state.errors.message}
            </p>
          )}
        </div>

        {/* Honeypot — hidden from people, tempting to bots. */}
        <div aria-hidden="true" className="absolute left-[-9999px] size-px overflow-hidden">
          <label htmlFor="hero-website">Leave this field empty</label>
          <input
            id="hero-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <SubmitButton />

        <p className="text-[12px] leading-[1.5] text-white/50">
          Or call the 24/7 desk on{" "}
          <a
            href={siteConfig.phones[0].href}
            className="tabular text-aqua-200 underline underline-offset-2"
          >
            {siteConfig.phones[0].number}
          </a>
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
      {pending ? "Sending…" : "Send enquiry"}
      {!pending && (
        <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
      )}
    </button>
  );
}

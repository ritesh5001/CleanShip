"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";
import { serviceCategories } from "@/lib/services";
import { ArrowIcon, CheckIcon, ChevronIcon } from "./icons";

const initialState: EnquiryState = { status: "idle", message: "" };

/* Background is kept out of the shared base so the select can set its own
   without two competing bg-* utilities of equal specificity. */
const fieldBase =
  "w-full rounded-xl border border-white/12 px-4 py-3 text-sm text-white placeholder:text-abyss-500 transition focus:border-aqua-400/60 focus:outline-none focus:ring-2 focus:ring-aqua-400/25";

const fieldClass = `${fieldBase} bg-abyss-950/60`;

/* The select needs a fully opaque background: with appearance stripped, a
   translucent one lets the native control show through on some platforms. */
const selectClass = `${fieldBase} bg-abyss-950 appearance-none pr-11 [&>optgroup]:bg-abyss-950 [&>optgroup]:text-abyss-300 [&_option]:bg-abyss-950 [&_option]:text-white`;

export function ContactForm() {
  const [state, formAction] = useActionState(submitEnquiry, initialState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-aqua-400/30 bg-aqua-400/8 p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-aqua-400/20 text-aqua-300">
          <CheckIcon className="size-6" />
        </span>
        <h3 className="text-xl text-white">Enquiry received</h3>
        <p className="text-sm leading-relaxed text-abyss-200">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === "error" && !state.errors && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          name="name"
          required
          autoComplete="name"
          error={state.errors?.name}
        />
        <Field
          label="Email address"
          name="email"
          type="email"
          required
          autoComplete="email"
          error={state.errors?.email}
        />
        <Field
          label="Phone / WhatsApp"
          name="phone"
          type="tel"
          autoComplete="tel"
          optional
        />
        <Field
          label="Company"
          name="company"
          autoComplete="organization"
          optional
          error={state.errors?.company}
        />
        <Field
          label="Vessel name / IMO"
          name="vessel"
          optional
          error={state.errors?.vessel}
        />

        <div>
          <label
            htmlFor="service"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-abyss-300"
          >
            Service required{" "}
            <span className="normal-case tracking-normal text-abyss-500">
              (optional)
            </span>
          </label>
          {/* appearance-none strips the native control (which renders light
              on both macOS and Windows regardless of the background), so the
              chevron is supplied manually. Option elements are painted by the
              OS, so they get explicit colours too. */}
          <div className="relative">
            <select
              id="service"
              name="service"
              defaultValue=""
              className={selectClass}
            >
              <option value="">Select a service…</option>
              {serviceCategories.map((category) => (
                <optgroup key={category.slug} label={category.name}>
                  {category.services.map((service) => (
                    <option key={service.slug} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronIcon
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-abyss-400"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-xs font-medium uppercase tracking-wider text-abyss-300"
        >
          Scope, port and window <span className="text-aqua-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={state.errors?.message ? true : undefined}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          placeholder="e.g. Supramax bulker, 5 holds, previous cargo petcoke, grain clean required, Fujairah anchorage, 12–15 of next month."
          className={fieldClass}
        />
        {state.errors?.message && (
          <p id="message-error" role="alert" className="mt-2 text-xs text-red-300">
            {state.errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] size-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />

      <p className="text-xs leading-relaxed text-abyss-500">
        We use your details only to respond to this enquiry. No marketing lists,
        no third parties.
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-aqua-400 px-6 py-4 text-sm font-semibold text-abyss-950 shadow-lg shadow-aqua-500/25 transition hover:bg-aqua-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Sending…" : "Send enquiry"}
      {!pending && (
        <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
      )}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  optional,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-medium uppercase tracking-wider text-abyss-300"
      >
        {label} {required && <span className="text-aqua-400">*</span>}
        {optional && (
          <span className="normal-case tracking-normal text-abyss-500">
            {" "}
            (optional)
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={fieldClass}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

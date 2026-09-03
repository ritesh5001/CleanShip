"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitEnquiry, type EnquiryState } from "@/app/contact/actions";
import { serviceCategories } from "@/lib/services";
import { ArrowIcon, CheckIcon, ChevronIcon } from "./icons";

const initialState: EnquiryState = { status: "idle", message: "" };

/* DS field spec: 44px control height (hard floor), 2px radius, 1px cool
   border, white fill, 3px blue focus ring. Background is kept out of the
   shared base so the select can set its own without two competing bg-*
   utilities of equal specificity. */
const fieldBase =
  "w-full min-h-11 border border-line-200 px-4 py-2.5 text-[15px] text-ink-900 placeholder:text-slate-400 transition-colors duration-[140ms] focus:border-blue-400 focus:outline-none";

const fieldClass = `${fieldBase} bg-white`;

/* appearance-none strips the native control (which renders light on both
   macOS and Windows regardless of background), so the chevron is supplied
   manually. Options are painted by the OS, so they get explicit colours. */
const selectClass = `${fieldBase} bg-white appearance-none pr-11 [&_option]:bg-white [&_option]:text-ink-900`;

const labelClass = "label-caps mb-2 block text-[11px] text-slate-500";

export function ContactForm() {
  const [state, formAction] = useActionState(submitEnquiry, initialState);

  if (state.status === "success") {
    return (
      <div className="rule-accent-left flex flex-col items-start gap-4 border-y border-r border-success-600/30 bg-success-100 p-8">
        <span className="flex size-12 items-center justify-center bg-success-600 text-white">
          <CheckIcon className="size-6" />
        </span>
        <h3 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
          Enquiry received
        </h3>
        <p className="text-[15px] leading-[1.62] text-ink-700">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === "error" && !state.errors && (
        <p
          role="alert"
          className="border border-danger-600/30 bg-danger-100 px-4 py-3 text-[14px] text-danger-600"
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
          <label htmlFor="service" className={labelClass}>
            Service required{" "}
            <span className="font-normal normal-case tracking-normal text-slate-400">
              (optional)
            </span>
          </label>
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
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Scope, port and window <span className="text-blue-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={state.errors?.message ? true : undefined}
          aria-describedby={state.errors?.message ? "message-error" : undefined}
          placeholder="e.g. Supramax bulker, SPC antifouling applied 2023, last DD Mar 2023, hull clean + prop polish, Fujairah anchorage, 12–15 of next month."
          className={fieldClass}
        />
        {state.errors?.message && (
          <p
            id="message-error"
            role="alert"
            className="mt-2 text-[13px] text-danger-600"
          >
            {state.errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] size-px overflow-hidden"
      >
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <SubmitButton />

      <p className="text-[13px] leading-[1.62] text-slate-500">
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
      className="label-caps group inline-flex h-12 w-full items-center justify-center gap-2.5 bg-blue-600 px-6 text-white transition-colors duration-[140ms] hover:bg-navy-700 active:scale-[.985] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
    >
      {pending ? "Sending…" : "Send enquiry"}
      {!pending && (
        <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
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
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-blue-600">*</span>}
        {optional && (
          <span className="font-normal normal-case tracking-normal text-slate-400">
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
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-2 text-[13px] text-danger-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

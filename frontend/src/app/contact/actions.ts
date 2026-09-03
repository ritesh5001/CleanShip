"use server";

import { siteConfig } from "@/lib/site";
import { sendEnquiryEmails, type Enquiry } from "@/lib/email";
import { submitEnquiry as recordEnquiry } from "@/lib/api";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Field-level errors keyed by input name. */
  errors?: Record<string, string>;
};

const MAX = { name: 120, email: 160, company: 160, vessel: 120, message: 4000 };

function str(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Handles a quote enquiry.
 *
 * Validation runs on the server so it cannot be bypassed by disabling JS.
 * Delivery goes out through Resend as two emails — a notification to the
 * company inbox and an acknowledgement to the enquirer. See lib/email.ts for
 * why only one of those is allowed to fail the submission.
 */
export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Honeypot: a hidden field that only automated submitters will fill in.
  // We return the success shape so bots get no signal that they were caught.
  if (str(formData, "website")) {
    return { status: "success", message: "Thank you — your enquiry has been received." };
  }

  const name = str(formData, "name");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const company = str(formData, "company");
  const vessel = str(formData, "vessel");
  const service = str(formData, "service");
  const message = str(formData, "message");

  const errors: Record<string, string> = {};

  /* The homepage hero form renders Service as a required dropdown (elsewhere
     it is a hidden field carrying the page's own service). `required` on the
     element is a browser hint, not a guarantee — anything can POST this form,
     so it is checked here too. */
  if (!service) errors.service = "Please choose a service.";

  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > MAX.name) errors.name = "That name is too long.";

  // Deliberately permissive: the goal is to catch typos, not to reject the
  // long tail of valid addresses that stricter patterns get wrong.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  } else if (email.length > MAX.email) {
    errors.email = "That email address is too long.";
  }

  if (message.length < 10) {
    errors.message = "Please give us a little more detail (10 characters or more).";
  } else if (message.length > MAX.message) {
    errors.message = "Please keep your message under 4,000 characters.";
  }

  if (company.length > MAX.company) errors.company = "That company name is too long.";
  if (vessel.length > MAX.vessel) errors.vessel = "That vessel name is too long.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      errors,
    };
  }

  try {
    await deliverEnquiry({ name, email, phone, company, vessel, service, message });
  } catch (error) {
    console.error("[enquiry] delivery failed", error);
    return {
      status: "error",
      message: `Something went wrong sending your enquiry. Please email us directly at ${siteConfig.email}.`,
    };
  }

  return {
    status: "success",
    message:
      "Thank you — your enquiry has reached our operations desk and a confirmation is on its way to your inbox. We respond within one working day, and sooner for vessels already in port.",
  };
}

/**
 * Emails first, then the inbox.
 *
 * The email is what actually reaches a person, so it decides whether the
 * submission succeeded — a database that is down must not turn a real enquiry
 * into an error page for a customer who did nothing wrong. Recording it in
 * CleanTrack is best-effort on top, and a failure there is logged rather than
 * shown.
 */
async function deliverEnquiry(enquiry: Enquiry): Promise<void> {
  await sendEnquiryEmails(enquiry);

  try {
    await recordEnquiry({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone || null,
      company: enquiry.company || null,
      vessel: enquiry.vessel || null,
      service: enquiry.service || null,
      message: enquiry.message,
    });
  } catch (error) {
    console.error("[enquiry] not recorded in the inbox", error);
  }
}

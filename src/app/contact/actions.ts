"use server";

import { siteConfig } from "@/lib/site";

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
 *
 * ⚠️ DELIVERY IS NOT WIRED UP YET. The enquiry is currently validated and
 * logged only — see `deliverEnquiry` below. Connect an email provider (Resend,
 * SendGrid, SES or SMTP) or a CRM webhook before going live, or enquiries will
 * be accepted by the form and never reach anyone.
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
      "Thank you — your enquiry has reached our operations desk. We respond within one working day, and sooner for vessels already in port.",
  };
}

type Enquiry = {
  name: string;
  email: string;
  phone: string;
  company: string;
  vessel: string;
  service: string;
  message: string;
};

/**
 * Delivery hook — replace the body with a real integration.
 *
 * Example using Resend:
 *
 *   import { Resend } from "resend";
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.emails.send({
 *     from: "website@cleanship.co",
 *     to: siteConfig.email,
 *     replyTo: enquiry.email,
 *     subject: `Enquiry — ${enquiry.service || "General"} — ${enquiry.name}`,
 *     text: JSON.stringify(enquiry, null, 2),
 *   });
 */
async function deliverEnquiry(enquiry: Enquiry): Promise<void> {
  console.info("[enquiry] received (delivery not configured)", {
    ...enquiry,
    to: siteConfig.email,
  });
}

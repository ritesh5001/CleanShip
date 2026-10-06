"use server";

import { company } from "@/content/company";
import { site } from "@/content/site";
import { sendEnquiryEmails, type Enquiry } from "@/lib/email";
import { CAPTCHA_ERROR, verifyTurnstile } from "@/lib/turnstile";

export type EnquiryState = { status: "idle" | "success" | "error"; message: string; errors?: Record<string, string> };

const str = (d: FormData, k: string) => {
  const v = d.get(k);
  return typeof v === "string" ? v.trim() : "";
};

/**
 * Records the enquiry in the CleanTrack inbox (the same one cleanship.co
 * feeds), then emails the office. The API also screens for spam; spam is not
 * emailed. If the API is down the email still goes, so no lead is lost.
 */
async function record(e: Enquiry): Promise<{ spam: boolean }> {
  const api = process.env.BACKEND_URL;
  const key = process.env.ENQUIRY_FORM_KEY;
  if (!api || !key) {
    console.warn("[enquiry] BACKEND_URL or ENQUIRY_FORM_KEY not set — not recorded in the inbox");
    return { spam: false };
  }
  const res = await fetch(`${api.replace(/\/$/, "")}/api/v1/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Form-Key": key },
    body: JSON.stringify({
      name: e.name,
      email: e.email,
      phone: e.phone || null,
      company: e.company || null,
      vessel: e.vessel || null,
      /* The inbox has no "source" column, so the site rides on the service. */
      service: `${e.service || "General enquiry"} (via ${site.domain})`.slice(0, 200),
      message: e.message,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as { spam: boolean };
}

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  if (str(formData, "website")) return { status: "success", message: "Thank you — your enquiry has been received." };
  if (!(await verifyTurnstile(formData))) return { status: "error", message: CAPTCHA_ERROR };

  const e: Enquiry = {
    name: str(formData, "name"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    company: str(formData, "company"),
    vessel: str(formData, "vessel"),
    service: str(formData, "service"),
    message: str(formData, "message"),
  };

  const errors: Record<string, string> = {};
  if (e.name.length < 2 || e.name.length > 120) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.email) || e.email.length > 160) errors.email = "Please enter a valid email address.";
  if (e.message.length < 10) errors.message = "Please give us a little more detail (10 characters or more).";
  if (e.message.length > 4000) errors.message = "Please keep your message under 4,000 characters.";
  if (e.phone.length > 40) errors.phone = "That phone number is too long.";
  if (e.company.length > 160) errors.company = "That company name is too long.";
  if (e.vessel.length > 120) errors.vessel = "That vessel name is too long.";
  if (Object.keys(errors).length) return { status: "error", message: "Please correct the highlighted fields.", errors };

  let spam = false;
  try {
    ({ spam } = await record(e));
  } catch (err) {
    console.error("[enquiry] not recorded in the inbox", err);
  }

  if (!spam) {
    try {
      await sendEnquiryEmails(e);
    } catch (err) {
      console.error("[enquiry] email failed", err);
      return { status: "error", message: `Something went wrong sending your enquiry. Please email us at ${company.email}.` };
    }
  }

  return {
    status: "success",
    message: "Thank you — your enquiry has reached our operations desk. We reply within one working day, and sooner for ships already in port.",
  };
}

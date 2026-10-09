"use server";

import { company } from "@/content/company";
import { sendEnquiryEmails, type Enquiry } from "@/lib/email";
import { spamReason } from "@/lib/spam";
import { CAPTCHA_ERROR, verifyTurnstile } from "@/lib/turnstile";

export type EnquiryState = { status: "idle" | "success" | "error"; message: string; errors?: Record<string, string> };

const str = (d: FormData, k: string) => {
  const v = d.get(k);
  return typeof v === "string" ? v.trim() : "";
};

/**
 * The quote form. This site has no backend and no database: an enquiry is
 * checked (honeypot, Turnstile, field validation, spam rules) and then emailed
 * to the office through Resend. The email is the record.
 */
export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  if (str(formData, "website")) return { status: "success", message: "Ευχαριστούμε, λάβαμε το αίτημά σας." };
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
  if (e.name.length < 2 || e.name.length > 120) errors.name = "Συμπληρώστε το όνομά σας.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.email) || e.email.length > 160) errors.email = "Συμπληρώστε ένα έγκυρο email.";
  if (e.message.length < 10) errors.message = "Δώστε μας λίγες περισσότερες λεπτομέρειες (τουλάχιστον 10 χαρακτήρες).";
  if (e.message.length > 4000) errors.message = "Το μήνυμα πρέπει να είναι έως 4.000 χαρακτήρες.";
  if (e.phone.length > 40) errors.phone = "Ο αριθμός τηλεφώνου είναι πολύ μεγάλος.";
  if (e.company.length > 160) errors.company = "Το όνομα της εταιρείας είναι πολύ μεγάλο.";
  if (e.vessel.length > 120) errors.vessel = "Το όνομα του πλοίου είναι πολύ μεγάλο.";
  if (Object.keys(errors).length) return { status: "error", message: "Διορθώστε τα πεδία που επισημαίνονται.", errors };

  /* Spam is dropped quietly: no email, and the same thank-you a real sender sees. */
  const spam = spamReason(e);
  if (spam) {
    console.log(`[enquiry] spam discarded: ${spam} (${e.email})`);
  } else {
    try {
      await sendEnquiryEmails(e);
    } catch (err) {
      console.error("[enquiry] email failed", err);
      return { status: "error", message: `Κάτι πήγε στραβά κατά την αποστολή. Στείλτε μας email στο ${company.email}.` };
    }
  }

  return {
    status: "success",
    message: "Ευχαριστούμε. Το αίτημά σας έφτασε στο τμήμα επιχειρήσεών μας. Απαντάμε μέσα σε μία εργάσιμη ημέρα, και νωρίτερα για πλοία που βρίσκονται ήδη στο λιμάνι.",
  };
}

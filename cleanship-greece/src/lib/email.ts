import "server-only";
import { Resend } from "resend";
import { company } from "@/content/company";
import { site } from "@/content/site";

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  company: string;
  vessel: string;
  service: string;
  message: string;
};

const FROM = process.env.RESEND_FROM_EMAIL ?? "Cleanship Sales <sales@cleanship.ae>";
const TO = process.env.ENQUIRY_TO_EMAIL ?? company.email;

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
const header = (v: string) => v.replace(/[\r\n]+/g, " ").trim();

function table(pairs: [string, string][]) {
  return `<table cellpadding="0" cellspacing="0" width="100%">${pairs
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #dce4eb;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#546472;width:140px;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #dce4eb;font-size:15px;color:#243545">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table>`;
}

function shell(title: string, body: string, lang = "en") {
  return `<!doctype html><html lang="${lang}"><body style="margin:0;background:#f6f8fa;font-family:Arial,sans-serif;color:#243545">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border:1px solid #dce4eb">
<tr><td style="background:#06203a;padding:20px 26px;color:#fff;font-size:20px;font-weight:700;letter-spacing:.04em">CLEANSHIP <span style="color:#00b0b9;font-size:12px">${esc(site.domain)}</span></td></tr>
<tr><td style="padding:26px"><h1 style="margin:0 0 16px;font-size:20px;color:#06203a">${esc(title)}</h1>${body}</td></tr>
<tr><td style="background:#f6f8fa;padding:18px 26px;font-size:12px;color:#546472">${esc(company.legalName)}<br>${esc(company.registeredAddress.full)}<br>${company.phones.map((p) => esc(p.number)).join(" · ")} · ${esc(company.email)}</td></tr>
</table></td></tr></table></body></html>`;
}

/**
 * Company notification must succeed; the acknowledgement is best effort.
 *
 * The notification stays in English for the operations desk; the
 * acknowledgement goes to the customer, in Greek like the rest of the site.
 */
export async function sendEnquiryEmails(e: Enquiry) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  const resend = new Resend(key);

  const details: [string, string][] = [
    ["Site", site.domain],
    ["Name", e.name],
    ["Email", e.email],
    ["Phone", e.phone],
    ["Company", e.company],
    ["Vessel / IMO", e.vessel],
    ["Service", e.service],
    ["Message", e.message],
  ];

  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: e.email,
    subject: `New enquiry (${site.domain}) — ${header(e.service) || "General"} — ${header(e.name)}`,
    html: shell("New enquiry", table(details)),
    text: details.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n"),
  });
  if (error) throw new Error(error.message ?? "Resend rejected the notification");

  try {
    await resend.emails.send({
      from: FROM,
      to: e.email,
      replyTo: company.email,
      subject: "Λάβαμε το αίτημά σας — Cleanship Marine Services",
      html: shell(
        "Λάβαμε το αίτημά σας",
        `<p style="font-size:15px;line-height:1.6">Ευχαριστούμε, ${esc(e.name)}. Το αίτημά σας έφτασε στο τμήμα επιχειρήσεών μας και θα σας απαντήσουμε μέσα σε μία εργάσιμη ημέρα, και νωρίτερα για πλοία που βρίσκονται ήδη στο λιμάνι.</p>${table([
          ["Υπηρεσία", e.service],
          ["Πλοίο / IMO", e.vessel],
          ["Το μήνυμά σας", e.message],
        ])}`,
        "el",
      ),
      text: `Ευχαριστούμε, ${e.name}. Το αίτημά σας έφτασε στο τμήμα επιχειρήσεών μας και θα σας απαντήσουμε μέσα σε μία εργάσιμη ημέρα.\n\n${e.message}`,
    });
  } catch (err) {
    console.error("[enquiry] acknowledgement failed (lead is safe)", err);
  }
}

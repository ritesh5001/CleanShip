import { Resend } from "resend";
import { siteConfig } from "./site";

/**
 * Transactional email for contact enquiries, via Resend.
 *
 * Two messages go out per submission:
 *   1. Notification  → the company inbox, reply-to set to the enquirer
 *   2. Acknowledgement → the enquirer, confirming what they sent
 *
 * These are NOT equally important, and the code treats them differently.
 * If (1) fails the enquiry has effectively vanished and the user must be told.
 * If only (2) fails the enquiry still arrived, so telling the user it failed
 * would be a lie that costs you the lead. See `sendEnquiryEmails`.
 */

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  company: string;
  vessel: string;
  service: string;
  message: string;
};

/**
 * The verified sending domain. Resend will reject anything from a domain you
 * have not verified in the dashboard — this is not optional.
 */
const FROM =
  process.env.RESEND_FROM_EMAIL ?? `Cleanship Website <website@cleanship.co>`;

/** Where enquiries land. Defaults to the published address. */
/**
 * Where enquiries land.
 *
 * Defaults to the single public address in lib/site.ts, so the address the
 * site displays is the address that receives — which is what you want unless
 * there is a specific reason to split them.
 *
 * ⚠️ ENQUIRY_TO_EMAIL overrides it. If enquiries are not arriving where you
 * expect after changing siteConfig.email, check that env var in Vercel first;
 * a stale value there is the usual cause and nothing in the code will warn
 * you about it.
 */
const TO_COMPANY = process.env.ENQUIRY_TO_EMAIL ?? siteConfig.email;

/** Escapes user input before it is interpolated into HTML email bodies. */
function esc(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string,
  );
}

/**
 * Strips CR/LF from anything placed in a subject line. Newlines in a header
 * are the classic email header-injection vector.
 */
function safeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

const BRAND = {
  navy: "#06203a",
  blue: "#1461a0",
  aqua: "#00b0b9",
  ink: "#243545",
  slate: "#6b7c8b",
  line: "#dce4eb",
  paper: "#f6f8fa",
};

const FONT =
  "'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/** Shared shell so both emails look like they came from the same company. */
function shell(heading: string, intro: string, body: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.paper};font-family:${FONT};color:${BRAND.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid ${BRAND.line};">
        <tr><td style="height:3px;background:${BRAND.aqua};font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="background:${BRAND.navy};padding:22px 28px;">
          <span style="font-size:21px;font-weight:700;letter-spacing:.04em;color:#ffffff;text-transform:uppercase;">CLEAN<span style="color:#4a9bd8;">SHIP</span></span>
          <div style="margin-top:2px;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:${BRAND.aqua};">Marine Services</div>
        </td></tr>
        <tr><td style="padding:30px 28px 8px;">
          <h1 style="margin:0;font-size:22px;line-height:1.2;font-weight:700;text-transform:uppercase;color:${BRAND.navy};">${esc(heading)}</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${BRAND.slate};">${intro}</p>
        </td></tr>
        <tr><td style="padding:20px 28px 30px;">${body}</td></tr>
        <tr><td style="background:${BRAND.paper};border-top:1px solid ${BRAND.line};padding:20px 28px;font-size:12px;line-height:1.6;color:${BRAND.slate};">
          <strong style="color:${BRAND.navy};">${esc(siteConfig.legalName)}</strong><br>
          ${esc(siteConfig.address.full)}<br>
          ${siteConfig.phones.map((p) => esc(p.number)).join(" &nbsp;·&nbsp; ")}<br>
          <a href="mailto:${esc(siteConfig.email)}" style="color:${BRAND.blue};">${esc(siteConfig.email)}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** Renders a label/value row, skipping anything the user left blank. */
function rows(pairs: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${pairs
    .filter(([, v]) => v)
    .map(
      ([label, value]) => `<tr>
        <td style="padding:9px 0;border-bottom:1px solid ${BRAND.line};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.slate};width:150px;vertical-align:top;">${esc(label)}</td>
        <td style="padding:9px 0;border-bottom:1px solid ${BRAND.line};font-size:15px;line-height:1.6;color:${BRAND.ink};">${esc(value).replace(/\n/g, "<br>")}</td>
      </tr>`,
    )
    .join("")}</table>`;
}

function companyEmail(e: Enquiry) {
  const detail: [string, string][] = [
    ["Name", e.name],
    ["Email", e.email],
    ["Phone", e.phone],
    ["Company", e.company],
    ["Vessel / IMO", e.vessel],
    ["Service", e.service],
  ];

  const html = shell(
    "New enquiry",
    `A quote request was submitted on the website. Reply directly to this email to reach <strong>${esc(e.name)}</strong>.`,
    `${rows(detail)}
     <div style="margin-top:22px;padding:18px;background:${BRAND.paper};border-left:3px solid ${BRAND.aqua};">
       <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.slate};">Scope, port and window</div>
       <div style="margin-top:8px;font-size:15px;line-height:1.65;color:${BRAND.ink};">${esc(e.message).replace(/\n/g, "<br>")}</div>
     </div>`,
  );

  const text = [
    "NEW ENQUIRY — cleanship.co",
    "",
    ...detail.filter(([, v]) => v).map(([l, v]) => `${l}: ${v}`),
    "",
    "Scope, port and window:",
    e.message,
  ].join("\n");

  return { html, text };
}

function acknowledgementEmail(e: Enquiry) {
  const detail: [string, string][] = [
    ["Service", e.service],
    ["Vessel / IMO", e.vessel],
    ["Company", e.company],
  ];

  const html = shell(
    "We have your enquiry",
    `Thank you, ${esc(e.name)}. Your enquiry has reached our operations desk. We respond within one working day, and sooner for vessels already in port.`,
    `${detail.some(([, v]) => v) ? rows(detail) : ""}
     <div style="margin-top:${detail.some(([, v]) => v) ? "22px" : "0"};padding:18px;background:${BRAND.paper};border-left:3px solid ${BRAND.aqua};">
       <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.slate};">What you sent us</div>
       <div style="margin-top:8px;font-size:15px;line-height:1.65;color:${BRAND.ink};">${esc(e.message).replace(/\n/g, "<br>")}</div>
     </div>
     <p style="margin:22px 0 0;font-size:14px;line-height:1.65;color:${BRAND.slate};">
       If the vessel is already alongside or at anchorage and the window is tight,
       call the operations desk directly — it is manned 24/7.
     </p>
     <p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:${BRAND.slate};">
       This is an automated confirmation. You can reply to it and it will reach us.
     </p>`,
  );

  const text = [
    `Thank you, ${e.name}.`,
    "",
    "Your enquiry has reached our operations desk. We respond within one working day,",
    "and sooner for vessels already in port.",
    "",
    ...detail.filter(([, v]) => v).map(([l, v]) => `${l}: ${v}`),
    "",
    "What you sent us:",
    e.message,
    "",
    `${siteConfig.legalName}`,
    siteConfig.address.full,
    siteConfig.phones.map((p) => p.number).join("  ·  "),
    siteConfig.email,
  ].join("\n");

  return { html, text };
}

/**
 * Sends both emails.
 *
 * Throws only when the company notification fails, because that is the case
 * where the enquiry is genuinely lost. A failed acknowledgement is logged and
 * swallowed — the lead is safe, and telling the user otherwise would send them
 * away for no reason.
 */
export async function sendEnquiryEmails(enquiry: Enquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Local development without credentials: make the omission loud rather
    // than silently pretending the mail was sent.
    console.warn(
      "[enquiry] RESEND_API_KEY is not set — no email sent. Enquiry was:",
      { ...enquiry, intendedRecipient: TO_COMPANY },
    );
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);
  const subjectName = safeHeader(enquiry.name) || "Website enquiry";
  const subjectService = safeHeader(enquiry.service) || "General enquiry";

  const notification = companyEmail(enquiry);
  const ack = acknowledgementEmail(enquiry);

  // Company notification — critical path.
  const { error: companyError } = await resend.emails.send({
    from: FROM,
    to: TO_COMPANY,
    replyTo: enquiry.email,
    subject: `New enquiry — ${subjectService} — ${subjectName}`,
    html: notification.html,
    text: notification.text,
  });

  if (companyError) {
    console.error("[enquiry] company notification failed", companyError);
    throw new Error(companyError.message ?? "Resend rejected the notification");
  }

  // Acknowledgement — best effort. Never fails the submission.
  try {
    const { error: ackError } = await resend.emails.send({
      from: FROM,
      to: enquiry.email,
      replyTo: siteConfig.email,
      subject: "We have your enquiry — Cleanship Marine Services",
      html: ack.html,
      text: ack.text,
    });
    if (ackError) {
      console.error("[enquiry] acknowledgement failed (lead is safe)", ackError);
    }
  } catch (error) {
    console.error("[enquiry] acknowledgement threw (lead is safe)", error);
  }
}

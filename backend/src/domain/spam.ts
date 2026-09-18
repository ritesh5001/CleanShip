/**
 * Spots the junk the contact forms attract, so it lands in the inbox's spam
 * tab instead of among real enquiries.
 *
 * Flagged enquiries are still STORED (status "spam"), never dropped: a false
 * positive costs one click to move back, a silently lost customer costs a
 * job. The rules are deliberately narrow — each matches something no ship
 * operator asking for a quote would write.
 */

type Fields = {
  name: string;
  company?: string | null;
  message: string;
};

const RULES: [reason: string, pattern: RegExp][] = [
  /* The "У вас новый перевод…" payment-scam wave. Customers write in English. */
  ["cyrillic text", /[Ѐ-ӿ]/],

  /* Link shorteners and redirectors hide where a link goes; real enquiries
     have no reason to use them. */
  [
    "shortened link",
    /\b(share\.google|cutt\.ly|bit\.ly|tinyurl\.com|t\.co|goo\.gl|bynd\.li|brnd\s?\.li|rb\.gy|is\.gd|t\.me)\//i,
  ],

  /* Marketing pitches: SEO, backlinks, traffic, lead-gen trials, videos. */
  [
    "sales pitch",
    /\b(seo|backlinks?|google rankings?|(1st|first) page (of|on) google|organic (traffic|growth|visits)|website traffic|free (\d+[- ]days? )?trial|\d+[- ]days? (are )?free|free for \d+ days|explainer video|engaging video|wayback machine|web archives?|guest posts?|link building|lead generation)\b/i,
  ],

  /* Our own address pasted into the name — the "Hello http://cleanship.co/…
     Admin" bots. A person's name never contains a URL. */
  ["link in name", /https?:\/\/|www\./i],
];

/** The reason an enquiry looks like spam, or null if it looks genuine. */
export function spamReason(fields: Fields): string | null {
  for (const [reason, pattern] of RULES) {
    const text =
      reason === "link in name"
        ? fields.name
        : `${fields.name}\n${fields.company ?? ""}\n${fields.message}`;
    if (pattern.test(text)) return reason;
  }
  return null;
}

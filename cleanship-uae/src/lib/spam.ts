/**
 * Spots the junk contact forms attract. A flagged enquiry is dropped: not
 * emailed, and the sender still sees the normal thank-you, so a bot learns
 * nothing about what tripped it.
 *
 * Same rules as the main site (backend/src/domain/spam.ts) — keep them in step.
 * Because a false positive is a lost customer with no trace, the rules are
 * deliberately narrow: each matches something no ship operator asking for a
 * quote would write.
 */

type Fields = { name: string; company?: string | null; message: string };

const RULES: [reason: string, pattern: RegExp][] = [
  /* The "У вас новый перевод…" payment-scam wave. Customers write in English. */
  ["cyrillic text", /[\u0400-\u04FF]/],

  /* Link shorteners hide where a link goes; real enquiries have no reason to use them. */
  [
    "shortened link",
    /\b(share\.google|cutt\.ly|bit\.ly|tinyurl\.com|t\.co|goo\.gl|bynd\.li|brnd\s?\.li|rb\.gy|is\.gd|t\.me)\//i,
  ],

  /* Marketing pitches: SEO, backlinks, traffic, lead-gen trials, videos. */
  [
    "sales pitch",
    /\b(seo|backlinks?|google rankings?|(1st|first) page (of|on) google|organic (traffic|growth|visits)|website traffic|free (\d+[- ]days? )?trial|\d+[- ]days? (are )?free|free for \d+ days|explainer video|engaging video|wayback machine|web archives?|guest posts?|link building|lead generation)\b/i,
  ],

  /* A URL pasted into the name field. A person's name never contains one. */
  ["link in name", /https?:\/\/|www\./i],
];

/** Why an enquiry looks like spam, or null if it looks genuine. */
export function spamReason(fields: Fields): string | null {
  for (const [reason, pattern] of RULES) {
    const text = reason === "link in name" ? fields.name : `${fields.name}\n${fields.company ?? ""}\n${fields.message}`;
    if (pattern.test(text)) return reason;
  }
  return null;
}

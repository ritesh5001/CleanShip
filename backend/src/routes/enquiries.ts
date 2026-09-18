import { Router } from "express";
import { z } from "zod";
import crypto from "node:crypto";
import {
  ENQUIRY_STATUSES,
  createEnquiry,
  enquiryCounts,
  isEnquiryStatus,
  listEnquiries,
  setEnquiryStatus,
} from "../domain/enquiries.js";
import { spamReason } from "../domain/spam.js";
import { env } from "../env.js";
import { requireRole } from "../http/session.js";
import { parseBody, parseId } from "../http/validate.js";
import { ApiError } from "../http/errors.js";

export const enquiryRoutes = Router();

/* -------------------------------------------------------------------- */
/* Public: the website's contact forms                                  */
/* -------------------------------------------------------------------- */

/**
 * A small in-memory throttle.
 *
 * Not a real rate limiter — one process, cleared on every deploy — but the
 * traffic it exists to stop is a bot hammering one endpoint from one address,
 * and for that a Map is enough. Anything more determined is a job for the
 * platform's edge, not for this file.
 */
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 8;

function throttle(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  if (hits.length > MAX_PER_WINDOW) {
    throw new ApiError(429, "too_many", "Too many enquiries from here. Try again shortly.");
  }
}

const enquirySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).nullish(),
  company: z.string().max(160).nullish(),
  vessel: z.string().max(120).nullish(),
  service: z.string().max(200).nullish(),
  message: z.string().min(1).max(5000),
});

/**
 * Proof that a submission came through the website's server action, which is
 * where the Turnstile CAPTCHA is checked. Without it a bot could POST here
 * directly and skip the CAPTCHA entirely.
 *
 * Derived from SESSION_SECRET, which the website already shares, so there is
 * no extra secret to configure. The website computes the same value in
 * frontend/src/lib/api.ts.
 */
const FORM_KEY = () =>
  crypto
    .createHmac("sha256", env.SESSION_SECRET)
    .update("cleanship-enquiry-form")
    .digest();

function fromWebsite(header: string | undefined) {
  if (!header) return false;
  const given = Buffer.from(header, "hex");
  const expected = FORM_KEY();
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

enquiryRoutes.post("/", async (req, res) => {
  if (!fromWebsite(req.header("x-form-key"))) {
    throw new ApiError(403, "forbidden", "Submit enquiries through the website.");
  }

  const ip =
    (req.header("x-forwarded-for") ?? "").split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";
  throttle(ip);

  const body = parseBody(enquirySchema, req.body);
  const reason = spamReason(body);
  if (reason) console.log(`[enquiry] flagged as spam: ${reason}`);

  const enquiry = await createEnquiry({
    ...body,
    status: reason ? "spam" : "new",
    phone: body.phone ?? null,
    company: body.company ?? null,
    vessel: body.vessel ?? null,
    service: body.service ?? null,
    /* Hashed with the session secret, so the inbox can group repeat senders
       without the database holding anyone's address. */
    ipHash: crypto
      .createHmac("sha256", env.SESSION_SECRET)
      .update(ip)
      .digest("hex")
      .slice(0, 64),
    userAgent: (req.header("user-agent") ?? "").slice(0, 255) || null,
  });

  res.status(201).json({ id: enquiry.id, spam: reason !== null });
});

/* -------------------------------------------------------------------- */
/* The inbox                                                            */
/* -------------------------------------------------------------------- */

enquiryRoutes.get("/", requireRole("admin", "superadmin"), async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const [enquiries, counts] = await Promise.all([
    listEnquiries(isEnquiryStatus(status) ? status : undefined),
    enquiryCounts(),
  ]);
  res.json({ enquiries, counts, statuses: ENQUIRY_STATUSES });
});

enquiryRoutes.patch("/:id", requireRole("admin", "superadmin"), async (req, res) => {
  const id = parseId(req.params.id, "enquiry id");
  const body = parseBody(
    z.object({ status: z.enum(ENQUIRY_STATUSES) }),
    req.body,
  );
  res.json({ enquiry: await setEnquiryStatus(id, body.status) });
});

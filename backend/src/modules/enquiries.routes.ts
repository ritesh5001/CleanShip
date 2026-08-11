import { Router } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { db } from "../db/index.js";
import { enquiries } from "../db/schema.js";
import { hashIp, requireAuth } from "../lib/auth.js";
import { ApiError, asyncHandler, parseBody } from "../lib/http.js";

export const enquiriesRouter = Router();

/** Public endpoint — throttled per IP to blunt form spam. */
const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "rate_limited",
    message: "Too many submissions. Please try again shortly.",
  },
});

const STATUSES = ["new", "in_progress", "quoted", "won", "lost", "spam"] as const;

const createSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(120),
  // Permissive on purpose: the goal is catching typos, not rejecting the long
  // tail of valid addresses that stricter patterns get wrong.
  email: z.email("Please enter a valid email address.").max(160),
  phone: z.string().max(60).optional().or(z.literal("")),
  company: z.string().max(160).optional().or(z.literal("")),
  vessel: z.string().max(120).optional().or(z.literal("")),
  service: z.string().max(160).optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Please give us a little more detail.")
    .max(4000),
  sourcePath: z.string().max(255).optional(),
  /**
   * Honeypot. Deliberately permissive here rather than `.max(0)`: rejecting
   * it at the schema returns a 400 naming the "website" field, which tells an
   * automated submitter exactly which input trapped it. It is inspected in the
   * handler instead, where a filled value is accepted and discarded.
   */
  website: z.string().max(255).optional(),
});

/** POST /api/enquiries — called by the site's contact and hero forms. */
enquiriesRouter.post(
  "/",
  submitLimiter,
  asyncHandler(async (req, res) => {
    const input = parseBody(createSchema, req.body);

    // Honeypot filled: accept and discard. Returning success gives an
    // automated submitter no signal that it was caught.
    if (input.website) {
      res.status(201).json({ ok: true });
      return;
    }

    const [created] = await db
      .insert(enquiries)
      .values({
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone || null,
        company: input.company || null,
        vessel: input.vessel || null,
        service: input.service || null,
        message: input.message,
        sourcePath: input.sourcePath ?? null,
        userAgent: req.get("user-agent")?.slice(0, 255) ?? null,
        ipHash: hashIp(req.ip),
      })
      .returning({ id: enquiries.id, createdAt: enquiries.createdAt });

    // The id is deliberately not returned to the public caller — it would let
    // anyone enumerate how many enquiries the business receives.
    res.status(201).json({ ok: true, receivedAt: created?.createdAt });
  }),
);

const listQuery = z.object({
  status: z.enum(STATUSES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(25),
});

/** GET /api/enquiries — admin inbox, newest first. */
enquiriesRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status, page, perPage } = parseBody(listQuery, req.query);
    const where = status ? eq(enquiries.status, status) : undefined;

    const [rows, [counts]] = await Promise.all([
      db
        .select()
        .from(enquiries)
        .where(where)
        .orderBy(desc(enquiries.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage),
      db
        .select({
          total: sql<number>`count(*)::int`,
          unread: sql<number>`count(*) filter (where ${enquiries.status} = 'new')::int`,
        })
        .from(enquiries)
        .where(where),
    ]);

    res.json({
      enquiries: rows,
      page,
      perPage,
      total: counts?.total ?? 0,
      unread: counts?.unread ?? 0,
    });
  }),
);

/** GET /api/enquiries/:id */
enquiriesRouter.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw ApiError.badRequest("Invalid id");

    const [row] = await db
      .select()
      .from(enquiries)
      .where(eq(enquiries.id, id))
      .limit(1);

    if (!row) throw ApiError.notFound("No such enquiry");
    res.json({ enquiry: row });
  }),
);

const updateSchema = z
  .object({
    status: z.enum(STATUSES).optional(),
    notes: z.string().max(5000).nullable().optional(),
  })
  .refine((v) => v.status !== undefined || v.notes !== undefined, {
    message: "Provide status or notes",
  });

/** PATCH /api/enquiries/:id — triage from the admin inbox. */
enquiriesRouter.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw ApiError.badRequest("Invalid id");

    const input = parseBody(updateSchema, req.body);

    const [updated] = await db
      .update(enquiries)
      .set({
        ...(input.status ? { status: input.status } : {}),
        ...(input.notes !== undefined ? { notes: input.notes } : {}),
        updatedAt: new Date(),
      })
      .where(eq(enquiries.id, id))
      .returning();

    if (!updated) throw ApiError.notFound("No such enquiry");
    res.json({ enquiry: updated });
  }),
);

/** GET /api/enquiries/stats/summary — dashboard counters. */
enquiriesRouter.get(
  "/stats/summary",
  requireAuth,
  asyncHandler(async (_req, res) => {
    const rows = await db
      .select({
        status: enquiries.status,
        count: sql<number>`count(*)::int`,
      })
      .from(enquiries)
      .groupBy(enquiries.status);

    const byStatus = Object.fromEntries(
      STATUSES.map((s) => [s, rows.find((r) => r.status === s)?.count ?? 0]),
    );

    const [recent] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(enquiries)
      .where(
        and(sql`${enquiries.createdAt} > now() - interval '7 days'`),
      );

    res.json({
      byStatus,
      total: rows.reduce((n, r) => n + r.count, 0),
      last7Days: recent?.count ?? 0,
    });
  }),
);

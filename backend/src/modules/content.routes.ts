import { Router } from "express";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { projects, serviceCategories, services } from "../db/schema.js";
import { requireAuth, requireRole } from "../lib/auth.js";
import { ApiError, asyncHandler, parseBody } from "../lib/http.js";

/**
 * Service and project content.
 *
 * GET routes are public and unauthenticated — the site builds its pages from
 * them. Writes require a session. Unpublished rows are visible only to
 * authenticated callers, so a draft cannot be discovered by guessing a slug.
 */
export const contentRouter = Router();

const faqSchema = z.array(z.object({ q: z.string().min(1), a: z.string().min(1) }));
const stepSchema = z.array(
  z.object({ title: z.string().min(1), body: z.string().min(1) }),
);

const categoryInput = z.object({
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
  name: z.string().min(2).max(160),
  seoTitle: z.string().min(2).max(200),
  metaDescription: z.string().min(2),
  tagline: z.string().min(2).max(200),
  summary: z.string().min(2),
  intro: z.array(z.string()).default([]),
  icon: z.string().min(1).max(40),
  keywords: z.array(z.string()).default([]),
  faqs: faqSchema.default([]),
  position: z.number().int().default(0),
  published: z.boolean().default(true),
});

const serviceInput = categoryInput
  .omit({ icon: true, intro: true })
  .extend({
    categorySlug: z.string().min(2).max(120),
    intro: z.array(z.string()).default([]),
    highlights: z.array(z.string()).default([]),
    scope: stepSchema.default([]),
    process: stepSchema.default([]),
    appliesTo: z.array(z.string()).default([]),
    coverageAreas: z.array(z.string()).default([]),
    coverageWorldwide: z.boolean().default(false),
    mediaSlug: z.string().max(120).nullable().default(null),
  });

/* ------------------------------------------------------------------ */
/* Read — public                                                       */
/* ------------------------------------------------------------------ */

/**
 * GET /api/content/services
 * The full taxonomy in one call, nested category -> services, ordered by
 * position. The site renders every service page from this single response, so
 * splitting it would only add round trips at build time.
 */
contentRouter.get(
  "/services",
  asyncHandler(async (req, res) => {
    const includeDrafts = Boolean(req.cookies?.cleanship_session);

    const cats = await db
      .select()
      .from(serviceCategories)
      .orderBy(asc(serviceCategories.position), asc(serviceCategories.id));

    const svcs = await db
      .select()
      .from(services)
      .orderBy(asc(services.position), asc(services.id));

    const payload = cats
      .filter((c) => includeDrafts || c.published)
      .map((c) => ({
        ...c,
        services: svcs.filter(
          (s) => s.categoryId === c.id && (includeDrafts || s.published),
        ),
      }));

    res.json({ categories: payload });
  }),
);

/** GET /api/content/services/:categorySlug/:serviceSlug */
contentRouter.get(
  "/services/:categorySlug/:serviceSlug",
  asyncHandler(async (req, res) => {
    const [category] = await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.slug, req.params.categorySlug!))
      .limit(1);

    if (!category) throw ApiError.notFound("No such category");

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.slug, req.params.serviceSlug!))
      .limit(1);

    if (!service || service.categoryId !== category.id) {
      throw ApiError.notFound("No such service");
    }

    res.json({ category, service });
  }),
);

/** GET /api/content/projects */
contentRouter.get(
  "/projects",
  asyncHandler(async (req, res) => {
    const includeDrafts = Boolean(req.cookies?.cleanship_session);
    const rows = await db
      .select()
      .from(projects)
      .orderBy(asc(projects.position), asc(projects.id));

    res.json({
      projects: includeDrafts ? rows : rows.filter((p) => p.published),
    });
  }),
);

/* ------------------------------------------------------------------ */
/* Write — authenticated                                               */
/* ------------------------------------------------------------------ */

const write = [requireAuth, requireRole("admin", "editor")] as const;

contentRouter.post(
  "/categories",
  ...write,
  asyncHandler(async (req, res) => {
    const input = parseBody(categoryInput, req.body);
    const [created] = await db
      .insert(serviceCategories)
      .values(input)
      .returning();
    res.status(201).json({ category: created });
  }),
);

contentRouter.patch(
  "/categories/:slug",
  ...write,
  asyncHandler(async (req, res) => {
    const input = parseBody(categoryInput.partial(), req.body);
    const [updated] = await db
      .update(serviceCategories)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(serviceCategories.slug, req.params.slug!))
      .returning();

    if (!updated) throw ApiError.notFound("No such category");
    res.json({ category: updated });
  }),
);

contentRouter.delete(
  "/categories/:slug",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const [deleted] = await db
      .delete(serviceCategories)
      .where(eq(serviceCategories.slug, req.params.slug!))
      .returning({ id: serviceCategories.id });

    if (!deleted) throw ApiError.notFound("No such category");
    // Services cascade — see the FK note in the schema.
    res.json({ ok: true });
  }),
);

contentRouter.post(
  "/services",
  ...write,
  asyncHandler(async (req, res) => {
    const { categorySlug, ...rest } = parseBody(serviceInput, req.body);

    const [category] = await db
      .select({ id: serviceCategories.id })
      .from(serviceCategories)
      .where(eq(serviceCategories.slug, categorySlug))
      .limit(1);

    if (!category) throw ApiError.badRequest(`No category "${categorySlug}"`);

    const [created] = await db
      .insert(services)
      .values({ ...rest, categoryId: category.id })
      .returning();

    res.status(201).json({ service: created });
  }),
);

contentRouter.patch(
  "/services/:slug",
  ...write,
  asyncHandler(async (req, res) => {
    const { categorySlug, ...rest } = parseBody(
      serviceInput.partial(),
      req.body,
    );

    const patch: Record<string, unknown> = { ...rest, updatedAt: new Date() };

    // Moving a service between categories changes its URL — allowed, but it
    // must resolve to a real category first.
    if (categorySlug) {
      const [category] = await db
        .select({ id: serviceCategories.id })
        .from(serviceCategories)
        .where(eq(serviceCategories.slug, categorySlug))
        .limit(1);
      if (!category) throw ApiError.badRequest(`No category "${categorySlug}"`);
      patch.categoryId = category.id;
    }

    const [updated] = await db
      .update(services)
      .set(patch)
      .where(eq(services.slug, req.params.slug!))
      .returning();

    if (!updated) throw ApiError.notFound("No such service");
    res.json({ service: updated });
  }),
);

contentRouter.delete(
  "/services/:slug",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const [deleted] = await db
      .delete(services)
      .where(eq(services.slug, req.params.slug!))
      .returning({ id: services.id });

    if (!deleted) throw ApiError.notFound("No such service");
    res.json({ ok: true });
  }),
);

const projectInput = z.object({
  slug: z
    .string()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
  vesselType: z.string().min(2).max(160),
  scopeLabel: z.string().min(2).max(160),
  categorySlug: z.string().max(120).nullable().default(null),
  serviceSlug: z.string().max(120).nullable().default(null),
  challenge: z.string().min(2),
  approach: z.string().min(2),
  outcome: z.string().min(2),
  published: z.boolean().default(false),
  position: z.number().int().default(0),
});

contentRouter.post(
  "/projects",
  ...write,
  asyncHandler(async (req, res) => {
    const input = parseBody(projectInput, req.body);
    const [created] = await db.insert(projects).values(input).returning();
    res.status(201).json({ project: created });
  }),
);

contentRouter.patch(
  "/projects/:slug",
  ...write,
  asyncHandler(async (req, res) => {
    const input = parseBody(projectInput.partial(), req.body);
    const [updated] = await db
      .update(projects)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(projects.slug, req.params.slug!))
      .returning();

    if (!updated) throw ApiError.notFound("No such project");
    res.json({ project: updated });
  }),
);

contentRouter.delete(
  "/projects/:slug",
  requireAuth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const [deleted] = await db
      .delete(projects)
      .where(eq(projects.slug, req.params.slug!))
      .returning({ id: projects.id });

    if (!deleted) throw ApiError.notFound("No such project");
    res.json({ ok: true });
  }),
);

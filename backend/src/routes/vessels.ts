import { Router, type Request } from "express";
import { z } from "zod";
import {
  assignSupervisor,
  createVessel,
  deleteVessel,
  getVessel,
  getVesselDetail,
  getVesselVersion,
  listEvents,
  listVesselsFor,
  rotateShareToken,
  setCompartments,
  setShareRevoked,
  setStages,
  updateVessel,
} from "../domain/vessels.js";
import {
  applyCellChanges,
  applyToColumn,
  applyToRow,
  setCompartmentNote,
} from "../domain/cells.js";
import {
  CELL_STATUSES,
  STAGE_TEMPLATES,
  defaultCompartmentLabels,
} from "../domain/stages.js";
import { shareUrl } from "../domain/share.js";
import { canUpdateVessel, canViewVessel } from "../auth/roles.js";
import { requireRole, sessionOf } from "../http/session.js";
import { ApiError } from "../http/errors.js";
import { parseBody, parseId } from "../http/validate.js";

export const vesselRoutes = Router();

vesselRoutes.use(requireRole());

/* -------------------------------------------------------------------- */
/* What the create form needs before it can be filled in                */
/* -------------------------------------------------------------------- */

/**
 * GET /api/v1/vessels/templates
 *
 * The stage templates and the default compartment names, so the create form
 * renders the same starting point the API would have used. It is served rather
 * than hardcoded in the frontend so changing a default is a backend deploy,
 * not two.
 */
vesselRoutes.get("/templates", (req, res) => {
  const count = Math.min(Math.max(Number(req.query.count) || 5, 1), 60);
  res.json({
    templates: STAGE_TEMPLATES,
    statuses: CELL_STATUSES,
    defaultLabels: {
      hold: defaultCompartmentLabels("hold", count),
      tank: defaultCompartmentLabels("tank", count),
    },
  });
});

/* -------------------------------------------------------------------- */
/* Reads                                                                */
/* -------------------------------------------------------------------- */

vesselRoutes.get("/", async (req, res) => {
  const session = sessionOf(req);
  res.json({ vessels: await listVesselsFor(session) });
});

/** Loads the vessel and refuses early if this session has no business here. */
async function loadForRead(req: Request) {
  const id = parseId(req.params.id, "vessel id");
  const session = sessionOf(req);
  const vessel = await getVessel(id);
  if (!vessel) throw ApiError.notFound("No such vessel.");
  if (!canViewVessel(session, vessel)) throw ApiError.forbidden();
  return { id, session, vessel };
}

vesselRoutes.get("/:id", async (req, res) => {
  const { id } = await loadForRead(req);
  const detail = await getVesselDetail(id);
  if (!detail) throw ApiError.notFound("No such vessel.");
  res.json({
    vessel: detail,
    shareUrl: detail.shareRevoked ? null : shareUrl(detail.shareToken),
  });
});

/**
 * GET /api/v1/vessels/:id/version
 *
 * The poll target. Two integers and an access check — cheap enough that a
 * supervisor's phone can ask every few seconds on a dock connection.
 */
vesselRoutes.get("/:id/version", async (req, res) => {
  const id = parseId(req.params.id, "vessel id");
  const session = sessionOf(req);
  const row = await getVesselVersion(id);
  if (!row) throw ApiError.notFound("No such vessel.");
  if (!canViewVessel(session, row)) throw ApiError.forbidden();
  res.json({ version: row.version, status: row.status });
});

vesselRoutes.get("/:id/events", async (req, res) => {
  const { id } = await loadForRead(req);
  const limit = Number(req.query.limit) || 200;
  res.json({ events: await listEvents(id, limit) });
});

/* -------------------------------------------------------------------- */
/* Creating and editing — admin only                                    */
/* -------------------------------------------------------------------- */

const stageSchema = z.object({
  key: z.string().max(40).optional(),
  label: z.string().min(1, "Every stage needs a name.").max(80),
  short: z.string().max(12).optional(),
});

const createSchema = z.object({
  name: z.string().min(1, "Enter the vessel name.").max(160),
  imo: z.string().max(16).nullish(),
  port: z.string().min(1, "Enter the port.").max(160),
  berth: z.string().max(120).nullish(),
  type: z.enum(["hold", "tank"]),
  clientId: z.number().int().positive().nullish(),
  supervisorId: z.number().int().positive().nullish(),
  compartmentCount: z
    .number()
    .int()
    .min(1, "A vessel needs at least one hold or tank.")
    .max(60, "60 is the most this supports — say if you need more."),
  compartmentLabels: z.array(z.string().max(40)).optional(),
  stages: z.array(stageSchema).min(1, "Add at least one stage."),
  scheduledFor: z.coerce.date().nullish(),
  notes: z.string().max(4000).nullish(),
});

vesselRoutes.post("/", requireRole("admin"), async (req, res) => {
  const body = parseBody(createSchema, req.body);
  const vessel = await createVessel(body, sessionOf(req));
  res.status(201).json({ vessel });
});

const updateSchema = z.object({
  name: z.string().min(1).max(160).optional(),
  imo: z.string().max(16).nullish(),
  port: z.string().min(1).max(160).optional(),
  berth: z.string().max(120).nullish(),
  clientId: z.number().int().positive().nullable().optional(),
  status: z.enum(["scheduled", "in-progress", "complete", "cancelled"]).optional(),
  scheduledFor: z.coerce.date().nullish(),
  notes: z.string().max(4000).nullish(),
});

vesselRoutes.patch("/:id", requireRole("admin"), async (req, res) => {
  const id = parseId(req.params.id, "vessel id");
  const body = parseBody(updateSchema, req.body);
  res.json({ vessel: await updateVessel(id, body) });
});

/** Hands the vessel to a supervisor, or takes it back with `null`. */
vesselRoutes.post("/:id/assign", requireRole("admin"), async (req, res) => {
  const id = parseId(req.params.id, "vessel id");
  const body = parseBody(
    z.object({ supervisorId: z.number().int().positive().nullable() }),
    req.body,
  );
  res.json({ vessel: await assignSupervisor(id, body.supervisorId) });
});

vesselRoutes.put("/:id/stages", requireRole("admin"), async (req, res) => {
  const id = parseId(req.params.id, "vessel id");
  const body = parseBody(z.object({ stages: z.array(stageSchema).min(1) }), req.body);
  res.json({ vessel: await setStages(id, body.stages) });
});

vesselRoutes.put("/:id/compartments", requireRole("admin"), async (req, res) => {
  const id = parseId(req.params.id, "vessel id");
  const body = parseBody(
    z.object({ labels: z.array(z.string().min(1).max(40)).min(1).max(60) }),
    req.body,
  );
  res.json({ vessel: await setCompartments(id, body.labels) });
});

vesselRoutes.post("/:id/share/rotate", requireRole("admin"), async (req, res) => {
  const id = parseId(req.params.id, "vessel id");
  const vessel = await rotateShareToken(id);
  res.json({ vessel, shareUrl: shareUrl(vessel.shareToken) });
});

vesselRoutes.post("/:id/share/revoke", requireRole("admin"), async (req, res) => {
  const id = parseId(req.params.id, "vessel id");
  const body = parseBody(z.object({ revoked: z.boolean() }), req.body);
  const vessel = await setShareRevoked(id, body.revoked);
  res.json({
    vessel,
    shareUrl: vessel.shareRevoked ? null : shareUrl(vessel.shareToken),
  });
});

vesselRoutes.delete("/:id", requireRole("admin"), async (req, res) => {
  const id = parseId(req.params.id, "vessel id");
  await deleteVessel(id);
  res.status(204).end();
});

/* -------------------------------------------------------------------- */
/* The supervisor's actual job                                          */
/* -------------------------------------------------------------------- */

const changeSchema = z.object({
  compartmentId: z.number().int().positive(),
  stageKey: z.string().min(1).max(40),
  status: z.enum(["pending", "in_progress", "done", "na"]),
  note: z.string().max(160).nullish(),
  occurredAt: z.coerce.date().optional(),
  idempotencyKey: z.string().max(64).nullish(),
});

/** Loads a vessel and refuses unless this session may change it. */
async function loadForWrite(req: Request) {
  const id = parseId(req.params.id, "vessel id");
  const session = sessionOf(req);
  const vessel = await getVessel(id);
  if (!vessel) throw ApiError.notFound("No such vessel.");
  if (!canUpdateVessel(session, vessel)) {
    throw ApiError.forbidden(
      session.role === "supervisor"
        ? "This vessel is not assigned to you."
        : undefined,
    );
  }
  return { id, session };
}

/**
 * POST /api/v1/vessels/:id/cells
 *
 * One or many cell changes, applied together. Batching matters: the real
 * gestures are "this whole hold is dry-cleaned" and "HP washing done
 * everywhere", and splitting those into six requests gives a dock connection
 * six chances to drop half of them.
 */
vesselRoutes.post("/:id/cells", async (req, res) => {
  const { id, session } = await loadForWrite(req);
  const body = parseBody(
    z.object({ changes: z.array(changeSchema).min(1).max(200) }),
    req.body,
  );
  res.json(await applyCellChanges(id, body.changes, session));
});

/** Every compartment, one stage — the column heading tap. */
vesselRoutes.post("/:id/columns/:stageKey", async (req, res) => {
  const { id, session } = await loadForWrite(req);
  const body = parseBody(
    z.object({ status: z.enum(["pending", "in_progress", "done", "na"]) }),
    req.body,
  );
  const stageKey = String(req.params.stageKey);
  res.json(await applyToColumn(id, stageKey, body.status, session));
});

/** Every stage, one compartment — "Hold 3 is finished". */
vesselRoutes.post("/:id/rows/:compartmentId", async (req, res) => {
  const { id, session } = await loadForWrite(req);
  const compartmentId = parseId(req.params.compartmentId, "compartment id");
  const body = parseBody(
    z.object({ status: z.enum(["pending", "in_progress", "done", "na"]) }),
    req.body,
  );
  res.json(await applyToRow(id, compartmentId, body.status, session));
});

/** A note on the compartment itself, independent of any stage. */
vesselRoutes.patch("/:id/compartments/:compartmentId", async (req, res) => {
  const { id } = await loadForWrite(req);
  const compartmentId = parseId(req.params.compartmentId, "compartment id");
  const body = parseBody(
    z.object({ note: z.string().max(2000).nullable() }),
    req.body,
  );
  res.json({ compartment: await setCompartmentNote(id, compartmentId, body.note) });
});

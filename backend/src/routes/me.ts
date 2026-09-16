import { Router } from "express";
import { z } from "zod";
import {
  DOCUMENT_STATES,
  TRAVEL_STEPS,
  listMyAssignments,
  patchAssignment,
} from "../domain/crew.js";
import { requireRole, sessionOf } from "../http/session.js";
import { parseBody, parseId } from "../http/validate.js";
import { ApiError } from "../http/errors.js";

/**
 * The joiner's own door.
 *
 * Everything here is scoped to the caller by construction — the user id comes
 * from the session and never from the URL — so there is no ownership check to
 * forget. That is the whole reason these are not `/vessels/:id/crew/:userId`
 * routes with a "…unless it is you" branch: the branch is where the mistake
 * would eventually live.
 *
 * Open to `crew` and everything above it. A supervisor is a joiner too: they
 * carry the same passport onto the same flight, and their paperwork is filled
 * in on exactly these endpoints.
 */
export const meRoutes = Router();

meRoutes.use(requireRole("crew"));

/**
 * GET /api/v1/me/assignments
 *
 * Every vessel this person is rostered onto, with their own paperwork and the
 * lists that vessel asks for. `holdReportedAt` on each vessel is what tells
 * the app to stop asking and show the summary instead.
 */
meRoutes.get("/assignments", async (req, res) => {
  const session = sessionOf(req);
  res.json({
    assignments: await listMyAssignments(session.sub),
    /* Served rather than hardcoded in the app so the travel chain can change
       without waiting on a store review. */
    travelSteps: TRAVEL_STEPS,
    documentStates: DOCUMENT_STATES,
  });
});

const patchSchema = z.object({
  /* Partial by design: the app sends the one square that was tapped, and the
     server merges it. Sending the whole map would mean two people editing the
     same joiner at once — normal on the morning of a flight — silently
     undoing each other. */
  documents: z.record(z.string(), z.enum(DOCUMENT_STATES)).optional(),
  checklist: z.record(z.string(), z.boolean()).optional(),
  travel: z.record(z.string(), z.string().datetime().nullable()).optional(),
  notes: z.string().max(2000).nullish(),
});

/**
 * PATCH /api/v1/me/assignments/:vesselId
 *
 * A joiner updating their own paperwork. Refused once that vessel's crew have
 * reported to the hold — see patchAssignment.
 */
meRoutes.patch("/assignments/:vesselId", async (req, res) => {
  const session = sessionOf(req);
  const vesselId = parseId(req.params.vesselId, "vessel id");
  const body = parseBody(patchSchema, req.body);

  res.json({
    member: await patchAssignment(vesselId, session.sub, body, session),
  });
});

/* A joiner has no business anywhere else under /me yet. Saying so explicitly
   keeps a future typo'd path from falling through to the 404 handler with a
   message about the API rather than about this door. */
meRoutes.use((_req, _res, next) => next(ApiError.notFound("Unknown endpoint.")));

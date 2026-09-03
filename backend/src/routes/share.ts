import { Router } from "express";
import { z } from "zod";
import { getVesselByShareToken, getVesselVersion } from "../domain/vessels.js";
import { imoMatches, shareCookieValue } from "../domain/share.js";
import { db } from "../db/index.js";
import { vessels } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { ApiError } from "../http/errors.js";
import { parseBody } from "../http/validate.js";

export const shareRoutes = Router();

/**
 * The customer's window. No account, no session — a link plus the vessel's IMO.
 *
 * Two steps on purpose. The first tells a visitor which vessel they are
 * looking at so they know they have the right link; only the second, behind
 * the IMO, returns progress. A forwarded link on its own therefore leaks the
 * vessel name and nothing about the work.
 */

/* Empty is allowed because a vessel with no IMO on record has nothing to gate
   on — see the check below. A vessel that DOES have one still has to match. */
const gate = z.object({ imo: z.string().max(32).default("") });

/** Proof that the gate was passed. The caller stores it and sends it back. */
function proofHeader(req: { header(name: string): string | undefined }) {
  return req.header("x-share-proof") ?? null;
}

function requireProof(token: string, supplied: string | null) {
  if (!supplied || supplied !== shareCookieValue(token)) {
    throw new ApiError(
      401,
      "share_gate",
      "Confirm the vessel's IMO number to view this.",
    );
  }
}

/** What a link shows before the gate: enough to recognise, nothing more. */
shareRoutes.get("/:token", async (req, res) => {
  const token = String(req.params.token);
  const [row] = await db
    .select({
      name: vessels.name,
      reference: vessels.reference,
      revoked: vessels.shareRevoked,
      hasImo: vessels.imo,
    })
    .from(vessels)
    .where(eq(vessels.shareToken, token))
    .limit(1);

  if (!row || row.revoked) {
    throw ApiError.notFound("This link is no longer active. Ask for a new one.");
  }
  res.json({
    vessel: { name: row.name, reference: row.reference },
    requiresImo: Boolean(row.hasImo),
  });
});

shareRoutes.post("/:token/verify", async (req, res) => {
  const token = String(req.params.token);
  const body = parseBody(gate, req.body);

  const detail = await getVesselByShareToken(token);
  if (!detail) {
    throw ApiError.notFound("This link is no longer active. Ask for a new one.");
  }
  /* A barge or workboat with no IMO cannot answer a challenge, and inventing
     one would lock a customer out of their own job. Those open on the link
     alone; revoking the link is still the way to close them. */
  if (detail.imo && !imoMatches(detail.imo, body.imo)) {
    throw new ApiError(
      403,
      "imo_mismatch",
      "That IMO number does not match this vessel.",
    );
  }

  res.json({ proof: shareCookieValue(token), vessel: publicView(detail) });
});

shareRoutes.get("/:token/vessel", async (req, res) => {
  const token = String(req.params.token);
  requireProof(token, proofHeader(req));
  const detail = await getVesselByShareToken(token);
  if (!detail) throw ApiError.notFound("This link is no longer active.");
  res.json({ vessel: publicView(detail) });
});

shareRoutes.get("/:token/version", async (req, res) => {
  const token = String(req.params.token);
  requireProof(token, proofHeader(req));
  const [row] = await db
    .select({ id: vessels.id, revoked: vessels.shareRevoked })
    .from(vessels)
    .where(eq(vessels.shareToken, token))
    .limit(1);
  if (!row || row.revoked) throw ApiError.notFound("This link is no longer active.");
  const version = await getVesselVersion(row.id);
  res.json({ version: version?.version ?? 0, status: version?.status ?? "scheduled" });
});

/**
 * Strips what a customer has no business seeing.
 *
 * The share token itself is the important removal: it is a credential, and a
 * customer's browser holding a copy in a JSON payload is one screenshot away
 * from being forwarded on. Staff names go too — the crew's identities are not
 * part of what was sold.
 */
function publicView(detail: Awaited<ReturnType<typeof getVesselByShareToken>>) {
  if (!detail) return null;
  const {
    shareToken: _token,
    shareRevoked: _revoked,
    createdById: _createdBy,
    notes: _notes,
    supervisorName: _supervisor,
    supervisorId: _supervisorId,
    ...rest
  } = detail;
  return {
    ...rest,
    compartments: detail.compartments.map((c) => ({
      ...c,
      cells: Object.fromEntries(
        Object.entries(c.cells).map(([key, cell]) => [
          key,
          { status: cell.status, note: cell.note, updatedAt: cell.updatedAt },
        ]),
      ),
    })),
  };
}

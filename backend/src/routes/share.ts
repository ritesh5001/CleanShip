import { Router } from "express";
import { getVesselByShareToken, getVesselVersion } from "../domain/vessels.js";
import { db } from "../db/index.js";
import { vessels } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { ApiError } from "../http/errors.js";

export const shareRoutes = Router();

/**
 * The customer's window. No account, no session, no challenge.
 *
 * This used to ask for the vessel's IMO on top of the link. That gate is gone
 * by client direction: the customer opens the link and the vessel is there.
 *
 * Which means the link IS the credential, and the whole weight of access now
 * rests on it. Two things follow, and both are load-bearing rather than
 * decorative: the token must stay unguessable, and the office must be able to
 * see a link's life and end it — `shareRevoked` is checked on every read below,
 * so revoking takes effect on the customer's next poll rather than at some
 * cache expiry.
 */

/** What a link shows before the vessel loads: enough to recognise it. */
shareRoutes.get("/:token", async (req, res) => {
  const token = String(req.params.token);
  const [row] = await db
    .select({
      name: vessels.name,
      reference: vessels.reference,
      revoked: vessels.shareRevoked,
    })
    .from(vessels)
    .where(eq(vessels.shareToken, token))
    .limit(1);

  if (!row || row.revoked) {
    throw ApiError.notFound("This link is no longer active. Ask for a new one.");
  }
  res.json({ vessel: { name: row.name, reference: row.reference } });
});

shareRoutes.get("/:token/vessel", async (req, res) => {
  const token = String(req.params.token);
  const detail = await getVesselByShareToken(token);
  if (!detail) throw ApiError.notFound("This link is no longer active.");
  res.json({ vessel: publicView(detail) });
});

shareRoutes.get("/:token/version", async (req, res) => {
  const token = String(req.params.token);
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
          {
            status: cell.status,
            note: cell.note,
            /* The work times, not just when the row was touched. "Hold 3
               finished at 04:26" is the answer the customer came for;
               `updatedAt` would report a later correction as the finish. */
            startedAt: cell.startedAt,
            completedAt: cell.completedAt,
            updatedAt: cell.updatedAt,
          },
        ]),
      ),
    })),
  };
}

import { Router } from "express";
import { z } from "zod";
import { createClient, listClients, updateClient } from "../domain/clients.js";
import { requireRole } from "../http/session.js";
import { parseBody, parseId } from "../http/validate.js";

export const clientRoutes = Router();

/* Supervisors read this too: a vessel card names its client. */
clientRoutes.get("/", requireRole(), async (_req, res) => {
  res.json({ clients: await listClients() });
});

const schema = z.object({
  name: z.string().min(1, "Enter a client name."),
  contactName: z.string().max(120).nullish(),
  contactEmail: z.string().email().nullish().or(z.literal("")),
  contactPhone: z.string().max(40).nullish(),
});

clientRoutes.post("/", requireRole("admin"), async (req, res) => {
  const body = parseBody(schema, req.body);
  res.status(201).json({ client: await createClient(body) });
});

clientRoutes.patch("/:id", requireRole("admin"), async (req, res) => {
  const id = parseId(req.params.id, "client id");
  const body = parseBody(schema.partial(), req.body);
  res.json({ client: await updateClient(id, body) });
});

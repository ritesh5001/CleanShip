import { asc, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { clients, vessels } from "../db/schema.js";
import { ApiError } from "../http/errors.js";

/** Clients, each with how many vessels they have on the books. */
export async function listClients() {
  return db
    .select({
      id: clients.id,
      name: clients.name,
      contactName: clients.contactName,
      contactEmail: clients.contactEmail,
      contactPhone: clients.contactPhone,
      createdAt: clients.createdAt,
      vesselCount: sql<number>`count(${vessels.id})::int`,
    })
    .from(clients)
    .leftJoin(vessels, eq(vessels.clientId, clients.id))
    .groupBy(clients.id)
    .orderBy(asc(clients.name));
}

export type ClientInput = {
  name: string;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

export async function createClient(input: ClientInput) {
  const [row] = await db
    .insert(clients)
    .values({
      name: input.name.trim(),
      contactName: input.contactName?.trim() || null,
      contactEmail: input.contactEmail?.trim() || null,
      contactPhone: input.contactPhone?.trim() || null,
    })
    .returning();
  return row;
}

export async function updateClient(id: number, input: Partial<ClientInput>) {
  const [row] = await db
    .update(clients)
    .set({
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.contactName !== undefined
        ? { contactName: input.contactName?.trim() || null }
        : {}),
      ...(input.contactEmail !== undefined
        ? { contactEmail: input.contactEmail?.trim() || null }
        : {}),
      ...(input.contactPhone !== undefined
        ? { contactPhone: input.contactPhone?.trim() || null }
        : {}),
    })
    .where(eq(clients.id, id))
    .returning();
  if (!row) throw ApiError.notFound("No such client.");
  return row;
}

import { desc, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { enquiries, type Enquiry } from "../db/schema.js";
import { ApiError } from "../http/errors.js";

/** The marketing site's contact inbox. Admins and editors read it. */

export const ENQUIRY_STATUSES = [
  "new",
  "in-progress",
  "quoted",
  "won",
  "lost",
  "spam",
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export function isEnquiryStatus(value: unknown): value is EnquiryStatus {
  return (
    typeof value === "string" &&
    (ENQUIRY_STATUSES as readonly string[]).includes(value)
  );
}

export function listEnquiries(status?: EnquiryStatus, limit = 200) {
  const q = db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(limit);
  return status ? q.where(eq(enquiries.status, status)) : q;
}

/** Counts per status, for the inbox tabs. One query, not six. */
export async function enquiryCounts() {
  const rows = await db
    .select({ status: enquiries.status, count: sql<number>`count(*)::int` })
    .from(enquiries)
    .groupBy(enquiries.status);
  const out = Object.fromEntries(ENQUIRY_STATUSES.map((s) => [s, 0])) as Record<
    EnquiryStatus,
    number
  >;
  for (const r of rows) out[r.status] = r.count;
  return out;
}

export type EnquiryInput = Omit<Enquiry, "id" | "status" | "createdAt" | "notes"> &
  Partial<Pick<Enquiry, "notes">>;

export async function createEnquiry(input: EnquiryInput) {
  const [row] = await db.insert(enquiries).values(input).returning();
  return row;
}

export async function setEnquiryStatus(id: number, status: EnquiryStatus) {
  const [row] = await db
    .update(enquiries)
    .set({ status })
    .where(eq(enquiries.id, id))
    .returning();
  if (!row) throw ApiError.notFound("No such enquiry.");
  return row;
}

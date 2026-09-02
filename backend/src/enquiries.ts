import { desc, eq, sql } from "drizzle-orm";
import { db } from "./db";
import { enquiries, type Enquiry } from "./db/schema";

export const ENQUIRY_STATUSES = [
  "new",
  "in-progress",
  "quoted",
  "won",
  "lost",
  "spam",
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export function isEnquiryStatus(value: string): value is EnquiryStatus {
  return (ENQUIRY_STATUSES as readonly string[]).includes(value);
}

export async function listEnquiries(limit = 200): Promise<Enquiry[]> {
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(limit);
}

export async function enquiryCounts() {
  return db
    .select({ status: enquiries.status, n: sql<number>`count(*)::int` })
    .from(enquiries)
    .groupBy(enquiries.status);
}

export async function setEnquiryStatus(id: number, status: EnquiryStatus) {
  await db.update(enquiries).set({ status }).where(eq(enquiries.id, id));
}

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/db/schema";

const STATUSES = ["new", "in-progress", "quoted", "won", "lost", "spam"] as const;

export async function setEnquiryStatusAction(formData: FormData) {
  await requireSession("admin", "editor");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return;

  await db
    .update(enquiries)
    .set({ status: status as (typeof STATUSES)[number] })
    .where(eq(enquiries.id, id));
  revalidatePath("/admin");
}

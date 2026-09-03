"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { setEnquiryStatus } from "@/lib/api";

const STATUSES = ["new", "in-progress", "quoted", "won", "lost", "spam"];

export async function setEnquiryStatusAction(formData: FormData) {
  await requireSession("admin", "editor");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!STATUSES.includes(status)) return;

  await setEnquiryStatus(id, status);
  revalidatePath("/admin");
}

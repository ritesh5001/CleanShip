"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { isEnquiryStatus, setEnquiryStatus } from "@cleanship/backend/enquiries";

export async function setEnquiryStatusAction(formData: FormData) {
  await requireSession("admin", "editor");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!isEnquiryStatus(status)) return;

  await setEnquiryStatus(id, status);
  revalidatePath("/admin");
}

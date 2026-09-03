"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type Enquiry } from "@/lib/api";

const STATUSES = ["new", "in_progress", "quoted", "won", "lost", "spam"] as const;

const STATUS_STYLE: Record<Enquiry["status"], string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  quoted: "bg-navy-800/10 text-navy-800",
  won: "bg-success-100 text-success-600",
  lost: "bg-danger-100 text-danger-600",
  spam: "bg-slate-300/30 text-slate-500",
};

export default function AdminInboxPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    const qs = status ? `?status=${status}` : "";
    api
      .get<{ enquiries: Enquiry[]; total: number; unread: number }>(
        `/api/enquiries${qs}`,
      )
      .then((data) => setEnquiries(data.enquiries))
      .catch(() => setError("Could not load enquiries."))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: number, next: Enquiry["status"]) {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: next } : e)),
    );
    try {
      await api.patch(`/api/enquiries/${id}`, { status: next });
    } catch {
      load();
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="status-filter" className="label-caps text-[11px] text-slate-500">
          Filter
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="min-h-9 border border-line-200 bg-white px-3 py-1.5 text-[14px] text-ink-900 focus:border-blue-400 focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="border border-danger-600/30 bg-danger-100 px-4 py-3 text-[14px] text-danger-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-[14px] text-slate-500">Loading…</p>
      ) : enquiries.length === 0 ? (
        <p className="text-[14px] text-slate-500">No enquiries here.</p>
      ) : (
        <div className="divide-y divide-line-200 border border-line-200">
          {enquiries.map((e) => (
            <div key={e.id} className="p-4">
              <button
                type="button"
                onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[15px] font-semibold text-ink-900">
                      {e.name}
                    </span>
                    <span
                      className={`label-caps shrink-0 px-2 py-0.5 text-[10px] ${STATUS_STYLE[e.status]}`}
                    >
                      {e.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-[13px] text-slate-500">
                    {e.email} {e.service ? `· ${e.service}` : ""}
                  </div>
                </div>
                <span className="shrink-0 text-[12px] text-slate-400">
                  {new Date(e.createdAt).toLocaleDateString()}
                </span>
              </button>

              {expanded === e.id && (
                <div className="mt-4 space-y-3 border-t border-line-200 pt-4">
                  <p className="whitespace-pre-wrap text-[14px] leading-[1.62] text-ink-700">
                    {e.message}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-slate-500">
                    {e.phone && <span>Phone: {e.phone}</span>}
                    {e.company && <span>Company: {e.company}</span>}
                    {e.vessel && <span>Vessel: {e.vessel}</span>}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <label htmlFor={`status-${e.id}`} className="label-caps text-[11px] text-slate-500">
                      Set status
                    </label>
                    <select
                      id={`status-${e.id}`}
                      value={e.status}
                      onChange={(ev) =>
                        updateStatus(e.id, ev.target.value as Enquiry["status"])
                      }
                      className="min-h-9 border border-line-200 bg-white px-3 py-1.5 text-[13px] text-ink-900 focus:border-blue-400 focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./session-cookie";
import type {
  CellEvent,
  CellStatus,
  PublicVessel,
  Stage,
  StageTemplate,
  VesselDetail,
  VesselSummary,
} from "./cleantrack/types";

/**
 * The CleanTrack API client.
 *
 * Every call is made from the server — a page, a route handler or a server
 * action — never from the browser. That is what keeps the session token in an
 * httpOnly cookie the browser cannot read, and it sidesteps CORS entirely,
 * because a request from a Node process carries no Origin.
 *
 * BACKEND_URL is the API's origin (the Render service). It is deliberately not
 * NEXT_PUBLIC_: nothing in the browser should be talking to it directly.
 */
const BASE = (process.env.BACKEND_URL ?? "http://localhost:4000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Send the signed-in user's token. On by default. */
  auth?: boolean;
  headers?: Record<string, string>;
  /** Reads are uncached by default: a status board must never be stale. */
  cache?: RequestCache;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, headers = {}, cache = "no-store" } = options;

  if (auth) {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      cache,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    /* The API being unreachable is a different problem from the API saying no,
       and the message has to say so — otherwise a cold Render instance reads
       to the user as "your password is wrong". */
    throw new ApiError(
      503,
      "unreachable",
      "Cannot reach the CleanTrack service. It may be starting up — try again in a moment.",
      err,
    );
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const error = (payload as { error?: { code?: string; message?: string; details?: unknown } })
      ?.error;
    throw new ApiError(
      response.status,
      error?.code ?? "http_error",
      error?.message ?? `Request failed (${response.status}).`,
      error?.details,
    );
  }

  return payload as T;
}

/* -------------------------------------------------------------------- */
/* Auth                                                                 */
/* -------------------------------------------------------------------- */

export type ApiSessionUser = {
  sub: number;
  email: string;
  name: string;
  role: "admin" | "editor" | "supervisor";
};

export function login(email: string, password: string, allow?: string[]) {
  return request<{
    token: string;
    expiresIn: number;
    user: ApiSessionUser;
    landing: string;
  }>("/api/v1/auth/login", {
    method: "POST",
    auth: false,
    body: { email, password, allow },
  });
}

/* -------------------------------------------------------------------- */
/* Vessels                                                              */
/* -------------------------------------------------------------------- */

export async function listVessels() {
  const { vessels } = await request<{ vessels: VesselSummary[] }>("/api/v1/vessels");
  return vessels;
}

export async function getVessel(id: number) {
  return request<{ vessel: VesselDetail; shareUrl: string | null }>(
    `/api/v1/vessels/${id}`,
  );
}

export async function getVesselVersion(id: number) {
  return request<{ version: number; status: string }>(`/api/v1/vessels/${id}/version`);
}

export async function getVesselEvents(id: number) {
  const { events } = await request<{ events: CellEvent[] }>(
    `/api/v1/vessels/${id}/events`,
  );
  return events;
}

export async function getVesselTemplates(count = 5) {
  return request<{
    templates: StageTemplate[];
    statuses: CellStatus[];
    defaultLabels: { hold: string[]; tank: string[] };
  }>(`/api/v1/vessels/templates?count=${count}`);
}

export type CreateVesselInput = {
  name: string;
  imo?: string | null;
  port: string;
  berth?: string | null;
  type: "hold" | "tank";
  clientId?: number | null;
  supervisorId?: number | null;
  compartmentCount: number;
  compartmentLabels?: string[];
  stages: { key?: string; label: string; short?: string }[];
  scheduledFor?: string | null;
  notes?: string | null;
};

export async function createVessel(input: CreateVesselInput) {
  const { vessel } = await request<{ vessel: VesselSummary }>("/api/v1/vessels", {
    method: "POST",
    body: input,
  });
  return vessel;
}

export function updateVessel(id: number, patch: Record<string, unknown>) {
  return request<{ vessel: VesselSummary }>(`/api/v1/vessels/${id}`, {
    method: "PATCH",
    body: patch,
  });
}

export function assignSupervisor(id: number, supervisorId: number | null) {
  return request<{ vessel: VesselSummary }>(`/api/v1/vessels/${id}/assign`, {
    method: "POST",
    body: { supervisorId },
  });
}

export function setVesselStages(id: number, stages: Stage[] | { key?: string; label: string; short?: string }[]) {
  return request<{ vessel: VesselSummary }>(`/api/v1/vessels/${id}/stages`, {
    method: "PUT",
    body: { stages },
  });
}

export function setVesselCompartments(id: number, labels: string[]) {
  return request<{ vessel: VesselSummary }>(`/api/v1/vessels/${id}/compartments`, {
    method: "PUT",
    body: { labels },
  });
}

export function rotateShareLink(id: number) {
  return request<{ shareUrl: string }>(`/api/v1/vessels/${id}/share/rotate`, {
    method: "POST",
  });
}

export function setShareRevoked(id: number, revoked: boolean) {
  return request<{ shareUrl: string | null }>(`/api/v1/vessels/${id}/share/revoke`, {
    method: "POST",
    body: { revoked },
  });
}

/* -------------------------------------------------------------------- */
/* The supervisor's writes                                              */
/* -------------------------------------------------------------------- */

export type CellChange = {
  compartmentId: number;
  stageKey: string;
  status: CellStatus;
  note?: string | null;
  /** Explicit work times, when someone corrected them. */
  startedAt?: string | null;
  completedAt?: string | null;
  occurredAt?: string;
  idempotencyKey?: string;
};

export type ApplyResult = {
  vesselId: number;
  version: number;
  status: string;
  applied: number;
  duplicate: boolean;
};

export function applyCellChanges(vesselId: number, changes: CellChange[]) {
  return request<ApplyResult>(`/api/v1/vessels/${vesselId}/cells`, {
    method: "POST",
    body: { changes },
  });
}

export function applyToColumn(vesselId: number, stageKey: string, status: CellStatus) {
  return request<ApplyResult>(
    `/api/v1/vessels/${vesselId}/columns/${encodeURIComponent(stageKey)}`,
    { method: "POST", body: { status } },
  );
}

export function applyToRow(vesselId: number, compartmentId: number, status: CellStatus) {
  return request<ApplyResult>(
    `/api/v1/vessels/${vesselId}/rows/${compartmentId}`,
    { method: "POST", body: { status } },
  );
}

export function setCompartmentNote(
  vesselId: number,
  compartmentId: number,
  note: string | null,
) {
  return request<{ compartment: { id: number; notes: string | null } }>(
    `/api/v1/vessels/${vesselId}/compartments/${compartmentId}`,
    { method: "PATCH", body: { note } },
  );
}

/* -------------------------------------------------------------------- */
/* People and clients                                                   */
/* -------------------------------------------------------------------- */

export type ApiUser = {
  id: number;
  email: string;
  name: string;
  role: "admin" | "editor" | "supervisor";
  phone: string | null;
  active: number;
  lastLoginAt: string | null;
  createdAt: string;
};

export async function listUsers() {
  const { users } = await request<{ users: ApiUser[] }>("/api/v1/users");
  return users;
}

export async function listSupervisors() {
  const { supervisors } = await request<{
    supervisors: { id: number; name: string; email: string }[];
  }>("/api/v1/users/supervisors");
  return supervisors;
}

export function createUser(input: {
  email: string;
  name: string;
  role: string;
  password?: string;
  phone?: string | null;
}) {
  return request<{ user: ApiUser; temporaryPassword?: string }>("/api/v1/users", {
    method: "POST",
    body: input,
  });
}

export function updateUser(id: number, patch: Record<string, unknown>) {
  return request<{ user: ApiUser }>(`/api/v1/users/${id}`, {
    method: "PATCH",
    body: patch,
  });
}

export function resetUserPassword(id: number) {
  return request<{ user: ApiUser; temporaryPassword: string }>(
    `/api/v1/users/${id}/reset-password`,
    { method: "POST" },
  );
}

export type ApiClient = {
  id: number;
  name: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
  vesselCount: number;
};

export async function listClients() {
  const { clients } = await request<{ clients: ApiClient[] }>("/api/v1/clients");
  return clients;
}

export function createClient(input: {
  name: string;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
}) {
  return request<{ client: ApiClient }>("/api/v1/clients", {
    method: "POST",
    body: input,
  });
}

/* -------------------------------------------------------------------- */
/* Enquiries                                                            */
/* -------------------------------------------------------------------- */

export type ApiEnquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  vessel: string | null;
  service: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export async function listEnquiries(status?: string) {
  return request<{
    enquiries: ApiEnquiry[];
    counts: Record<string, number>;
    statuses: string[];
  }>(`/api/v1/enquiries${status ? `?status=${encodeURIComponent(status)}` : ""}`);
}

export function setEnquiryStatus(id: number, status: string) {
  return request<{ enquiry: ApiEnquiry }>(`/api/v1/enquiries/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

/** The public contact form. No session — this is an anonymous visitor. */
export function submitEnquiry(input: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  vessel?: string | null;
  service?: string | null;
  message: string;
}) {
  return request<{ id: number }>("/api/v1/enquiries", {
    method: "POST",
    auth: false,
    body: input,
  });
}

/* -------------------------------------------------------------------- */
/* The customer share link                                              */
/* -------------------------------------------------------------------- */

export function peekShare(token: string) {
  return request<{
    vessel: { name: string; reference: string };
    requiresImo: boolean;
  }>(`/api/v1/share/${token}`, { auth: false });
}

export function verifyShare(token: string, imo: string) {
  return request<{ proof: string; vessel: PublicVessel }>(
    `/api/v1/share/${token}/verify`,
    { method: "POST", auth: false, body: { imo } },
  );
}

export function getSharedVessel(token: string, proof: string) {
  return request<{ vessel: PublicVessel }>(`/api/v1/share/${token}/vessel`, {
    auth: false,
    headers: { "X-Share-Proof": proof },
  });
}

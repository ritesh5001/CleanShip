import Constants from "expo-constants";
import type { CellStatus, SessionUser, VesselDetail, VesselSummary } from "./types";

/**
 * The CleanTrack API client.
 *
 * Unlike the web app — which keeps its token in an httpOnly cookie the browser
 * cannot read and calls the API only from its own server — a native app has no
 * such shelter. The token lives in AsyncStorage and is attached here as a
 * bearer header. That is the standard shape for a mobile client, and it is why
 * the API accepts `Authorization` as well as a cookie.
 *
 * CORS never applies: a native request carries no Origin header, and the API
 * treats those as server-to-server.
 */
/**
 * The API origin.
 *
 * EXPO_PUBLIC_API_URL wins so a build can be pointed at a local server or a
 * staging one without editing app.json — the EAS profiles use it. The value in
 * app.json is the shipping default.
 */
const BASE = String(
  process.env.EXPO_PUBLIC_API_URL ??
    Constants.expoConfig?.extra?.apiUrl ??
    "https://cleanship.onrender.com",
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }

  /** True when retrying later could plausibly succeed. */
  get isTransient() {
    return this.status === 0 || this.status >= 500 || this.status === 429;
  }
}

/**
 * Render's free tier sleeps and takes ~30s to wake. A supervisor opening the
 * app to a spinner that gives up after 10 seconds concludes it is broken, so
 * the timeout is generous — and every screen says what it is waiting for.
 */
const TIMEOUT_MS = 45_000;

type Options = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

export async function request<T>(path: string, options: Options = {}): Promise<T> {
  const { method = "GET", body, token, signal } = options;

  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  /* One controller for the caller's signal and our own timeout, so a screen
     unmounting and a slow network both abort the same request. */
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      signal: controller.signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    /* No connection, DNS failure, or the timeout above. Status 0 marks it as
       worth retrying, which is what keeps queued work queued rather than
       being thrown away as a permanent failure. */
    const aborted = (err as Error)?.name === "AbortError";
    throw new ApiError(
      0,
      aborted ? "timeout" : "offline",
      aborted
        ? "The service did not respond. It may be starting up — try again."
        : "No connection.",
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
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
    const error = (payload as { error?: { code?: string; message?: string } })?.error;
    throw new ApiError(
      response.status,
      error?.code ?? "http_error",
      error?.message ?? `Request failed (${response.status}).`,
    );
  }

  return payload as T;
}

/* -------------------------------------------------------------------- */
/* Auth                                                                 */
/* -------------------------------------------------------------------- */

/**
 * Signs in, restricted to supervisors.
 *
 * `allow` is what makes the API answer "that is an office account, use the
 * admin login" instead of "wrong password" — this app is the crew door, and
 * an admin typing their details into it deserves to be told so.
 */
export function login(email: string, password: string) {
  return request<{
    token: string;
    expiresIn: number;
    user: SessionUser;
    landing: string;
  }>("/api/v1/auth/login", {
    method: "POST",
    body: { email, password, allow: ["supervisor"] },
  });
}

export function me(token: string) {
  return request<{ user: SessionUser }>("/api/v1/auth/me", { token });
}

/* -------------------------------------------------------------------- */
/* Vessels                                                              */
/* -------------------------------------------------------------------- */

/** The API filters this to the supervisor's own vessels; nothing to pass. */
export async function listVessels(token: string, signal?: AbortSignal) {
  const { vessels } = await request<{ vessels: VesselSummary[] }>("/api/v1/vessels", {
    token,
    signal,
  });
  return vessels;
}

export async function getVessel(token: string, id: number, signal?: AbortSignal) {
  const { vessel } = await request<{ vessel: VesselDetail }>(`/api/v1/vessels/${id}`, {
    token,
    signal,
  });
  return vessel;
}

export function getVesselVersion(token: string, id: number, signal?: AbortSignal) {
  return request<{ version: number; status: string }>(
    `/api/v1/vessels/${id}/version`,
    { token, signal },
  );
}

export type CellChange = {
  compartmentId: number;
  stageKey: string;
  status: CellStatus;
  note?: string | null;
  occurredAt: string;
  idempotencyKey: string;
};

export type ApplyResult = {
  vesselId: number;
  version: number;
  status: string;
  applied: number;
  duplicate: boolean;
};

/**
 * Sends a batch of cell changes.
 *
 * Batched because the real gestures are "this whole hold is dry-cleaned" and a
 * queue flushing after an hour with no signal — sending those one at a time
 * gives a dock connection that many chances to drop half of them.
 */
export function applyCellChanges(
  token: string,
  vesselId: number,
  changes: CellChange[],
) {
  return request<ApplyResult>(`/api/v1/vessels/${vesselId}/cells`, {
    method: "POST",
    token,
    body: { changes },
  });
}

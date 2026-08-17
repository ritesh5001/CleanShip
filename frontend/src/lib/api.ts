/**
 * Client for the Cleanship API (separate Express/Render deploy — see
 * ../../../backend). Every call goes cross-origin with cookies, so
 * `credentials: "include"` is mandatory or the session cookie never attaches.
 */

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export class ApiClientError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      body?.message ?? body?.error ?? `Request failed (${res.status})`,
    );
  }

  return body as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(data) }),
};

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  role: "admin" | "editor";
};

export type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  vessel: string | null;
  service: string | null;
  message: string;
  status: "new" | "in_progress" | "quoted" | "won" | "lost" | "spam";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

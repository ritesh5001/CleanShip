import type { z } from "zod";
import { ApiError } from "./errors.js";

/**
 * Parses a request body, turning a schema failure into a 400 that names the
 * fields rather than a 500 that names nothing.
 */
export function parseBody<T extends z.ZodType>(schema: T, body: unknown): z.infer<T> {
  const result = schema.safeParse(body);
  if (result.success) return result.data;

  const details = result.error.issues.map((i) => ({
    field: i.path.join(".") || "(body)",
    message: i.message,
  }));
  const first = details[0];
  throw ApiError.badRequest(
    first ? `${first.field}: ${first.message}` : "Invalid request body.",
    details,
  );
}

/**
 * `:id` path params, which are strings until proven otherwise.
 *
 * Express 5 types a param as `string | string[]` because a route can repeat a
 * name. None of ours do, so an array here is a caller sending nonsense and it
 * gets the same 400 as a non-numeric id.
 */
export function parseId(value: string | string[] | undefined, what = "id"): number {
  if (Array.isArray(value)) throw ApiError.badRequest(`Invalid ${what}.`);
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) {
    throw ApiError.badRequest(`Invalid ${what}.`);
  }
  return n;
}

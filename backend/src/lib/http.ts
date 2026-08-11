import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { ZodError, type ZodType } from "zod";

/**
 * An error with an intended HTTP status. Anything thrown that is NOT an
 * ApiError is treated as a bug and reported as a generic 500 — internal
 * messages must never reach a client.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code = "error",
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, "bad_request", details);
  }
  static unauthorized(message = "Authentication required") {
    return new ApiError(401, message, "unauthorized");
  }
  static forbidden(message = "Not permitted") {
    return new ApiError(403, message, "forbidden");
  }
  static notFound(message = "Not found") {
    return new ApiError(404, message, "not_found");
  }
  static conflict(message: string) {
    return new ApiError(409, message, "conflict");
  }
}

/**
 * Wraps an async handler so a rejected promise reaches Express's error
 * middleware. Without this, an await that throws becomes an unhandled
 * rejection and the request hangs until it times out.
 */
export function asyncHandler<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown>,
) {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    fn(req, res, next).catch(next);
  };
}

/** Parses a payload or throws a 400 carrying field-level detail. */
export function parseBody<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw ApiError.badRequest("Validation failed", fieldErrors(result.error));
  }
  return result.data;
}

function fieldErrors(error: ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    // First message per field is the useful one for a form.
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Central error handler. Registered last, after all routes. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // Express identifies error middleware by arity — `next` must stay declared.
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: err.code,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  console.error("[api] unhandled error", err);
  res.status(500).json({
    error: "internal_error",
    message: "Something went wrong.",
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "not_found", message: "No such endpoint." });
}

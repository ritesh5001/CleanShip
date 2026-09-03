import type { NextFunction, Request, Response } from "express";

/**
 * One error type for everything a route can refuse to do.
 *
 * Throwing this instead of writing a response inline means the shape of an
 * error is decided in exactly one place, so a client never has to handle two
 * different error bodies from the same API.
 */
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

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, "bad_request", message, details);
  }
  static unauthorized(message = "Sign in to continue.") {
    return new ApiError(401, "unauthorized", message);
  }
  static forbidden(message = "You do not have access to this.") {
    return new ApiError(403, "forbidden", message);
  }
  static notFound(message = "Not found.") {
    return new ApiError(404, "not_found", message);
  }
  static conflict(message: string) {
    return new ApiError(409, "conflict", message);
  }
}

/** 404 for anything no route claimed. Mounted after every router. */
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: { code: "not_found", message: "No such endpoint." } });
}

/**
 * The last middleware. Express 5 forwards rejected promises here, so async
 * routes need no try/catch of their own.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  /* Anything reaching here is a bug. Log it in full, tell the caller nothing:
     a stack trace in a response body is how internals leak. */
  console.error("[api] unhandled error", err);
  res.status(500).json({
    error: {
      code: "internal_error",
      message: "Something went wrong. The error has been logged.",
    },
  });
}

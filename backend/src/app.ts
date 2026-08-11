import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./env.js";
import { errorHandler, notFoundHandler } from "./lib/http.js";
import { authRouter } from "./modules/auth.routes.js";
import { contentRouter } from "./modules/content.routes.js";
import { enquiriesRouter } from "./modules/enquiries.routes.js";
import { pool } from "./db/index.js";

export function createApp() {
  const app = express();

  /* Behind Vercel/Render/Fly there is a proxy in front. Without this, req.ip
     is the proxy's address — which would make the per-IP rate limits apply to
     every visitor as one bucket. Trust exactly one hop, not `true`, which
     would let a client spoof X-Forwarded-For. */
  app.set("trust proxy", 1);

  app.disable("x-powered-by");
  app.use(helmet());

  app.use(
    cors({
      /**
       * Credentialed requests cannot use a wildcard origin, so the allow-list
       * is explicit and an unknown origin is never reflected back.
       *
       * Denial is `(null, false)` — omit the CORS headers — rather than
       * throwing. Throwing surfaced as a 500 and logged every stray probe as
       * an unhandled server error. Note CORS is enforced by the browser, not
       * here: it stops a malicious *site* using a visitor's cookies, but it is
       * not an access control. The auth guards are what actually protect
       * these endpoints from a direct client like curl.
       */
      origin(origin, callback) {
        // Same-origin and server-side calls arrive without an Origin header.
        if (!origin) return callback(null, true);
        callback(null, env.corsOrigins.includes(origin));
      },
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    }),
  );

  // Enquiry messages cap at 4000 chars; 100kb is generous and bounds abuse.
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  // Broad ceiling. Tighter limits live on the endpoints that need them.
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    }),
  );

  /** Liveness + database reachability, for uptime checks and deploy gates. */
  app.get("/health", async (_req, res) => {
    try {
      await pool.query("select 1");
      res.json({ ok: true, db: "up", env: env.NODE_ENV });
    } catch {
      res.status(503).json({ ok: false, db: "down" });
    }
  });

  app.use("/api/auth", authRouter);
  app.use("/api/enquiries", enquiriesRouter);
  app.use("/api/content", contentRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

import express from "express";
import cors from "cors";
import { env } from "./env.js";
import { attachSession } from "./http/session.js";
import { errorHandler, notFoundHandler } from "./http/errors.js";
import { authRoutes } from "./routes/auth.js";
import { userRoutes } from "./routes/users.js";
import { clientRoutes } from "./routes/clients.js";
import { vesselRoutes } from "./routes/vessels.js";
import { shareRoutes } from "./routes/share.js";
import { enquiryRoutes } from "./routes/enquiries.js";
import { rawPool } from "./db/index.js";

/**
 * The API, assembled.
 *
 * Kept separate from `index.ts` so a test can build the app without binding a
 * port, and so the boot sequence (env check, listen, shutdown) reads as one
 * thing in one file.
 */
export function createApp() {
  const app = express();

  /* Render terminates TLS at its proxy, so without this every request looks
     like plain HTTP from 10.x — which breaks the client IP the throttle reads
     and any future secure-cookie logic. */
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    cors({
      origin(origin, callback) {
        /* No Origin header means a server-to-server call — the Next app on
           Vercel, or curl. CORS has nothing to say about those. */
        if (!origin) return callback(null, true);
        if (env.corsOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Origin ${origin} is not allowed.`));
      },
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "X-Share-Proof"],
    }),
  );

  app.use(express.json({ limit: "256kb" }));

  /* One line per request, which is what Render's log view is good for.
     Skipped for the health check, which fires constantly and says nothing. */
  app.use((req, res, next) => {
    if (req.path === "/health") return next();
    const started = Date.now();
    res.on("finish", () => {
      console.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - started}ms`,
      );
    });
    next();
  });

  /**
   * Render's health check. Reports the database too, because a service that
   * answers 200 while unable to reach Postgres is a service that looks healthy
   * on the dashboard and is useless to everyone using it.
   */
  app.get("/health", async (_req, res) => {
    try {
      await rawPool().query("select 1");
      res.json({ ok: true, db: "up", version: process.env.npm_package_version });
    } catch (err) {
      console.error("[health] database unreachable", err);
      res.status(503).json({ ok: false, db: "down" });
    }
  });

  app.use(attachSession);

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/clients", clientRoutes);
  app.use("/api/v1/vessels", vesselRoutes);
  app.use("/api/v1/share", shareRoutes);
  app.use("/api/v1/enquiries", enquiryRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

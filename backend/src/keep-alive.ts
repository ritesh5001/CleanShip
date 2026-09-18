/**
 * Self-ping to keep the service awake on Render's free tier.
 *
 * Free web services spin down after 15 minutes without inbound traffic, and
 * the first request after that waits ~a minute for a cold start. Pinging our
 * own PUBLIC URL every 12 minutes goes out through Render's proxy and back in,
 * so it counts as inbound traffic and the idle timer never runs out.
 *
 * RENDER_EXTERNAL_URL is set by Render automatically, so this is a no-op in
 * local development. KEEP_ALIVE=off disables it without a code change.
 */
const INTERVAL_MS = 12 * 60 * 1000;

export function startKeepAlive() {
  const base = process.env.RENDER_EXTERNAL_URL;
  if (!base || process.env.KEEP_ALIVE === "off") return;

  const url = `${base.replace(/\/$/, "")}/ping`;
  console.log(`[keep-alive] pinging ${url} every 12 min`);

  const timer = setInterval(async () => {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!res.ok) console.warn(`[keep-alive] ping answered ${res.status}`);
    } catch (err) {
      console.warn("[keep-alive] ping failed", err);
    }
  }, INTERVAL_MS);

  /* Never hold the process open on shutdown. */
  timer.unref();
}

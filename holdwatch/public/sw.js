/**
 * Service worker — app shell only.
 *
 * ⚠️ IT DELIBERATELY DOES NOT CACHE JOB DATA.
 *
 * Caching a job would let a supervisor open the app on a dock and read
 * yesterday's progress with no indication it was stale — which is worse than
 * showing nothing, because they would act on it. Offline resilience for the
 * thing that matters (their taps) lives in localStorage in StageBoard, where
 * writes queue and replay. This worker only makes the shell load fast and
 * gives the installed app something to show when there is no signal at all.
 */

const CACHE = "holdwatch-shell-v1";
const SHELL = ["/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never serve API responses from cache — see the note above.
  if (url.pathname.startsWith("/api/")) return;

  // Static assets: cache first. Everything else: network, no fallback body,
  // so a failed page load looks like a failed page load.
  if (url.pathname.startsWith("/_next/static/") || SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
  }
});

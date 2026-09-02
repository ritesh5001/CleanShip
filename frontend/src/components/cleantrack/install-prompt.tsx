"use client";

import { useEffect, useState } from "react";

/**
 * Prompts a supervisor to install the app to their home screen.
 *
 * WHY A PWA AND NOT A NATIVE APP
 *
 * Installed, this is indistinguishable from a native app to the person using
 * it: home screen icon, full screen, works offline. What it avoids is an app
 * store review cycle between a bug being found on a dock and the fix being on
 * the supervisor's phone — which for a tool whose whole value is "the update
 * is instant" is the wrong trade. If a native shell is ever needed (camera
 * depth for Phase 3 photos, push notifications), the same API serves it.
 *
 * The banner is dismissible and remembers the dismissal — nobody should be
 * nagged twice.
 */

type InstallEvent = Event & { prompt: () => Promise<void> };

const DISMISSED = "cleantrack.install.dismissed";

export function InstallPrompt() {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED)) return;
    /* Already installed — the browser reports standalone display mode. */
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
      setHidden(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* Registration fails on http:// origins other than localhost. The app
           works fine without it — offline queueing is localStorage, not the
           service worker. */
      });
    }
  }, []);

  if (hidden || !event) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3">
      <p className="text-[14px] text-blue-900">
        <strong className="font-semibold">Add to home screen</strong> — opens
        full screen and keeps working without signal.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(DISMISSED, "1");
            setHidden(true);
          }}
          className="rounded-md px-3 py-2 text-[13px] font-medium text-blue-800 hover:bg-blue-100"
        >
          Not now
        </button>
        <button
          type="button"
          onClick={async () => {
            await event.prompt();
            setHidden(true);
          }}
          className="rounded-md bg-blue-700 px-3 py-2 text-[13px] font-semibold text-white hover:bg-blue-800"
        >
          Install
        </button>
      </div>
    </div>
  );
}

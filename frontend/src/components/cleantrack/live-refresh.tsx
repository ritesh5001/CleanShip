"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Keeps a server-rendered client view fresh.
 *
 * `router.refresh()` re-runs the server component and swaps in new HTML
 * without losing scroll position — so a client watching a job sees holds turn
 * green while they read, without a full reload and without this component
 * needing to know anything about the job's shape.
 *
 * Paused while the tab is hidden: a client leaving the page open overnight
 * should not poll 3,000 times before morning.
 */
export function LiveRefresh({ intervalMs = 15_000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [live, setLive] = useState(true);

  useEffect(() => {
    const onVisibility = () => {
      const visible = document.visibilityState === "visible";
      setLive(visible);
      if (visible) router.refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [router]);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(t);
  }, [live, intervalMs, router]);

  return (
    <p className="flex items-center gap-2 text-[13px] text-slate-500">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      Live — updates as the crew works
    </p>
  );
}

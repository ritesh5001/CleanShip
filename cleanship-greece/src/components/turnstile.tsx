"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Cloudflare Turnstile, the CAPTCHA on every public form.
 *
 * Rendered inside a <form>, the widget adds a hidden `cf-turnstile-response`
 * input that the server action checks with `verifyTurnstile` (lib/turnstile).
 *
 * A token is single-use, so after a submission comes back with an error the
 * widget has to issue a new one or the corrected resubmit fails. Pass the
 * action state as `resetKey` and it does that whenever the state changes.
 *
 * With no site key configured it renders nothing, and the server skips the
 * check to match — see lib/turnstile.
 */
export function Turnstile({
  theme = "light",
  resetKey,
  className,
}: {
  theme?: "light" | "dark" | "auto";
  resetKey?: unknown;
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(
    () => typeof window !== "undefined" && !!window.turnstile,
  );

  useEffect(() => {
    if (!SITE_KEY || !ready || !container.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: SITE_KEY,
      theme,
      size: "flexible",
    });
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [ready, theme]);

  useEffect(() => {
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetKey]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={container} className={className} />
    </>
  );
}

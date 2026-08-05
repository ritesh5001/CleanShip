"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix?: string; label: string };

/**
 * Count-up statistics band.
 *
 * The final value is rendered into the HTML first and only animated once the
 * band scrolls into view, so the real numbers are always present for crawlers
 * and for anyone with JavaScript disabled.
 */
export function StatsBand({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/8 lg:grid-cols-4"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="bg-abyss-900/80 px-6 py-8 text-center">
          <div className="font-display text-4xl font-semibold text-white lg:text-5xl">
            <CountUp target={stat.value} run={started} />
            <span className="text-aqua-400">{stat.suffix}</span>
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-abyss-400">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function CountUp({ target, run }: { target: number; run: boolean }) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!run) return;

    // Respect reduced motion — jump straight to the final value.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setValue(target);
      return;
    }

    const duration = 1600;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic so the number decelerates into place.
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    setValue(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, target]);

  return <>{value.toLocaleString("en-US")}</>;
}

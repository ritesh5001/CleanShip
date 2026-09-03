"use client";

import { useEffect, useRef } from "react";
import { EASE, gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";

registerGsap();

/**
 * Counter that ticks up when scrolled into view.
 *
 * The final value is rendered as the element's text on the server, so the real
 * number is in the HTML and visible without JS. The animation only overwrites
 * that text once it is on screen, then leaves the true value in place.
 */
export function CountUp({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration: 1.4,
        ease: EASE.out,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = Math.round(counter.n).toLocaleString("en-US");
        },
        // Guarantee the exact final value even if the tween is interrupted.
        onComplete: () => {
          el.textContent = value.toLocaleString("en-US");
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [value]);

  return (
    <span className={className}>
      <span ref={ref}>{value.toLocaleString("en-US")}</span>
      {suffix}
    </span>
  );
}

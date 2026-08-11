"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger, gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";

registerGsap();

/**
 * Scroll-linked progress rail.
 *
 * `scrub: true` ties the tween directly to scroll position rather than to a
 * clock, so it tracks the finger/wheel exactly and never plays on its own.
 */
export function ScrollProgress({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return <div ref={ref} className={`progress-rail ${className}`} />;
}

/**
 * Vertical parallax. Displacement is capped deliberately low — large parallax
 * is the most common trigger for motion sickness, and this audience is not
 * here to be impressed by drift.
 */
export function Parallax({
  children,
  distance = 40,
  className = "",
}: {
  children: ReactNode;
  /** Total travel in px across the whole scroll range. Keep under ~60. */
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: distance / 2 },
        {
          y: -distance / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Refreshes ScrollTrigger after an App Router navigation.
 *
 * ScrollTrigger caches document height on creation. After a client-side route
 * change those measurements describe the previous page, which makes triggers
 * fire at visibly wrong scroll positions. Mounted once in the layout.
 */
export function ScrollTriggerRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    // Wait a frame so the new route has laid out before we re-measure.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}

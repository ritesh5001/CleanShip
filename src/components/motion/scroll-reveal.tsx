"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  DUR,
  EASE,
  STAGGER,
  gsap,
  prefersReducedMotion,
  registerGsap,
} from "@/lib/motion";

registerGsap();

type Direction = "up" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 26 },
  left: { x: -26 },
  right: { x: 26 },
  none: {},
};

/**
 * Scroll reveal for a single block.
 *
 * Uses `gsap.from()`, so the element's resting state is what ships in the HTML
 * — nothing is hidden server-side. See lib/motion.ts for why that matters.
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
  /** Set on the LCP element so its entrance is never animated. */
  immediate = false,
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || immediate || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        ...OFFSET[direction],
        opacity: 0,
        duration: DUR.reveal,
        delay,
        ease: EASE.out,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, ref);

    return () => ctx.revert();
  }, [direction, delay, immediate]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Staggered reveal for a group of siblings. Children are selected by
 * `[data-stagger]` so the wrapper stays agnostic about markup.
 */
export function StaggerGroup({
  children,
  className = "",
  step = STAGGER,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const items = el.querySelectorAll("[data-stagger]");
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        y: 24,
        opacity: 0,
        duration: DUR.reveal,
        ease: EASE.out,
        stagger: step,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, ref);

    return () => ctx.revert();
  }, [step]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * On-mount timeline for above-the-fold content, staggering `[data-mount]`
 * children.
 *
 * Deliberately has no ScrollTrigger: hero content is already in view, so
 * waiting for a scroll event would just delay it.
 *
 * IMPORTANT: never mark the `<h1>` with `data-mount`. The hero heading is this
 * site's LCP element, and animating its entrance sets LCP to at least the
 * animation duration — the most common self-inflicted Core Web Vitals
 * regression there is. Animate what surrounds it instead.
 */
export function MountTimeline({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const items = el.querySelectorAll("[data-mount]");
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        y: 18,
        opacity: 0,
        duration: 0.55,
        ease: EASE.out,
        stagger: 0.07,
        delay: 0.05,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Line-by-line heading reveal.
 *
 * Splits on an explicit `|` in the text rather than measuring line boxes, so
 * the break points are authored and never depend on the font having loaded.
 * The markup stays a single heading element for the accessibility tree.
 */
export function SplitHeading({
  text,
  className = "",
  as: Tag = "h2",
}: {
  /** Use `|` to mark a line break. */
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lines = text.split("|").map((l) => l.trim());

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-line] > span"), {
        yPercent: 108,
        duration: 0.72,
        ease: EASE.out,
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        // The clip is on the outer span; the inner span is what travels.
        <span key={i} data-line className="block overflow-hidden">
          <span className="block">{line}</span>
        </span>
      ))}
    </Tag>
  );
}

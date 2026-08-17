"use client";

import { useRef, type ReactNode } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

/**
 * Magnetic hover — the element drifts a few pixels toward the cursor.
 *
 * `LazyMotion` + `domAnimation` keeps this at roughly 20KB instead of the
 * ~110KB full Motion bundle; `strict` makes a stray `motion.*` import throw
 * rather than silently pulling the heavy build back in.
 *
 * Pointer-driven only, so it is inert on touch devices — no behaviour is
 * gated behind it, it is pure decoration on top of a normal link.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className = "",
}: {
  children: ReactNode;
  /** Fraction of the cursor offset applied. Above ~0.4 feels slippery. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Spring here is for cursor tracking, not entrance — it damps jitter rather
  // than adding bounce.
  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  if (reduced) return <span className={className}>{children}</span>;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <m.span
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ x: sx, y: sy, display: "inline-block" }}
        className={className}
      >
        {children}
      </m.span>
    </LazyMotion>
  );
}

/**
 * Hover-lift wrapper for cards. Kept in Motion rather than CSS so the exit is
 * damped instead of snapping back when the pointer leaves quickly.
 */
export function HoverLift({
  children,
  className = "",
  lift = -4,
}: {
  children: ReactNode;
  className?: string;
  lift?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        whileHover={{ y: lift }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

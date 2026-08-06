/**
 * Shared motion constants and GSAP registration.
 *
 * WHY GSAP DOES THE SCROLL REVEALS AND MOTION DOES THE INTERACTIONS
 * ----------------------------------------------------------------
 * Motion (Framer Motion) renders its `initial` prop into the server HTML as an
 * inline style. A `<m.div initial={{ opacity: 0 }}>` therefore ships
 * `style="opacity:0"` in the SSR output — content that is invisible until JS
 * runs and an IntersectionObserver fires. With SEO as this site's first
 * priority that is an unacceptable default for body content.
 *
 * `gsap.from()` has the opposite behaviour: it reads the element's rendered
 * state at runtime and animates *from* an offset. Nothing is written into the
 * HTML. Disable JS and every word is still there, fully styled.
 *
 * So the split is deliberate, not stylistic:
 *   · GSAP + ScrollTrigger → anything that reveals indexable content
 *   · Motion               → menus, drawers, accordions, hover and gestures,
 *                            where the initial state hides nothing a crawler
 *                            needs
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registers ScrollTrigger exactly once, on the client only. */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/** True when the user has asked for reduced motion. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Durations mirror the design system's motion tokens (seconds for GSAP). */
export const DUR = {
  fast: 0.14,
  base: 0.22,
  slow: 0.4,
  reveal: 0.62,
  photo: 0.7,
} as const;

/**
 * Easing. `out` is the design system's --ease-out-ds; nothing overshoots,
 * because bounce reads as toy-like to a technical audience.
 */
export const EASE = {
  standard: "power2.inOut",
  out: "power3.out",
  soft: "power1.out",
} as const;

/** Stagger step for grids and lists — 50ms per the Material guidance. */
export const STAGGER = 0.05;

export { gsap, ScrollTrigger };

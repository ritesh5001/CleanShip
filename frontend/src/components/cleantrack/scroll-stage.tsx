"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The scroll choreography.
 *
 * Two pieces, deliberately small: a pinned stage that turns scroll distance
 * into a 0-1 number, and a reveal that brings a block in as it arrives.
 *
 * GSAP is loaded lazily inside an effect. It is only ever needed by a visitor
 * who can see motion on a machine that can render the ship, and a page whose
 * job is "is my vessel ready" should not spend its first paint fetching an
 * animation library.
 *
 * Reduced motion is honoured by not animating at all: the stage un-pins, the
 * camera sits at its resting shot, and every reveal starts visible. That is a
 * complete page, not a degraded one — someone who asked for less movement
 * still gets every number.
 */

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

/**
 * Pins its children and reports scroll progress through them.
 *
 * `heightVh` is how much scroll the pin consumes. Long enough that the flight
 * reads as deliberate, short enough that nobody feels trapped: a visitor who
 * wants the table should reach it in about two flicks.
 */
export function ScrollStage({
  children,
  heightVh = 260,
  onProgress,
}: {
  children: ReactNode;
  heightVh?: number;
  onProgress: (t: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReduced(true);
      /* Park the camera at its composed resting frame, the same one the
         flight ends on, so a still page is still a designed one. */
      progressRef.current(1);
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !wrapRef.current || !pinRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const trigger = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        pinSpacing: false,
        /* Smoothed rather than raw: a trackpad flick delivers scroll in
           lumps, and feeding those straight to a camera looks like stutter
           rather than flight. */
        scrub: 0.6,
        onUpdate: (self) => progressRef.current(self.progress),
      });

      cleanup = () => trigger.kill();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  if (reduced) return <div>{children}</div>;

  return (
    <div ref={wrapRef} style={{ height: `${heightVh}vh` }}>
      <div ref={pinRef} className="h-dvh w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/**
 * Brings a block in as it arrives.
 *
 * One entrance, used everywhere, because a page where every section enters
 * differently reads as a demo reel. The stagger is what makes a row of
 * figures feel composed rather than dumped.
 */
export function Reveal({
  children,
  className = "",
  stagger = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Delays this block behind its siblings, in seconds. */
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReduced(true);
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.fromTo(
        ref.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: stagger,
          /* Ease-out on entry: fast in, settling slowly, which is what makes
             an arrival feel like it lands rather than slides. */
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            /* Fires while the block is still below the fold, so it has
               finished arriving by the time it is being read. */
            start: "top 88%",
            once: true,
          },
        },
      );

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [stagger]);

  return (
    <div
      ref={ref}
      className={className}
      /* Starts hidden only when motion is allowed. Otherwise the content
         would depend on JavaScript to ever become visible, which is a blank
         page for anyone whose bundle fails. */
      style={reduced ? undefined : { opacity: 0 }}
    >
      {children}
    </div>
  );
}

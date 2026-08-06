"use client";

import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import {
  DUR,
  EASE,
  ScrollTrigger,
  gsap,
  prefersReducedMotion,
  registerGsap,
} from "@/lib/motion";

registerGsap();

type ScopeItem = { title: string; body: string };

/**
 * Scroll-scrubbed scope walkthrough for service pages.
 *
 * GSAP owns the scroll relationship: a rail that scrubs with scroll position
 * and a per-row trigger that reports which step is active. Motion owns the
 * resulting state change, so the active row's transition is damped rather
 * than stepping.
 *
 * Every row's text is plain server-rendered markup — the animation only moves
 * and tints it. Nothing here decides whether content exists.
 */
export function ScopeScroller({ items }: { items: ScopeItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Rail scrubs across the section's full scroll range.
      if (rail.current) {
        gsap.fromTo(
          rail.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 60%",
              end: "bottom 75%",
              scrub: true,
            },
          },
        );
      }

      // Rows enter once, then report active state on the way past.
      const rows = gsap.utils.toArray<HTMLElement>("[data-scope-row]", el);
      rows.forEach((row, i) => {
        gsap.from(row, {
          x: 22,
          opacity: 0,
          duration: DUR.reveal,
          ease: EASE.out,
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        });

        ScrollTrigger.create({
          trigger: row,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, root);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={root} className="mt-10 flex gap-6 sm:gap-10">
        {/* Rail — decorative, so hidden from assistive tech */}
        <div
          aria-hidden="true"
          className="relative hidden w-px shrink-0 bg-line-200 sm:block"
        >
          <div
            ref={rail}
            className="absolute inset-0 origin-top bg-aqua-500"
            style={{ transform: reduced ? "scaleY(1)" : undefined }}
          />
        </div>

        <ol className="min-w-0 flex-1">
          {items.map((item, i) => {
            const isActive = !reduced && i === active;
            return (
              <li
                key={item.title}
                data-scope-row
                className="border-b border-line-200 py-7 first:pt-0"
              >
                <div className="flex gap-5 sm:gap-7">
                  <m.span
                    animate={{
                      color: isActive ? "#00929b" : "#8a9aa8",
                      scale: isActive ? 1.06 : 1,
                    }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: "left center" }}
                    className="num-index shrink-0 pt-1 text-[22px] sm:text-[30px]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </m.span>

                  <div className="min-w-0">
                    <h3 className="text-h3 font-display font-semibold uppercase text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 max-w-[70ch] text-[15px] leading-[1.62] text-slate-600">
                      {item.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </LazyMotion>
  );
}

/**
 * Delivery-process timeline. Cards rise in sequence and the connecting rule
 * draws itself across them as the group enters.
 */
export function ProcessTimeline({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-step]", {
        y: 30,
        opacity: 0,
        duration: DUR.reveal,
        ease: EASE.out,
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 84%", once: true },
      });

      gsap.from("[data-step-rule]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.5,
        ease: EASE.out,
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 84%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <ol className="grid gap-6 sm:grid-cols-2">
        {steps.map((step, i) => (
          <li key={step.title} data-step className="bg-paper p-6">
            <span
              data-step-rule
              className="block h-[3px] w-full bg-aqua-500"
              aria-hidden="true"
            />
            <span className="num-index mt-5 block text-[13px] text-blue-600">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-display text-[18px] font-semibold uppercase leading-tight text-ink-900">
              {step.title}
            </h3>
            <p className="mt-2 text-[15px] leading-[1.62] text-slate-600">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/blog";

/**
 * The "Contents" rail: sticky beside the article on desktop, a collapsible
 * block above it on mobile. The section being read is highlighted as the
 * reader scrolls — the heading nearest the top of the viewport wins.
 *
 * The links are plain #anchors, so they work with JavaScript off and a shared
 * /blog/post#section link lands on the right heading.
 */
export function Toc({ items, variant }: { items: TocItem[]; variant: "rail" | "inline" }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (variant !== "rail" || items.length === 0) return;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const onScroll = () => {
      /* A heading counts as "being read" once it passes the top third of the
         viewport — so a jump to #section highlights that section, not the one
         before it. */
      const line = Math.max(200, window.innerHeight * 0.33);
      let current: string | null = null;
      for (const el of headings) {
        if (el.getBoundingClientRect().top - line <= 0) current = el.id;
        else break;
      }
      setActive(current ?? headings[0]?.id ?? null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items, variant]);

  if (items.length === 0) return null;

  const list = (
    <ul className="mt-3 space-y-0.5">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <li key={item.id} className={item.level === 3 ? "ml-3 border-l border-line-200 pl-3" : ""}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`-ml-px block border-l-2 py-1.5 pl-3 text-[14px] leading-snug transition-colors duration-[140ms] ${
                isActive
                  ? "border-blue-600 font-medium text-blue-600"
                  : "border-transparent text-slate-600 hover:text-ink-900"
              } ${item.level === 3 ? "text-[13.5px]" : ""}`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "inline") {
    return (
      <details className="border border-line-200 bg-[#f7f9fb] p-4 lg:hidden">
        <summary className="cursor-pointer text-[15px] font-semibold text-ink-900">Contents</summary>
        {list}
      </details>
    );
  }

  return (
    <nav aria-label="Contents" className="max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
      <p className="text-[15px] font-semibold text-ink-900">Contents</p>
      {list}
    </nav>
  );
}

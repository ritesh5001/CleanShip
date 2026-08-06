import type { ReactNode } from "react";
import { Breadcrumbs } from "./ui";

/**
 * Interior page banner — a navy plate carrying the breadcrumb trail, the H1
 * and a lead paragraph. One component so every inner page shares an identical
 * heading structure, which matters for both SEO and screen readers.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  trail,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  trail: { name: string; path: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="on-navy bg-navy-900">
      <div className="container-page py-12 lg:py-16">
        <Breadcrumbs trail={trail} onNavy />

        <div className="mt-8 max-w-4xl">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-5 text-[clamp(34px,5.6vw,60px)] leading-[1.04] text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-[62ch] text-[18px] leading-[1.62] text-white/72">
              {description}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}

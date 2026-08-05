import type { ReactNode } from "react";
import { Breadcrumbs } from "./ui";

/**
 * Shared banner for interior pages: ambient background, breadcrumb trail,
 * H1 and a lead paragraph. Keeping it in one component means every inner page
 * has an identical heading structure, which matters for both SEO and a11y.
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
    <section className="relative isolate overflow-hidden pb-16 pt-12 lg:pb-20 lg:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(100%_80%_at_70%_0%,#0c514e_0%,#0a1e31_50%,#04121f_100%)]" />
        <div className="grid-lines mask-fade absolute inset-0 opacity-50" />
        <div className="absolute -right-32 -top-24 size-[30rem] rounded-full bg-aqua-500/12 blur-[110px]" />
      </div>

      <div className="container-page">
        <Breadcrumbs trail={trail} />

        <div className="mt-8 max-w-4xl">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-4 font-display text-4xl leading-[1.1] text-white sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-abyss-200 sm:text-lg">
              {description}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}

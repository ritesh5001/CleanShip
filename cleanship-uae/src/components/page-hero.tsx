import Link from "next/link";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lead,
  trail,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  trail: { name: string; path: string }[];
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="on-navy relative isolate overflow-hidden bg-navy-900">
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative backdrop */}
          <img src={image} alt="" className="absolute inset-0 -z-20 size-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 -z-10" style={{ background: "var(--scrim-navy-left)" }} />
        </>
      )}
      <div className="container-page py-16 lg:py-24">
        <nav aria-label="Breadcrumb" className="text-[13px] text-white/60">
          <ol className="flex flex-wrap gap-x-2">
            {trail.map((t, i) => (
              <li key={t.path} className="flex gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === trail.length - 1 ? (
                  <span className="text-aqua-200">{t.name}</span>
                ) : (
                  <Link href={t.path} className="hover:text-white">
                    {t.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
        <h1 className="text-h1 mt-5 max-w-4xl">{title}</h1>
        {lead && <p className="text-lead mt-6 max-w-2xl text-white/80">{lead}</p>}
        {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

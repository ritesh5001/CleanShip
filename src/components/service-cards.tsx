import Link from "next/link";
import type { Service, ServiceCategory } from "@/lib/services";
import { ArrowIcon, CategoryIcon } from "./icons";
import { Reveal } from "./reveal";

/** Large card representing a whole service category. */
export function CategoryCard({
  category,
  index = 0,
}: {
  category: ServiceCategory;
  index?: number;
}) {
  return (
    <Reveal delay={index * 80} className="h-full">
      <Link
        href={`/services/${category.slug}`}
        className="card-hover group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-abyss-900/60 p-7 backdrop-blur-sm"
      >
        {/* Glow that follows the card on hover */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-aqua-500/0 blur-3xl transition-all duration-500 group-hover:bg-aqua-500/20" />

        <div className="relative flex items-start justify-between">
          <span className="flex size-13 items-center justify-center rounded-2xl bg-aqua-400/10 text-aqua-300 ring-1 ring-aqua-400/20 transition group-hover:bg-aqua-400/20">
            <CategoryIcon name={category.icon} className="size-6.5" />
          </span>
          <span className="font-display text-sm font-medium text-abyss-600">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="relative mt-6 text-xl text-white transition group-hover:text-aqua-300">
          {category.name}
        </h3>
        <p className="relative mt-3 flex-1 text-sm leading-relaxed text-abyss-300">
          {category.summary}
        </p>

        <ul className="relative mt-5 space-y-1.5 border-t border-white/8 pt-5">
          {category.services.slice(0, 3).map((service) => (
            <li
              key={service.slug}
              className="flex items-center gap-2 text-[13px] text-abyss-400"
            >
              <span className="size-1 rounded-full bg-aqua-400/70" />
              {service.name}
            </li>
          ))}
          {category.services.length > 3 && (
            <li className="pl-3 text-[13px] text-abyss-500">
              + {category.services.length - 3} more
            </li>
          )}
        </ul>

        <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-aqua-300">
          Explore
          <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    </Reveal>
  );
}

/** Compact card for an individual service within a category. */
export function ServiceCard({
  service,
  categorySlug,
  index = 0,
}: {
  service: Service;
  categorySlug: string;
  index?: number;
}) {
  return (
    <Reveal delay={index * 70} className="h-full">
      <Link
        href={`/services/${categorySlug}/${service.slug}`}
        className="card-hover group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      >
        <h3 className="text-lg leading-snug text-white transition group-hover:text-aqua-300">
          {service.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-aqua-400/90">
          {service.tagline}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-abyss-300">
          {service.summary}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-aqua-300">
          Read more
          <ArrowIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    </Reveal>
  );
}

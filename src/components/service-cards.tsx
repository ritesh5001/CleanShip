import Link from "next/link";
import type { Service, ServiceCategory } from "@/lib/services";
import { ArrowIcon, CategoryIcon } from "./icons";
import { Reveal } from "./reveal";

/**
 * Cards follow the DS card spec: white, 1px cool border, 2px radius, 24px
 * padding and **no resting shadow**. Shadow and a -2px lift arrive only on
 * hover, because in this system elevation signals interaction rather than
 * hierarchy — hierarchy comes from borders and fills.
 */

export function CategoryCard({
  category,
  index = 0,
}: {
  category: ServiceCategory;
  index?: number;
}) {
  return (
    <Reveal delay={index * 60} className="h-full">
      <Link
        href={`/services/${category.slug}`}
        className="card card-interactive group flex h-full flex-col p-6"
      >
        <div className="flex items-start justify-between">
          <span className="flex size-12 items-center justify-center bg-blue-50 text-blue-600 transition-colors duration-[220ms] group-hover:bg-blue-100">
            <CategoryIcon name={category.icon} className="size-[26px]" />
          </span>
          <span className="tabular text-[13px] text-slate-400 transition-colors duration-[140ms] group-hover:text-aqua-500">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-6 font-display text-[22px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
          {category.name}
        </h3>

        <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-slate-600">
          {category.summary}
        </p>

        <ul className="mt-5 space-y-2 border-t border-line-100 pt-5">
          {category.services.slice(0, 3).map((service) => (
            <li
              key={service.slug}
              className="flex items-center gap-2.5 text-[13px] text-slate-500"
            >
              <span className="size-1 shrink-0 bg-aqua-500" />
              {service.name}
            </li>
          ))}
          {category.services.length > 3 && (
            <li className="pl-3.5 text-[13px] text-slate-400">
              + {category.services.length - 3} more
            </li>
          )}
        </ul>

        <span className="label-caps mt-6 inline-flex items-center gap-2 text-blue-600">
          Read more
          <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
        </span>
      </Link>
    </Reveal>
  );
}

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
    <Reveal delay={index * 50} className="h-full">
      <Link
        href={`/services/${categorySlug}/${service.slug}`}
        className="card card-interactive group flex h-full flex-col p-6"
      >
        <span className="tabular text-[13px] text-slate-400 transition-colors duration-[140ms] group-hover:text-aqua-500">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="mt-3 font-display text-[20px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
          {service.name}
        </h3>

        <p className="mt-2 text-[13px] font-medium text-blue-600">
          {service.tagline}
        </p>

        <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-slate-600">
          {service.summary}
        </p>

        <span className="label-caps mt-6 inline-flex items-center gap-2 text-blue-600">
          Read more
          <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
        </span>
      </Link>
    </Reveal>
  );
}

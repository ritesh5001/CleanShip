import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { ArrowIcon, CategoryIcon } from "@/components/icons";
import { serviceCategories, totalServiceCount } from "@/lib/services";
import { BASE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Marine Services — Hold, Tank, Hull, Offshore & NDT",
  description:
    "Explore Cleanship's full marine service range: cargo hold cleaning, tank cleaning, underwater hull cleaning and propeller polishing, offshore support, and NDT inspection with repair, hydroblasting and painting.",
  path: "/services",
  keywords: [
    "marine services UAE",
    "ship cleaning services",
    "hold and tank cleaning company",
    "underwater services vessel",
  ],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Cleanship marine services",
            numberOfItems: totalServiceCount,
            itemListElement: serviceCategories.flatMap((category, ci) =>
              category.services.map((service, si) => ({
                "@type": "ListItem",
                position: ci * 10 + si + 1,
                name: service.name,
                url: `${BASE_URL}/services/${category.slug}/${service.slug}`,
              })),
            ),
          },
        ]}
      />

      <PageHero
        eyebrow="Our Services"
        title="Comprehensive marine solutions"
        description={`${totalServiceCount} distinct scopes across five service lines — covering a vessel from the tank top to the propeller boss, and the inspection and repair work that follows.`}
        trail={trail}
      />

      {/* One band per category, alternating white / paper — the DS permits
          exactly two background colours per page. */}
      {serviceCategories.map((category, index) => (
        <section
          key={category.slug}
          id={category.slug}
          className={`scroll-mt-28 ${index % 2 === 1 ? "bg-paper" : "bg-white"}`}
        >
          <div className="container-page py-16 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <Reveal>
                  <div className="lg:sticky lg:top-28">
                    <span className="tabular text-[13px] text-blue-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="mt-4 flex size-14 items-center justify-center bg-blue-50 text-blue-600">
                      <CategoryIcon name={category.icon} className="size-7" />
                    </span>

                    <h2 className="mt-6 font-display text-[32px] font-bold uppercase leading-[1.08] text-ink-900">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-[14px] font-medium text-blue-600">
                      {category.tagline}
                    </p>
                    <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.62] text-slate-600">
                      {category.intro[0]}
                    </p>

                    <Link
                      href={`/services/${category.slug}`}
                      className="label-caps group mt-6 inline-flex items-center gap-2 text-blue-600"
                    >
                      {category.name} overview
                      <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  {category.services.map((service, i) => (
                    <Reveal key={service.slug} delay={i * 50} className="h-full">
                      <Link
                        href={`/services/${category.slug}/${service.slug}`}
                        className="card card-interactive group flex h-full flex-col p-6"
                      >
                        <span className="tabular text-[13px] text-slate-400 transition-colors duration-[140ms] group-hover:text-aqua-500">
                          {String(index + 1).padStart(2, "0")}.
                          {String(i + 1).padStart(2, "0")}
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}

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
        eyebrow="Our services"
        title="Comprehensive marine solutions"
        description={`${totalServiceCount} distinct scopes across five service lines — covering a vessel from the tank top to the propeller boss, and the inspection and repair work that follows.`}
        trail={trail}
      />

      {/* One section per category, each linking every child service */}
      <div className="pb-8">
        {serviceCategories.map((category, index) => (
          <section
            key={category.slug}
            id={category.slug}
            className={`scroll-mt-28 border-t border-white/8 py-16 lg:py-20 ${
              index % 2 === 1 ? "bg-abyss-900/30" : ""
            }`}
          >
            <div className="container-page">
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <Reveal>
                    <div className="lg:sticky lg:top-28">
                      <div className="flex items-center gap-4">
                        <span className="flex size-14 items-center justify-center rounded-2xl bg-aqua-400/10 text-aqua-300 ring-1 ring-aqua-400/20">
                          <CategoryIcon
                            name={category.icon}
                            className="size-7"
                          />
                        </span>
                        <span className="font-display text-sm text-abyss-600">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h2 className="mt-6 text-3xl text-white">
                        {category.name}
                      </h2>
                      <p className="mt-2 text-sm font-medium text-aqua-400">
                        {category.tagline}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-abyss-300">
                        {category.intro[0]}
                      </p>

                      <Link
                        href={`/services/${category.slug}`}
                        className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-aqua-300"
                      >
                        {category.name} overview
                        <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </Reveal>
                </div>

                <div className="lg:col-span-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {category.services.map((service, i) => (
                      <Reveal
                        key={service.slug}
                        delay={i * 70}
                        className="h-full"
                      >
                        <Link
                          href={`/services/${category.slug}/${service.slug}`}
                          className="card-hover group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                        >
                          <h3 className="text-lg leading-snug text-white transition group-hover:text-aqua-300">
                            {service.name}
                          </h3>
                          <p className="mt-2 text-[13px] font-medium text-aqua-400/90">
                            {service.tagline}
                          </p>
                          <p className="mt-3 flex-1 text-sm leading-relaxed text-abyss-300">
                            {service.summary}
                          </p>
                          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-aqua-300">
                            Read more
                            <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
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
      </div>

      <CtaBand />
    </>
  );
}

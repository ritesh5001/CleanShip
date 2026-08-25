import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { ArrowIcon } from "@/components/icons";
import { heroMediaFor } from "@/lib/service-media";
import { offices, siteConfig } from "@/lib/site";
import { BASE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";

/** Index for the per-office pages — the crawl path into the LocalBusiness set. */

export const metadata: Metadata = buildMetadata({
  title: "Our Offices & Operating Bases",
  description: `Cleanship Marine Services operates from ${offices.length} bases across the Middle East, South Asia and West Africa — crews and equipment held locally, not mobilised against a window.`,
  path: "/locations",
  keywords: [
    "marine services offices",
    "ship cleaning company bases",
    "diving contractor UAE India",
  ],
  image: {
    url: "/posters/underwater-hull-cleaning.jpg",
    alt: "Diver cleaning a vessel's underwater hull",
  },
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Locations", path: "/locations" },
];

const regionOrder = ["Middle East", "South Asia", "West Africa"] as const;

export default function LocationsIndexPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${siteConfig.legalName} operating bases`,
            numberOfItems: offices.length,
            itemListElement: offices.map((office, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${office.city}, ${office.country}`,
              url: `${BASE_URL}/locations/${office.slug}`,
            })),
          },
        ]}
      />

      <PageHero
        eyebrow="Where we are"
        title="Offices & Operating Bases"
        description={`${offices.length} bases across three regions. Where we hold a base, people and equipment are on the ground rather than in transit — which is the difference between meeting a berth window and missing it.`}
        trail={trail}
        media={heroMediaFor("hull-cleaning", "underwater-hull-cleaning")}
      />

      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          {regionOrder.map((region) => {
            const group = offices.filter((o) => o.region === region);
            if (group.length === 0) return null;
            return (
              <section key={region} className="mt-12 first:mt-0">
                <Reveal>
                  <h2 className="label-caps border-b border-line-200 pb-3 text-[12px] text-slate-500">
                    {region}
                    <span className="tabular ml-3 text-blue-600">
                      {String(group.length).padStart(2, "0")}
                    </span>
                  </h2>
                </Reveal>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((office, i) => (
                    <Reveal as="li" key={office.slug} delay={i * 40}>
                      <Link
                        href={`/locations/${office.slug}`}
                        className="card card-interactive group flex h-full flex-col p-6"
                      >
                        <h3 className="font-display text-[19px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                          {office.city}
                          {office.head && (
                            <span className="ml-2 text-[12px] font-normal normal-case text-blue-600">
                              Head office
                            </span>
                          )}
                        </h3>
                        <p className="mt-1 text-[13px] text-slate-500">
                          {office.country}
                        </p>
                        <p className="mt-3 flex-1 text-[14px] leading-[1.6] text-slate-600">
                          {office.role}
                        </p>
                        <span className="label-caps mt-5 inline-flex items-center gap-2 text-blue-600">
                          View base
                          <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>

      <CtaBand />
    </>
  );
}

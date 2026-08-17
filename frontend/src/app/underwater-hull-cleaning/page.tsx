import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Underwater Hull Cleaning | In-Water Fouling Removal",
  description:
    "Professional underwater hull cleaning by certified commercial divers. In-water fouling removal to restore speed and reduce fuel consumption.",
  path: "/underwater-hull-cleaning",
  keywords: [
    "underwater hull cleaning",
    "in water hull cleaning",
    "ship hull fouling removal",
    "brush cart hull cleaning",
  ],
  image: {
    url: "/posters/underwater-hull-cleaning.jpg",
    alt: "Diver cleaning a vessel's underwater hull",
  },
  canonicalPath: "/services/hull-cleaning/underwater-hull-cleaning",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Underwater Hull Cleaning", path: "/underwater-hull-cleaning" },
];

export default function UnderwaterHullCleaningPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Underwater Hull Cleaning",
            provider: {
              "@type": "Organization",
              name: "CleanShip Marine",
            },
            areaServed: {
              "@type": "Place",
              name: "UAE and International Ports",
            },
            serviceType: "Marine Services",
            description:
              "In-water hull cleaning by commercial divers to remove marine fouling and restore vessel efficiency",
          },
        ]}
      />

      <PageHero
        eyebrow="Hull Cleaning"
        title="Underwater Hull Cleaning"
        description="Full hull cleaned in the water — vessel stays on hire"
        trail={trail}
      />

      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="text-sm font-medium text-blue-600">THE SERVICE</p>
                <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-ink-900">
                  Full Hull Cleaning
                </h2>
                <p className="mt-4 text-sm text-slate-600">
                  Diver-operated brush cart and hand cleaning of the complete underwater hull, flat
                  bottom and vertical sides.
                </p>

                <Link
                  href="/services/hull-cleaning/underwater-hull-cleaning"
                  className="label-caps group mt-6 inline-flex items-center gap-2 text-blue-600"
                >
                  View full service details
                  <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Overview</h3>
                  <p className="mt-3 text-slate-600">
                    Hull fouling is the quietest cost on a vessel&apos;s P&L. A moderate layer of slime
                    and barnacle growth can add double-digit percentages to fuel consumption, and it
                    accumulates steadily between dry dockings without ever producing a defect report.
                  </p>
                  <p className="mt-3 text-slate-600">
                    Our commercial dive teams remove that fouling in the water, at anchorage or
                    alongside, without taking the vessel off hire. We clean the complete underwater
                    hull in the water — vertical sides, bilge keels, flat bottom, sea chests and
                    niche areas — using diver-operated brush carts for large flat areas and hand
                    tools for the geometry a cart cannot follow.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Highlights</h3>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">
                        Full hull: vertical sides, flat bottom, bilge keels and niches
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">
                        Brush hardness selected against the antifouling specification
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">
                        Sea chests, gratings and inlet areas cleared
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">
                        Before-and-after video and photographic records
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">
                        No off-hire — work runs alongside cargo operations
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Service Includes</h3>
                  <ul className="mt-4 space-y-2 text-slate-600">
                    <li>• Fouling survey and condition assessment</li>
                    <li>• Flat bottom and vertical sides cleaning</li>
                    <li>• Niche areas and sea chest clearance</li>
                    <li>• Documentation with underwater video and stills</li>
                    <li>• Permits, approvals and safety setup</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning at Sea | On-Passage Cargo Hold Cleaning",
  description:
    "Riding crew cargo hold cleaning services. Complete hold cleaning during sea passage to save port time.",
  path: "/hold-cleaning-at-sea",
  keywords: [
    "hold cleaning at sea",
    "riding crew hold cleaning",
    "on-passage hold cleaning",
    "ballast passage cleaning",
  ],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning at Sea", path: "/hold-cleaning-at-sea" },
];

export default function HoldCleaningAtSeaPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Hold Cleaning at Sea",
            provider: {
              "@type": "Organization",
              name: "CleanShip Marine",
            },
            areaServed: {
              "@type": "Place",
              name: "Global Shipping Routes",
            },
            serviceType: "Marine Hold Cleaning",
          },
        ]}
      />

      <PageHero
        eyebrow="Hold Cleaning"
        title="Hold Cleaning at Sea"
        description="Cleaning that happens while you are already earning — zero port time lost"
        trail={trail}
      />

      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="text-sm font-medium text-blue-600">THE SERVICE</p>
                <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-ink-900">
                  Riding Crew Cleaning
                </h2>
                <p className="mt-4 text-sm text-slate-600">
                  Certified teams that sail with the vessel and complete every hold on passage — zero
                  port time lost.
                </p>

                <Link
                  href="/services/hold-cleaning/riding-crew"
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
                    The most economical hold cleaning is the cleaning that costs you no port time at
                    all. Our riding crews join at the discharge port, sail with the vessel, and work
                    through the ballast passage so the holds are finished before the load port pilot is
                    even ordered.
                  </p>
                  <p className="mt-3 text-slate-600">
                    Riding crews carry full seafarer documentation, medicals and flag-state paperwork,
                    and integrate with the ship&apos;s safety management system from the moment they board.
                    They work under the master&apos;s authority and to the ship&apos;s permit-to-work regime
                    throughout.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Why Choose Sea Cleaning</h3>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">Vessel loses zero commercial time to cleaning</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">
                        Fully documented seafarers — STCW, medicals, visas, flag endorsements
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">Work continues in transit, weather permitting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">Holds arrive at load port ready for inspection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">
                        Crew can disembark at load port or continue for further voyages
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Service Scope</h3>
                  <ul className="mt-4 space-y-2 text-slate-600">
                    <li>• Team sizes from 4 to 20 depending on holds and passage length</li>
                    <li>• Complete hold preparation on passage</li>
                    <li>• Hatch cover and coaming work</li>
                    <li>• Bilge and drainage systems cleaning</li>
                    <li>• Additional deck work (chipping, priming) where passage allows</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">How It Works</h3>
                  <div className="mt-3 space-y-2 text-slate-600">
                    <p>
                      <strong>1. Documentation:</strong> We prepare crew documents, flag-state approvals
                      and visas well ahead so boarding is never the bottleneck.
                    </p>
                    <p>
                      <strong>2. Joining:</strong> The crew boards at discharge port and completes
                      familiarisation with the ship.
                    </p>
                    <p>
                      <strong>3. Passage work:</strong> Hold cleaning proceeds under the ship&apos;s
                      permit-to-work system throughout the voyage.
                    </p>
                    <p>
                      <strong>4. Arrival ready:</strong> Holds are complete and inspection-ready when
                      the vessel reaches load port.
                    </p>
                  </div>
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

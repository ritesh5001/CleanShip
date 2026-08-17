import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning at Port | Cargo Hold Cleaning Services",
  description:
    "Professional cargo hold cleaning services at port. Shore gangs mobilised to clean holds during port operations.",
  path: "/hold-cleaning-at-port",
  keywords: [
    "hold cleaning at port",
    "cargo hold cleaning port",
    "shore gang hold cleaning",
    "in-port hold cleaning",
  ],
  canonicalPath: "/services/hold-cleaning/shore-gang",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning at Port", path: "/hold-cleaning-at-port" },
];

export default function HoldCleaningAtPortPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Hold Cleaning at Port",
            provider: {
              "@type": "Organization",
              name: "CleanShip Marine",
            },
            areaServed: {
              "@type": "Place",
              name: "Global Ports",
            },
            serviceType: "Marine Hold Cleaning",
          },
        ]}
      />

      <PageHero
        eyebrow="Hold Cleaning"
        title="Hold Cleaning at Port"
        description="Cargo holds prepared during port operations — full crews, parallel working"
        trail={trail}
      />

      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="text-sm font-medium text-blue-600">THE SERVICE</p>
                <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-ink-900">
                  Shore Gang Cleaning
                </h2>
                <p className="mt-4 text-sm text-slate-600">
                  Large shore-based teams that clean every hold inside the port stay, between
                  discharge and next load.
                </p>

                <Link
                  href="/services/hold-cleaning/shore-gang"
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
                    When the schedule is tight and every hold has to be ready before the next fixture,
                    volume of labour is what wins. Our shore gangs put a full complement of trained
                    cleaners on board the moment the last grab lifts, so cleaning runs in parallel with
                    your other port operations rather than after them.
                  </p>
                  <p className="mt-3 text-slate-600">
                    Gang size is matched to the number of holds, the previous cargo and the hours
                    available. We bring our own high-pressure units, chemicals, lighting and safety
                    equipment, so nothing is drawn from the ship&apos;s stores or the crew&apos;s working hours.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Why Choose Port Cleaning</h3>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">Hold-ready status before next fixture</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">Full teams mobilised to your berth</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">Parallel with other port operations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">No crew overtime or overtime costs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-slate-600">Surveyor attendance and sign-off</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Our Port Cleaning Scope</h3>
                  <ul className="mt-4 space-y-2 text-slate-600">
                    <li>• Gangs scaled to the vessel — from 6 to 40+ cleaners</li>
                    <li>• Mobilisation at berth, anchorage or during STS operations</li>
                    <li>• Own equipment, chemicals, lighting and PPE</li>
                    <li>• Sweeping, washing, rinsing and drying in one sequence</li>
                    <li>• Hold inspection attended and defects rectified on the spot</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Standards Achieved</h3>
                  <p className="mt-3 text-slate-600">
                    Our hold cleaning teams prepare vessels to the standard your next fixture demands
                    — whether that is normal clean, grain clean, or the hospital-clean condition
                    required for sensitive cargoes.
                  </p>
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

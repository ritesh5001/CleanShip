import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Hold Tank Cleaning at Ruwais Port | CleanShip Marine",
  description:
    "Professional hold and tank cleaning services at Ruwais Port. Cargo hold cleaning, grain-clean preparation for bulk carriers and tankers.",
  path: "/hold-tank-cleaning-service-at-ruwais-port",
  keywords: [
    "hold cleaning Ruwais",
    "tank cleaning Ruwais Port",
    "cargo hold cleaning Ruwais",
    "Ruwais port cleaning services",
  ],
  canonicalPath: "/services/hold-cleaning/shore-gang",
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning at Ruwais", path: "/hold-tank-cleaning-service-at-ruwais-port" },
];

export default function RuwaisPortPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "CleanShip Marine — Hold Cleaning at Ruwais Port",
            description: "Hold and tank cleaning services at Ruwais Port, UAE",
            serviceArea: {
              "@type": "Place",
              name: "Ruwais, Abu Dhabi, UAE",
            },
            areaServed: "Ruwais Port",
            provider: {
              "@type": "Organization",
              name: "CleanShip Marine",
            },
          },
        ]}
      />

      <PageHero
        eyebrow="Port Services"
        title="Hold Cleaning at Ruwais Port"
        description="Grain-clean cargo holds, on schedule, first inspection at Ruwais"
        trail={trail}
      />

      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="text-sm font-medium text-blue-600">RUWAIS PORT</p>
                <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-ink-900">
                  Hold Cleaning
                </h2>
                <p className="mt-4 text-sm text-slate-600">
                  Full hold preparation at Ruwais port with shore gangs and riding crews mobilised for
                  rapid turnarounds.
                </p>

                <Link
                  href="/services/hold-cleaning"
                  className="label-caps group mt-6 inline-flex items-center gap-2 text-blue-600"
                >
                  View all hold cleaning services
                  <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Hold Cleaning at Ruwais</h3>
                  <p className="mt-3 text-slate-600">
                    Ruwais Port, serving the Abu Dhabi National Oil Company operations, handles significant
                    volumes of bulk cargo and petroleum products. CleanShip Marine provides hold and tank
                    cleaning services to vessels calling at Ruwais, whether preparing for next cargo discharge
                    or completing between-voyage maintenance.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Available Services</h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-blue-600">→</span>
                      <div>
                        <p className="font-semibold text-ink-900">Shore Gang Cleaning</p>
                        <p className="text-sm text-slate-600">Full crews at Ruwais berth for rapid port turnarounds</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-blue-600">→</span>
                      <div>
                        <p className="font-semibold text-ink-900">Riding Crew Cleaning</p>
                        <p className="text-sm text-slate-600">Sailing crews that clean holds en route</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-bold text-blue-600">→</span>
                      <div>
                        <p className="font-semibold text-ink-900">Rope Access Cleaning</p>
                        <p className="text-sm text-slate-600">
                          Full-height cleaning for deep holds and structural areas
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Cleanliness Standards</h3>
                  <p className="mt-3 text-slate-600">
                    We prepare cargo holds to the standard your next fixture demands:
                  </p>
                  <ul className="mt-2 space-y-2 text-slate-600">
                    <li>• Normal clean for general cargoes</li>
                    <li>• Grain clean for sensitive commodities</li>
                    <li>• Hospital clean for specialized cargoes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink-900">Quick Booking</h3>
                  <p className="mt-3 text-slate-600">
                    Contact our Ruwais team ahead of your port call to arrange hold cleaning that fits
                    your turnaround window. We can mobilise within hours of confirmation.
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

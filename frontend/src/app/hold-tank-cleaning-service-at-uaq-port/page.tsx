import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning at UAQ Port | Umm Al Quwain",
  description: "Professional hold and tank cleaning services at UAQ Port. Fast turnarounds for bulk carriers and tankers.",
  path: "/hold-tank-cleaning-service-at-uaq-port",
  alternates: {
    canonical: `${BASE_URL}/services/hold-cleaning/shore-gang`,
  },
  keywords: ["UAQ port cleaning", "Umm Al Quwain hold cleaning", "UAQ cargo hold cleaning"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning at UAQ", path: "/hold-tank-cleaning-service-at-uaq-port" },
];

export default function UAQPortPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero
        eyebrow="Port Services"
        title="Hold Cleaning at UAQ Port"
        description="Grain-clean holds at Umm Al Quwain — rapid mobilisation, first inspection"
        trail={trail}
      />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="text-sm font-medium text-blue-600">UAQ PORT</p>
                <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-ink-900">Hold Cleaning</h2>
                <p className="mt-4 text-sm text-slate-600">Full hold preparation at UAQ Port with mobilised shore gangs and riding crews.</p>
                <Link href="/services/hold-cleaning" className="label-caps group mt-6 inline-flex items-center gap-2 text-blue-600">
                  View all hold cleaning services
                </Link>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="space-y-8">
                <p className="text-slate-600">CleanShip Marine provides hold and tank cleaning services at UAQ Port in Umm Al Quwain. We mobilise shore gangs and riding crews for cargo hold preparation, whether for next discharge or between-voyage maintenance.</p>
                <h3 className="font-display text-xl font-bold text-ink-900">Services Available</h3>
                <ul className="mt-4 space-y-2 text-slate-600">
                  <li>• Shore gang cleaning for port operations</li>
                  <li>• Riding crew cleaning at sea</li>
                  <li>• Grain-clean and hospital-clean standards</li>
                  <li>• Fast turnarounds between fixtures</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cargo Hold Cleaning at Visakhapatnam (Vizag) Port",
  description: "Professional hold and tank cleaning at Vizag Port, India. Cargo hold cleaning for bulk carriers and container ships.",
  path: "/cargo-hold-cleaning-in-vizag-port",
  canonicalPath: "/services/hold-cleaning/shore-gang",
  keywords: ["Vizag port cleaning", "Visakhapatnam hold cleaning", "cargo hold cleaning India"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Cargo Hold Cleaning at Vizag", path: "/cargo-hold-cleaning-in-vizag-port" },
];

export default function VizagPortPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="India Services" title="Cargo Hold Cleaning at Vizag Port" description="Professional hold cleaning at Visakhapatnam (Vizag)" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Cargo Hold Cleaning at Visakhapatnam (Vizag) Port</h2>
            <p>CleanShip Marine provides professional hold and tank cleaning services at Visakhapatnam Port (Vizag), India&apos;s largest port by tonnage. Our teams are experienced in rapid turnarounds.</p>
            <h3>Services at Vizag</h3>
            <ul>
              <li>Shore gang cleaning for port operations</li>
              <li>Riding crew services for passage cleaning</li>
              <li>Grain-clean and hospital-clean standards</li>
              <li>Fast turnarounds for bulk and container vessels</li>
            </ul>
            <h3>About Vizag Port</h3>
            <p>Visakhapatnam Port is India&apos;s largest general cargo port, handling significant volumes of iron ore, coal, containerized cargo and other commodities.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

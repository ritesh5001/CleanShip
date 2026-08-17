import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning at Port Rashid, Dubai",
  description: "Professional hold cleaning services at Port Rashid. Cargo hold cleaning for rapid turnarounds.",
  path: "/hold-tank-cleaning-service-at-rashid-port",
  canonicalPath: "/services/hold-cleaning/shore-gang",
  keywords: ["Port Rashid cleaning", "Rashid port hold cleaning", "Dubai hold cleaning"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning at Port Rashid", path: "/hold-tank-cleaning-service-at-rashid-port" },
];

export default function RashidPortPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="Port Services" title="Hold Cleaning at Port Rashid" description="Professional hold cleaning at Dubai's Port Rashid" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Hold Cleaning at Port Rashid, Dubai</h2>
            <p>CleanShip Marine provides hold and tank cleaning services at Port Rashid in Dubai. Our teams mobilise rapidly for between-cargo hold cleaning and preparation.</p>
            <h3>Services</h3>
            <ul>
              <li>Shore gang cleaning at Port Rashid berths</li>
              <li>Riding crew cleaning at sea</li>
              <li>Grain-clean and special cleanliness standards</li>
              <li>Rapid scheduling for tight turnarounds</li>
            </ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

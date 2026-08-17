import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning at Ras Al Khaimah Port",
  description: "Hold and tank cleaning services at RAK Port. Professional cargo hold cleaning for bulk carriers and tankers.",
  path: "/hold-tank-cleaning-service-at-ras-ai-khaimah-port",
  canonicalPath: "/services/hold-cleaning/shore-gang",
  keywords: ["RAK port cleaning", "Ras Al Khaimah hold cleaning"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning at RAK Port", path: "/hold-tank-cleaning-service-at-ras-ai-khaimah-port" },
];

export default function RAKPortPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="Port Services" title="Hold Cleaning at Ras Al Khaimah Port" description="Cargo hold cleaning at RAK Port — grain-clean and inspection-ready" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Hold Cleaning at Ras Al Khaimah</h2>
            <p>CleanShip Marine provides professional hold and tank cleaning services at Ras Al Khaimah Port. Our shore gangs and riding crews prepare cargo holds for next fixtures or between-voyage cleaning with rapid mobilisation and professional standards.</p>
            <h3>Our Services</h3>
            <ul>
              <li>Shore gang cleaning for port turnarounds</li>
              <li>Riding crew cleaning during sea passage</li>
              <li>Grain-clean and hospital-clean standards</li>
              <li>Quick mobilisation and scheduling</li>
            </ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

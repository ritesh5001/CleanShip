import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning at Mina Saqr Port",
  description: "Hold and tank cleaning services at Mina Saqr Port, Ras Al Khaimah. Professional cargo hold cleaning.",
  path: "/hold-tank-cleaning-service-at-mina-saqr-port",
  alternates: {
    canonical: `${BASE_URL}/services/hold-cleaning/shore-gang`,
  },
  keywords: ["Mina Saqr cleaning", "Mina Saqr port hold cleaning"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning at Mina Saqr", path: "/hold-tank-cleaning-service-at-mina-saqr-port" },
];

export default function MinaSaqrPortPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="Port Services" title="Hold Cleaning at Mina Saqr Port" description="Professional cargo hold cleaning at Mina Saqr, RAK" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Hold Cleaning at Mina Saqr</h2>
            <p>CleanShip Marine provides hold and tank cleaning services at Mina Saqr Port in Ras Al Khaimah. We mobilise experienced shore gangs and riding crews for rapid cargo hold preparation.</p>
            <h3>Available Services</h3>
            <ul>
              <li>Shore gang mobilisation for port operations</li>
              <li>Riding crew cleaning during passage</li>
              <li>All cleanliness standards: normal, grain-clean, hospital-clean</li>
              <li>Quick turnaround scheduling</li>
            </ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning at Jebel Ali Port, Dubai",
  description: "Hold and tank cleaning services at Jebel Ali Port. Professional cargo preparation for container ships and bulk carriers.",
  path: "/hold-tank-cleaning-service-at-jebel-ali-port",
  alternates: {
    canonical: `${BASE_URL}/services/hold-cleaning/shore-gang`,
  },
  keywords: ["Jebel Ali port cleaning", "JAFZA hold cleaning", "Dubai cargo hold cleaning"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning at Jebel Ali", path: "/hold-tank-cleaning-service-at-jebel-ali-port" },
];

export default function JebelAliPortPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="Port Services" title="Hold Cleaning at Jebel Ali Port" description="Cargo hold cleaning at Jebel Ali, Dubai's largest port" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Hold Cleaning at Jebel Ali Port</h2>
            <p>CleanShip Marine provides hold cleaning services at Jebel Ali Port, Dubai's major international cargo hub. We mobilise shore gangs and riding crews for fast turnarounds.</p>
            <h3>Available Services</h3>
            <ul>
              <li>Shore gang mobilisation for rapid port cleaning</li>
              <li>Riding crew services for sea passage cleaning</li>
              <li>All cleanliness standards: normal, grain-clean, hospital-clean</li>
              <li>Experienced teams familiar with Jebel Ali operations</li>
            </ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

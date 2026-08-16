import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ship Hold Cleaning at Kandla Port, India",
  description: "Professional ship hold cleaning at Kandla Port. Cargo hold and tank cleaning for bulk carriers and tankers.",
  path: "/ship-hold-cleaning-in-kandla-port",
  alternates: {
    canonical: `${BASE_URL}/services/hold-cleaning/shore-gang`,
  },
  keywords: ["Kandla port cleaning", "ship hold cleaning India", "Kandla cargo cleaning"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Ship Hold Cleaning at Kandla", path: "/ship-hold-cleaning-in-kandla-port" },
];

export default function KandlaPortPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="India Services" title="Ship Hold Cleaning at Kandla Port" description="Professional hold cleaning at Kandla, India's largest port" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Ship Hold Cleaning at Kandla Port</h2>
            <p>CleanShip Marine provides professional ship hold and tank cleaning services at Kandla Port in Gujarat, India. We mobilise experienced teams for rapid cargo turnarounds.</p>
            <h3>Cleaning Services</h3>
            <ul>
              <li>Shore gang cleaning at Kandla Port berths</li>
              <li>Riding crew services for passage cleaning</li>
              <li>Grain-clean and special cleanliness standards</li>
              <li>Experienced teams for bulk commodity handling</li>
            </ul>
            <h3>About Kandla Port</h3>
            <p>Kandla Port is India's largest port by cargo throughput, handling significant volumes of bulk commodities including coal, iron ore, grain and petroleum products.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

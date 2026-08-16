import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning at Kakinada Port, India",
  description: "Professional hold and tank cleaning at Kakinada Port. Cargo hold preparation for bulk carriers.",
  path: "/hold-cleaning-in-kakinada-port",
  alternates: {
    canonical: `${BASE_URL}/services/hold-cleaning/shore-gang`,
  },
  keywords: ["Kakinada port cleaning", "hold cleaning India", "bulk cargo Kakinada"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning at Kakinada", path: "/hold-cleaning-in-kakinada-port" },
];

export default function KakinadaPortPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="India Services" title="Hold Cleaning at Kakinada Port" description="Professional hold cleaning at Kakinada, Andhra Pradesh" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Hold Cleaning Services at Kakinada Port</h2>
            <p>CleanShip Marine provides hold and tank cleaning services at Kakinada Port in Andhra Pradesh, India. Our teams are experienced with tropical port operations and cargo handling.</p>
            <h3>Services Available</h3>
            <ul>
              <li>Shore gang cleaning at Kakinada Port</li>
              <li>Riding crew cleaning during sea passage</li>
              <li>Grain-clean preparation for agricultural commodities</li>
              <li>Rapid mobilisation and turnarounds</li>
            </ul>
            <h3>About Kakinada</h3>
            <p>Kakinada Port is a major bulk cargo facility on India's east coast, handling significant volumes of agricultural products, minerals and other commodities.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

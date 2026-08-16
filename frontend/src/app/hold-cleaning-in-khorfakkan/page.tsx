import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning in Khorfakkan | Port Services",
  description: "Hold and tank cleaning in Khorfakkan. Professional cargo hold cleaning at Khorfakkan Port.",
  path: "/hold-cleaning-in-khorfakkan",
  alternates: {
    canonical: `${BASE_URL}/services/hold-cleaning/shore-gang`,
  },
  keywords: ["Khorfakkan hold cleaning", "Khorfakkan port", "cargo hold cleaning Khorfakkan"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning in Khorfakkan", path: "/hold-cleaning-in-khorfakkan" },
];

export default function KhorfakkanPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="Khorfakkan Services" title="Hold Cleaning in Khorfakkan" description="Professional cargo hold cleaning at Khorfakkan Port" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Hold Cleaning in Khorfakkan</h2>
            <p>CleanShip Marine provides hold and tank cleaning services at Khorfakkan Port on the east coast of the UAE. We mobilise teams for rapid cargo hold preparation.</p>
            <h3>Services</h3>
            <ul>
              <li>Shore gang cleaning at Khorfakkan Port</li>
              <li>Riding crew services during passage</li>
              <li>Grain-clean and hospital-clean standards</li>
              <li>Quick mobilisation for bulk and container vessels</li>
            </ul>
            <h3>About Khorfakkan Port</h3>
            <p>Khorfakkan Port is a major transshipment hub on the UAE's east coast, handling significant volumes of containerized cargo and bulk commodities.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

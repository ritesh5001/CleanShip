import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning in Brazil | Marine Services",
  description: "Hold and tank cleaning services in Brazilian ports. Cargo hold preparation for bulk carriers and tankers.",
  path: "/hold-cleaning-in-brazil",
  alternates: {
    canonical: `${BASE_URL}/services/hold-cleaning/shore-gang`,
  },
  keywords: ["hold cleaning Brazil", "cargo hold cleaning Brazil", "tank cleaning Brazil ports"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning in Brazil", path: "/hold-cleaning-in-brazil" },
];

export default function BrazilPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="International Services" title="Hold Cleaning in Brazil" description="Professional cargo hold cleaning at Brazilian ports" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Hold Cleaning Services in Brazil</h2>
            <p>CleanShip Marine provides hold and tank cleaning services at major Brazilian ports. Our teams are experienced in tropical port operations and rapid cargo turnarounds.</p>
            <h3>Our Services</h3>
            <ul>
              <li>Shore gang cleaning at Brazilian port facilities</li>
              <li>Riding crew services for passage cleaning</li>
              <li>Grain-clean preparation for agricultural commodities</li>
              <li>Rapid mobilisation to Brazilian ports</li>
            </ul>
            <h3>Ports Served</h3>
            <p>We provide services at major Brazilian bulk commodity ports including Santos, Rio Grande, Tubarao and other key facilities.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

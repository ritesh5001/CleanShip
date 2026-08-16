import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning in Sharjah | UAE Port Services",
  description: "Hold and tank cleaning in Sharjah. Professional cargo hold cleaning at Sharjah Ports.",
  path: "/hold-cleaning-in-sharjah",
  alternates: {
    canonical: `${BASE_URL}/services/hold-cleaning/shore-gang`,
  },
  keywords: ["Sharjah hold cleaning", "Sharjah port cleaning", "cargo hold cleaning Sharjah"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning in Sharjah", path: "/hold-cleaning-in-sharjah" },
];

export default function SharjahPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="Sharjah Services" title="Hold Cleaning in Sharjah" description="Professional cargo hold cleaning at Sharjah Ports" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Hold Cleaning in Sharjah</h2>
            <p>CleanShip Marine provides hold and tank cleaning services at Sharjah Ports (Mina Khalifa and Port Khalifa). Our teams mobilise rapidly for cargo hold preparation.</p>
            <h3>Services Available</h3>
            <ul>
              <li>Shore gang cleaning for Sharjah port operations</li>
              <li>Riding crew cleaning at sea</li>
              <li>Grain-clean and hospital-clean standards</li>
              <li>Fast turnarounds for bulk and container vessels</li>
            </ul>
            <h3>Ports Served</h3>
            <p>We provide services at Mina Khalifa (Port Khalifa) and other Sharjah port facilities.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

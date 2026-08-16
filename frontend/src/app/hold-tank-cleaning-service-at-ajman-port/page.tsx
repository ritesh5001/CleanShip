import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema, BASE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning at Ajman Port | UAE",
  description: "Professional hold and tank cleaning at Ajman Port. Grain-clean cargo preparation for bulk carriers.",
  path: "/hold-tank-cleaning-service-at-ajman-port",
  alternates: {
    canonical: `${BASE_URL}/services/hold-cleaning/shore-gang`,
  },
  keywords: ["Ajman port cleaning", "Ajman hold cleaning"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning at Ajman", path: "/hold-tank-cleaning-service-at-ajman-port" },
];

export default function AjmanPortPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="Port Services" title="Hold Cleaning at Ajman Port" description="Cargo hold cleaning and tank cleaning at Ajman" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Hold Cleaning Services at Ajman</h2>
            <p>CleanShip Marine provides professional hold cleaning at Ajman Port. We mobilise experienced teams for rapid turnarounds between cargo operations.</p>
            <h3>Our Scope</h3>
            <ul>
              <li>Shore gang cleaning during port operations</li>
              <li>Riding crew sailing with vessel</li>
              <li>Grain-clean and hospital-clean standards</li>
              <li>Fast mobilisation and professional execution</li>
            </ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ship Hold Cleaning at Mumbai Port, India",
  description: "Professional hold and tank cleaning at Mumbai Port. Cargo hold cleaning for bulk carriers, tankers and container ships.",
  path: "/ship-hold-cleaning-in-mumbai-port",
  canonicalPath: "/services/hold-cleaning/shore-gang",
  keywords: ["Mumbai port cleaning", "hold cleaning Mumbai", "cargo hold cleaning India"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Ship Hold Cleaning at Mumbai", path: "/ship-hold-cleaning-in-mumbai-port" },
];

export default function MumbaiPortPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />
      <PageHero eyebrow="India Services" title="Ship Hold Cleaning at Mumbai Port" description="Professional hold cleaning at Mumbai, India's busiest port" trail={trail} />
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="prose prose-sm max-w-3xl">
            <h2>Ship Hold Cleaning at Mumbai Port</h2>
            <p>CleanShip Marine provides ship hold and tank cleaning services at Mumbai Port, India&apos;s busiest and most important port. Our teams mobilise rapidly for cargo hold preparation.</p>
            <h3>Available Services</h3>
            <ul>
              <li>Shore gang cleaning at Mumbai Port terminals</li>
              <li>Riding crew services during passage</li>
              <li>Grain-clean and hospital-clean standards</li>
              <li>Experienced teams for busy port operations</li>
            </ul>
            <h3>About Mumbai Port</h3>
            <p>Mumbai Port (also known as Port of Bombay) is India&apos;s busiest and most important port, handling container cargo, dry bulk, liquid cargo and general cargo.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

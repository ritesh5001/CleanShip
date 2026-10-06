import type { Metadata } from "next";
import { company } from "@/content/company";
import { site } from "@/content/site";
import { breadcrumbSchema, buildMetadata, officeSchemas } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { OfficeGrid } from "@/components/offices";
import { CtaBand } from "@/components/cta-band";

const description = `Cleanship Marine Services offices in the UAE, Saudi Arabia, India, Sri Lanka and Guinea. Head office: ${company.registeredAddress.full}.`;
export const metadata: Metadata = buildMetadata({ title: "Our Offices", description, path: "/offices" });
const trail = [{ name: "Home", path: "/" }, { name: "Offices", path: "/offices" }];

export default function OfficesPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail), ...officeSchemas()]} />
      <PageHero eyebrow="Offices" title="Our offices" lead={description} trail={trail} />
      <section className="bg-white">
        <div className="container-page py-20">
          <OfficeGrid />
          {site.officesNote && (
            <p className="mt-12 max-w-2xl border-l-4 border-aqua-500 bg-paper p-5 text-[15px] leading-[1.6] text-ink-700">
              {site.officesNote}
            </p>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { Badge, SectionHeading } from "@/components/ui";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

/**
 * Reached by scanning the Equipment QR Code stuck on the pump itself, not
 * from site navigation — hence noIndex. The four spec fields come off the
 * QR payload and are fixed; everything else is filled in per-rental by the
 * office and starts blank on a freshly deployed unit.
 */
export const metadata: Metadata = buildMetadata({
  title: "Equipment CS-HP-001 — FOSES High-Pressure Pump",
  description: "Equipment record for pump CS-HP-001, a FOSES 500 bar / 30 l/m high-pressure unit.",
  path: "/equipment/CS-HP-001",
  noIndex: true,
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Equipment", path: "/equipment/CS-HP-001" },
  { name: "CS-HP-001", path: "/equipment/CS-HP-001" },
];

const specs = [
  { label: "Pump serial number", value: "CS-HP-001" },
  { label: "Model", value: "FOSES" },
  { label: "Pressure", value: "500 BARS" },
  { label: "Flow", value: "30 l/m" },
];

const deployment = [
  { label: "Current location", value: null },
  { label: "Current vessel", value: null },
  { label: "Customer", value: null },
  { label: "Rental start", value: null },
  { label: "Expected return", value: null },
  { label: "Engine hours", value: null },
];

const record = [
  { label: "Maintenance history", value: null },
  { label: "Accessories", value: null },
  { label: "Condition", value: null },
];

function FieldGrid({ fields }: { fields: { label: string; value: string | null }[] }) {
  return (
    <dl className="grid grid-cols-1 border-l border-t border-line-200 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.label}
          className="border-b border-r border-line-200 px-6 py-6"
        >
          <dt className="label-caps text-[12px] text-slate-500">{field.label}</dt>
          <dd className="mt-2 text-[17px] leading-[1.4] text-ink-900">
            {field.value ?? (
              <span className="text-[14px] font-normal text-slate-400">
                Office Input
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function EquipmentPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />

      <PageHero
        eyebrow="Equipment Record"
        title="CS-HP-001"
        description="FOSES high-pressure pump — 500 bar / 30 l/m. Scanned from the equipment QR code."
        trail={trail}
      />

      <section className="bg-white">
        <div className="container-page py-14 lg:py-20">
          <Badge>Rental unit</Badge>

          <div className="mt-10">
            <SectionHeading eyebrow="Fixed spec" title="Pump specification" />
            <div className="mt-8">
              <FieldGrid fields={specs} />
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="Per rental" title="Deployment" />
            <div className="mt-8">
              <FieldGrid fields={deployment} />
            </div>
          </div>

          <div className="mt-16">
            <SectionHeading eyebrow="Asset record" title="Maintenance & condition" />
            <div className="mt-8">
              <FieldGrid fields={record} />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import { site } from "@/content/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { CertificateCard } from "@/components/certificate";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = buildMetadata({ title: site.about.title, description: site.about.lead, path: "/about", image: "/images/crew-at-work.jpg" });
const trail = [{ name: "Αρχική", path: "/" }, { name: "Η εταιρεία", path: "/about" }];

export default function AboutPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />
      <PageHero eyebrow="Η εταιρεία" title={site.about.title} lead={site.about.lead} trail={trail} image="/images/crew-at-work.jpg" />
      <section className="bg-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12">
          <div className="space-y-5 text-[17px] leading-[1.7] text-ink-700 lg:col-span-8">
            {site.about.paras.map((p) => <p key={p}>{p}</p>)}
          </div>
        </div>
      </section>
      <section className="bg-paper">
        <div className="container-page py-20">
          <SectionHeading eyebrow="Εγκρίσεις" title="Πιστοποιημένοι από νηογνώμονα" />
          <div className="mt-10"><CertificateCard /></div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

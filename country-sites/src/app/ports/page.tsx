import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";

const title = site.code === "ae" ? "Hull, Hold & Tank Cleaning at UAE Ports" : "Ports Where We Serve Greek Fleets";
export const metadata: Metadata = buildMetadata({ title, description: site.placesIntro, path: "/ports" });
const trail = [{ name: "Home", path: "/" }, { name: site.placesLabel, path: "/ports" }];

export default function PortsPage() {
  const groups = [...new Set(site.places.map((p) => p.area))];
  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />
      <PageHero eyebrow={site.placesLabel} title={site.placesTitle} lead={site.placesIntro} trail={trail} image="/images/vessel-on-passage.jpg" />
      <section className="bg-white">
        <div className="container-page space-y-14 py-20">
          {groups.map((area) => (
            <div key={area}>
              <h2 className="text-h3 text-ink-900">{area}</h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {site.places.filter((p) => p.area === area).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/ports/${p.slug}`} className="card card-interactive group block h-full p-6">
                      <p className="label-caps text-[11px] text-slate-500">
                        {[p.waterBody, p.unlocode].filter(Boolean).join(" · ")}
                      </p>
                      <h3 className="mt-2 font-display text-[22px] font-bold uppercase leading-tight text-ink-900 group-hover:text-blue-600">{p.name}</h3>
                      <p className="mt-2 text-[15px] leading-[1.55] text-slate-600">{p.hook}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

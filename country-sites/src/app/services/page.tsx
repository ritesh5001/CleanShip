import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { ArrowIcon, CategoryIcon } from "@/components/icons";

const title = site.code === "ae" ? "Marine Cleaning Services in the UAE" : "Marine Cleaning Services for Greek Fleets";
export const metadata: Metadata = buildMetadata({ title, description: site.servicesIntro, path: "/services" });

const trail = [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }];

export default function ServicesPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />
      <PageHero eyebrow="Services" title={title} lead={site.servicesIntro} trail={trail} image="/images/crew-at-work.jpg" />
      <section className="bg-white">
        <ul className="container-page grid gap-6 py-20 md:grid-cols-2">
          {site.services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="card card-interactive group flex h-full gap-6 p-7">
                <CategoryIcon name={s.icon} className="size-10 shrink-0 text-blue-600" />
                <div>
                  <h2 className="font-display text-[24px] font-bold uppercase leading-tight text-ink-900 group-hover:text-blue-600">{s.name}</h2>
                  <p className="mt-3 text-[15px] leading-[1.6] text-slate-600">{s.intro[0]}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-blue-600">
                    {s.name} details <ArrowIcon className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}

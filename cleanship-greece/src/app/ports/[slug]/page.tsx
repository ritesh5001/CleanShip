import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlace, getService, site } from "@/content/site";
import { BASE_URL, ORG_ID, breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Button, CheckList } from "@/components/ui";
import { FaqList } from "@/components/faq";
import { CtaBand } from "@/components/cta-band";
import { ArrowIcon } from "@/components/icons";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return site.places.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getPlace((await params).slug);
  if (!p) return {};
  return buildMetadata({
    title: p.seoTitle,
    description: p.metaDescription,
    path: `/ports/${p.slug}`,
    keywords: [p.name, `hull cleaning ${p.name}`, `hold cleaning ${p.name}`, `${p.name} port`, ...site.keywords.slice(0, 3)],
  });
}

export default async function PlacePage({ params }: Params) {
  const p = getPlace((await params).slug);
  if (!p) notFound();
  const trail = [
    { name: "Home", path: "/" },
    { name: site.placesLabel, path: "/ports" },
    { name: p.name, path: `/ports/${p.slug}` },
  ];
  const services = p.services.map(getService).filter((s) => s !== undefined);
  const nearby = site.places.filter((x) => x.slug !== p.slug && x.area === p.area).slice(0, 4);

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          faqSchema(p.faqs),
          ...services.map((s) => ({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${s.name} at ${p.name}`,
            serviceType: s.name,
            provider: { "@id": ORG_ID },
            areaServed: { "@type": "Place", name: `${p.name}, ${p.area}` },
            url: `${BASE_URL}/ports/${p.slug}`,
          })),
        ]}
      />
      <PageHero eyebrow={`${p.area}${p.waterBody ? ` · ${p.waterBody}` : ""}`} title={p.seoTitle} lead={p.hook} trail={trail} image="/images/vessel-on-passage.jpg">
        <Button href={`/contact?port=${encodeURIComponent(p.name)}`} variant="light" arrow>Get a quote for {p.name}</Button>
      </PageHero>

      <section className="bg-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:gap-16">
          <article className="lg:col-span-8">
            <div className="space-y-5 text-[17px] leading-[1.7] text-ink-700">
              {p.body.map((para) => <p key={para}>{para}</p>)}
            </div>
            <section className="mt-12">
              <h2 className="text-h3 text-ink-900">What we do at {p.name}</h2>
              <div className="mt-5"><CheckList items={p.work} /></div>
            </section>
            <section className="mt-12">
              <h2 className="text-h3 text-ink-900">Services at {p.name}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="card card-interactive group block h-full p-5">
                      <h3 className="font-display text-[19px] font-bold uppercase text-ink-900 group-hover:text-blue-600">{s.name}</h3>
                      <p className="mt-2 text-[14px] leading-[1.55] text-slate-600">{s.short}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section className="mt-14">
              <h2 className="text-h3 text-ink-900">{p.name} — questions</h2>
              <div className="mt-6"><FaqList faqs={p.faqs} /></div>
            </section>
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-[130px]">
              <dl className="card rule-accent-top divide-y divide-line-200 p-7 text-[15px]">
                {[
                  [site.areaLabel, p.area],
                  ["Water", p.waterBody],
                  ["UN/LOCODE", p.unlocode],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <dt className="text-slate-500">{k}</dt>
                      <dd className="tabular text-right font-semibold text-ink-900">{v}</dd>
                    </div>
                  ))}
              </dl>
              {nearby.length > 0 && (
                <div className="card p-7">
                  <h2 className="font-display text-[19px] font-bold uppercase text-ink-900">Nearby</h2>
                  <ul className="mt-4 space-y-2.5">
                    {nearby.map((x) => (
                      <li key={x.slug}>
                        <Link href={`/ports/${x.slug}`} className="inline-flex items-center gap-2 text-[15px] text-blue-600 hover:underline">
                          {x.name} <ArrowIcon className="size-3.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
      <CtaBand title={`Ship due at ${p.name}?`} />
    </>
  );
}

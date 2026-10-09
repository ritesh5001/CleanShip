import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, site } from "@/content/site";
import { breadcrumbSchema, buildMetadata, faqSchema, serviceSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { Button, CheckList } from "@/components/ui";
import { FaqList } from "@/components/faq";
import { CtaBand } from "@/components/cta-band";
import { CertificateCard } from "@/components/certificate";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return site.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return buildMetadata({ title: s.seoTitle, description: s.metaDescription, path: `/services/${s.slug}`, image: s.image, keywords: s.keywords });
}

export default async function ServicePage({ params }: Params) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const trail = [
    { name: "Αρχική", path: "/" },
    { name: "Υπηρεσίες", path: "/services" },
    { name: s.name, path: `/services/${s.slug}` },
  ];
  const places = site.places.filter((p) => p.services.includes(s.slug));

  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail), serviceSchema(s), faqSchema(s.faqs)]} />
      <PageHero eyebrow={s.name} title={s.seoTitle} lead={s.short} trail={trail} image={s.image}>
        <Button href={`/contact?service=${encodeURIComponent(s.name)}`} variant="light" arrow>Ζητήστε προσφορά</Button>
      </PageHero>

      <section className="bg-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:gap-16">
          <article className="lg:col-span-8">
            <div className="space-y-5 text-[17px] leading-[1.7] text-ink-700">
              {s.intro.map((p) => <p key={p}>{p}</p>)}
            </div>
            {s.sections.map((sec) => (
              <section key={sec.heading} className="mt-12">
                <h2 className="text-h3 text-ink-900">{sec.heading}</h2>
                <p className="mt-4 text-[17px] leading-[1.7] text-ink-700">{sec.body}</p>
              </section>
            ))}
            {s.slug === "remote-inspection-ndt" && (
              <section className="mt-12">
                <h2 className="text-h3 text-ink-900">Έγκριση νηογνώμονα</h2>
                <div className="mt-5"><CertificateCard /></div>
              </section>
            )}
            <section className="mt-14">
              <h2 className="text-h3 text-ink-900">Συχνές ερωτήσεις</h2>
              <div className="mt-6"><FaqList faqs={s.faqs} /></div>
            </section>
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-[130px]">
              <div className="card rule-accent-top p-7">
                <h2 className="font-display text-[20px] font-bold uppercase text-ink-900">Τι περιλαμβάνεται</h2>
                <div className="mt-5"><CheckList items={s.points} /></div>
              </div>
              {places.length > 0 && (
                <div className="card p-7">
                  <h2 className="font-display text-[20px] font-bold uppercase text-ink-900">
                    {site.servicePortsLabel}
                  </h2>
                  <ul className="mt-4 space-y-2 text-[15px]">
                    {places.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/ports/${p.slug}`} className="text-blue-600 hover:underline">
                          {p.name}
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
      <CtaBand />
    </>
  );
}

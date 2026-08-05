import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { Button, CheckList, SectionHeading } from "@/components/ui";
import { ArrowIcon, CategoryIcon, PhoneIcon } from "@/components/icons";
import {
  allServicePaths,
  getService,
  relatedServices,
} from "@/lib/services";
import { siteConfig } from "@/lib/site";
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  serviceSchema,
} from "@/lib/seo";

type Params = { params: Promise<{ category: string; service: string }> };

export function generateStaticParams() {
  return allServicePaths();
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category: categorySlug, service: serviceSlug } = await params;
  const found = getService(categorySlug, serviceSlug);

  if (!found) return { title: "Service not found" };

  return buildMetadata({
    title: found.service.seoTitle,
    description: found.service.metaDescription,
    path: `/services/${categorySlug}/${serviceSlug}`,
    keywords: found.service.keywords,
  });
}

export default async function ServicePage({ params }: Params) {
  const { category: categorySlug, service: serviceSlug } = await params;
  const found = getService(categorySlug, serviceSlug);

  if (!found) notFound();

  const { category, service } = found;
  const siblings = relatedServices(categorySlug, serviceSlug);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: category.name, path: `/services/${category.slug}` },
    {
      name: service.name,
      path: `/services/${category.slug}/${service.slug}`,
    },
  ];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          serviceSchema(service, category),
          ...(service.faqs.length ? [faqSchema(service.faqs)] : []),
        ]}
      />

      <PageHero
        eyebrow={category.name}
        title={service.name}
        description={service.tagline}
        trail={trail}
      />

      <div className="container-page pb-20 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ============ Main column ============ */}
          <div className="lg:col-span-8">
            {/* Introduction */}
            <Reveal>
              <div className="space-y-5">
                {service.intro.map((paragraph, i) => (
                  <p
                    key={i}
                    className={`leading-relaxed ${
                      i === 0
                        ? "text-lg text-abyss-100"
                        : "text-base text-abyss-300"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            {/* Highlights */}
            <Reveal delay={80}>
              <div className="mt-10 rounded-2xl border border-marine-400/20 bg-marine-400/5 p-7">
                <h2 className="text-lg text-white">What you get</h2>
                <CheckList className="mt-5" items={service.highlights} />
              </div>
            </Reveal>

            {/* Scope of work */}
            <section className="mt-14">
              <Reveal>
                <h2 className="text-2xl text-white sm:text-3xl">
                  Scope of work
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-abyss-300">
                  What is included as standard. Anything outside this is quoted
                  separately and flagged before mobilisation, never added
                  afterwards.
                </p>
              </Reveal>

              <div className="mt-8 space-y-px overflow-hidden rounded-2xl border border-white/10">
                {service.scope.map((item, i) => (
                  <Reveal key={item.title} delay={i * 60}>
                    <div className="bg-abyss-900/50 p-6 transition hover:bg-abyss-900/80 sm:p-7">
                      <div className="flex gap-5">
                        <span className="font-display text-sm text-marine-400/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="text-base text-white">{item.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-abyss-300">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Process */}
            <section className="mt-14">
              <Reveal>
                <h2 className="text-2xl text-white sm:text-3xl">
                  How we deliver it
                </h2>
              </Reveal>

              <ol className="mt-8 space-y-6">
                {service.process.map((step, i) => (
                  <Reveal key={step.title} delay={i * 70}>
                    <li className="relative flex gap-5 pl-0">
                      <div className="flex flex-col items-center">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-marine-400/30 bg-abyss-950 font-display text-xs font-semibold text-marine-300">
                          {i + 1}
                        </span>
                        {i < service.process.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="mt-2 w-px flex-1 bg-gradient-to-b from-marine-400/30 to-transparent"
                          />
                        )}
                      </div>
                      <div className="pb-2">
                        <h3 className="text-base text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-abyss-300">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </section>

            {/* FAQ */}
            {service.faqs.length > 0 && (
              <section className="mt-14">
                <Reveal>
                  <h2 className="text-2xl text-white sm:text-3xl">
                    Frequently asked
                  </h2>
                  <div className="mt-6">
                    <FaqList faqs={service.faqs} />
                  </div>
                </Reveal>
              </section>
            )}
          </div>

          {/* ============ Sidebar ============ */}
          <aside className="lg:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-28">
              {/* Enquiry card */}
              <div className="rounded-2xl border border-marine-400/25 bg-gradient-to-br from-marine-600/20 to-abyss-900/70 p-6">
                <h2 className="text-lg text-white">
                  Enquire about {service.name.toLowerCase()}
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-abyss-200">
                  Tell us the vessel, the port and the window. Scoped reply,
                  usually the same working day.
                </p>
                <Button href="/contact" className="mt-5 w-full">
                  Request a quote
                </Button>
                <a
                  href={siteConfig.phones[0].href}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-marine-400/60 hover:text-marine-300"
                >
                  <PhoneIcon className="size-4" />
                  {siteConfig.phones[0].number}
                </a>
              </div>

              {/* Applies to */}
              <div className="rounded-2xl border border-white/10 bg-abyss-900/50 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-abyss-300">
                  Typically applied to
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {service.appliesTo.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-abyss-200"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-marine-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sibling services — internal linking for crawl depth */}
              {siblings.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-abyss-900/50 p-6">
                  <h2 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-wider text-abyss-300">
                    <CategoryIcon
                      name={category.icon}
                      className="size-4 text-marine-400"
                    />
                    More in {category.name}
                  </h2>
                  <ul className="mt-4 space-y-1">
                    {siblings.map((sibling) => (
                      <li key={sibling.slug}>
                        <Link
                          href={`/services/${category.slug}/${sibling.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-abyss-200 transition hover:bg-white/5 hover:text-marine-300"
                        >
                          {sibling.name}
                          <ArrowIcon className="size-3.5 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${category.slug}`}
                    className="mt-3 inline-flex items-center gap-2 px-3 text-sm font-semibold text-marine-300"
                  >
                    All {category.name.toLowerCase()}
                    <ArrowIcon className="size-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Cross-links to the other service lines */}
      <section className="border-t border-white/8 bg-abyss-900/30 py-16 lg:py-20">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Also available"
              title="Combine scopes in one mobilisation"
              description="Most of our work is multi-scope. Cleaning, inspection and repair delivered together removes the handover delays that dominate the timeline when trades are split between contractors."
            />
            <div className="mt-8">
              <Button href="/services" variant="ghost">
                Browse all services
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

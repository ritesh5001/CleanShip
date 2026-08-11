import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import {
  ProcessTimeline,
  ScopeScroller,
} from "@/components/motion/scope-scroller";
import { ScrollProgress } from "@/components/motion/scroll-fx";
import { JsonLd } from "@/components/json-ld";
import { Button, CheckList } from "@/components/ui";
import {
  ArrowIcon,
  CategoryIcon,
  CheckIcon,
  PhoneIcon,
} from "@/components/icons";
import {
  allServicePaths,
  getService,
  relatedServices,
  serviceCategories,
} from "@/lib/services";
import { categoryCoverage, serviceCoverage, siteConfig } from "@/lib/site";
import { heroMediaFor } from "@/lib/service-media";
import { HeroEnquiryForm } from "@/components/hero-enquiry-form";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { CoverageNote } from "@/components/locations";
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
  const coverage =
    serviceCoverage[serviceSlug] ?? categoryCoverage[categorySlug];

  const trail = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: category.name, path: `/services/${category.slug}` },
    { name: service.name, path: `/services/${category.slug}/${service.slug}` },
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

      {/* Reading-progress rail. Long service pages benefit most from an
          explicit "how much is left" signal, which matters more to a
          scanning superintendent than to a casual reader. */}
      <div
        aria-hidden="true"
        className="sticky top-0 z-40 h-[3px] w-full bg-line-100"
      >
        <ScrollProgress className="h-full w-full bg-aqua-500" />
      </div>

      <PageHero
        eyebrow={category.name}
        title={service.name}
        description={service.tagline}
        trail={trail}
        media={heroMediaFor(category.slug, service.slug)}
        aside={<HeroEnquiryForm serviceName={service.name} />}
      >
        {/* Fills the copy column against the taller form, and puts the three
            strongest selling points above the fold rather than making a
            superintendent scroll for them. */}
        <ul className="mt-9 space-y-3 border-t border-white/16 pt-7">
          {service.highlights.slice(0, 3).map((point) => (
            <li key={point} className="flex gap-3 text-[15px] text-white/80">
              <CheckIcon className="mt-1 size-4 shrink-0 text-aqua-500" />
              {point}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          {/* ============ Main column ============ */}
          <div className="lg:col-span-8">
            <Reveal>
              <div className="space-y-5">
                {service.intro.map((paragraph, i) => (
                  <p
                    key={i}
                    className={`leading-[1.62] ${
                      i === 0
                        ? "text-[19px] text-ink-900"
                        : "text-[16px] text-ink-700"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            {/* Highlights */}
            <Reveal delay={60}>
              <div className="rule-accent-left mt-10 border-y border-r border-line-200 bg-blue-50 p-7">
                <h2 className="font-display text-[20px] font-bold uppercase leading-tight text-ink-900">
                  What you get
                </h2>
                <CheckList className="mt-5" items={service.highlights} />
              </div>
            </Reveal>

            {/* Coverage is stated per scope where we have it, falling back to
                the service line. Hull cleaning runs a West Africa range while
                riding crews travel anywhere — one company-wide claim would
                mislead on both. */}
            {coverage && (
              <Reveal delay={80}>
                <CoverageNote
                  areas={coverage.areas}
                  worldwide={coverage.worldwide}
                  className="mt-8"
                />
              </Reveal>
            )}

            {/* Scope of work */}
            <section className="mt-14">
              <Reveal>
                <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                  Scope of work
                </h2>
                <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.62] text-slate-600">
                  What is included as standard. Anything outside this is quoted
                  separately and flagged before mobilisation, never added
                  afterwards.
                </p>
              </Reveal>

              {/* GSAP scrubs the rail and reports the active row; Motion
                  damps the resulting numeral transition. */}
              <ScopeScroller items={service.scope} />
            </section>

            {/* Process */}
            <section className="mt-14">
              <Reveal>
                <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                  How we deliver it
                </h2>
              </Reveal>

              <div className="mt-8">
                <ProcessTimeline steps={service.process} />
              </div>
            </section>

            {/* FAQ */}
            {service.faqs.length > 0 && (
              <section className="mt-14">
                <Reveal>
                  <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
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
            <div className="space-y-6 lg:sticky lg:top-28">
              {/* Enquiry */}
              <div className="on-navy rule-accent-top bg-navy-800 p-6 text-white">
                <h2 className="font-display text-[20px] font-bold uppercase leading-tight">
                  Enquire about this service
                </h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-white/72">
                  Tell us the vessel, the port and the window. Scoped reply,
                  usually the same working day.
                </p>
                <Button
                  href="/contact"
                  variant="light"
                  className="mt-6 w-full"
                >
                  Get a quote
                </Button>
                <a
                  href={siteConfig.phones[0].href}
                  className="label-caps mt-3 flex h-11 w-full items-center justify-center gap-2 border border-white/40 text-white transition-colors duration-[140ms] hover:border-aqua-500 hover:bg-white/10"
                >
                  <PhoneIcon className="size-4" />
                  <span className="tabular">{siteConfig.phones[0].number}</span>
                </a>
              </div>

              {/* Applies to */}
              <div className="card p-6">
                <h2 className="label-caps text-[12px] text-slate-500">
                  Typically applied to
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {service.appliesTo.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[15px] text-ink-700"
                    >
                      <span className="mt-2 size-1 shrink-0 bg-aqua-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Siblings — internal linking for crawl depth */}
              {siblings.length > 0 && (
                <div className="card p-6">
                  <h2 className="label-caps flex items-center gap-2.5 text-[12px] text-slate-500">
                    <CategoryIcon
                      name={category.icon}
                      className="size-4 text-blue-600"
                    />
                    More in {category.name}
                  </h2>
                  <ul className="mt-4 divide-y divide-line-100">
                    {siblings.map((sibling) => (
                      <li key={sibling.slug}>
                        <Link
                          href={`/services/${category.slug}/${sibling.slug}`}
                          className="group flex items-center justify-between gap-3 py-3 text-[15px] text-ink-700 transition-colors duration-[140ms] hover:text-blue-600"
                        >
                          {sibling.name}
                          <ArrowIcon className="size-4 shrink-0 text-slate-300 transition-transform duration-[140ms] group-hover:translate-x-0.5 group-hover:text-blue-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${category.slug}`}
                    className="label-caps mt-4 inline-flex items-center gap-2 text-blue-600"
                  >
                    All {category.name.toLowerCase()}
                    <ArrowIcon className="size-4" />
                  </Link>
                </div>
              )}

              {/* Other service lines — the sibling block only reaches within
                  this category, so without this a visitor deep in one line has
                  no path across to the other four. Also flattens crawl depth
                  between every branch of the taxonomy. */}
              <div className="card p-6">
                <h2 className="label-caps text-[12px] text-slate-500">
                  Other service lines
                </h2>
                <ul className="mt-4 divide-y divide-line-100">
                  {serviceCategories
                    .filter((c) => c.slug !== category.slug)
                    .map((other) => (
                      <li key={other.slug}>
                        <Link
                          href={`/services/${other.slug}`}
                          className="group flex items-center gap-3 py-3 transition-colors duration-[140ms]"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center bg-blue-50 text-blue-600 transition-colors duration-[140ms] group-hover:bg-blue-100">
                            <CategoryIcon name={other.icon} className="size-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-[16px] font-semibold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                              {other.name}
                            </span>
                            <span className="mt-0.5 block text-[12px] text-slate-500">
                              {other.services.length} scopes
                            </span>
                          </span>
                          <ArrowIcon className="size-4 shrink-0 text-slate-300 transition-transform duration-[140ms] group-hover:translate-x-0.5 group-hover:text-blue-600" />
                        </Link>
                      </li>
                    ))}
                </ul>
                <Link
                  href="/services"
                  className="label-caps mt-4 inline-flex items-center gap-2 text-blue-600"
                >
                  All services
                  <ArrowIcon className="size-4" />
                </Link>
              </div>

              {/* WhatsApp — the channel agents actually reply on. */}
              <div className="rule-accent-top border border-line-200 bg-paper p-6">
                <h2 className="font-display text-[17px] font-bold uppercase leading-tight text-ink-900">
                  Need an answer now?
                </h2>
                <p className="mt-2 text-[14px] leading-[1.6] text-slate-600">
                  The operations desk is manned 24/7.
                </p>
                <WhatsAppCta className="mt-4 w-full" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

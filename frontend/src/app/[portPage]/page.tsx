import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui";
import { ArrowIcon, PhoneIcon } from "@/components/icons";
import { HeroEnquiryForm } from "@/components/hero-enquiry-form";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { PhotoOverlay } from "@/components/photo-overlay";
import {
  NearbyPorts,
  OtherLinesAtPort,
  OtherScopesAtPort,
  PortConditions,
  PortDelivery,
  PortFacts,
  PortOutcomes,
  PortPlanning,
  PortScopeList,
} from "@/components/port-sections";

import { siteConfig } from "@/lib/site";
import { stockImages } from "@/lib/stock-images";
import { heroMediaFor } from "@/lib/service-media";
import { heroImageFor } from "@/lib/stock-images";
import { getService } from "@/lib/services";
import type { Port } from "@/lib/ports/types";
import { portLabel } from "@/lib/ports/types";
import type { PortLine, PortScope } from "@/lib/ports/lines";
import {
  deliverySteps,
  getPortPage,
  pageDescription,
  pageKeywords,
  pageTitle,
  portHubFaqs,
  portHubSlug,
  portLines,
  portPages,
  portScopeSlug,
  portsGrouped,
  portsWithLine,
  regionHubFaqs,
  regionHubSlug,
  regionOf,
  scopeFaqs,
  type PortPage,
} from "@/lib/ports/registry";
import {
  BASE_URL,
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
} from "@/lib/seo";

/**
 * Every port landing page, from one route.
 *
 * Three page kinds share it — the region hub for a service line, the port hub
 * for that line, and one scope at one port. See lib/ports/registry.ts for the
 * route shapes and why they self-canonicalise.
 *
 * The segment sits at the root rather than under /ports/ because the URL is a
 * ranking surface and "hull-cleaning-in-kandla-port" matches the query in a
 * way "/ports/kandla/hull-cleaning" does not. Next.js has no partial dynamic
 * segments, so a root [portPage] is the only shape that produces those URLs.
 *
 * `dynamicParams = false` is what makes that safe: only the slugs in
 * `portPages` resolve, everything else 404s exactly as before. Static routes
 * at the root still win over this one, so the rest of the site is untouched.
 */

type Params = { params: Promise<{ portPage: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return portPages.map((page) => ({ portPage: page.slug }));
}

/** Poster art for a line, falling back through the taxonomy's own mapping. */
function mediaFor(line: PortLine, scope?: PortScope) {
  const slug = scope?.serviceSlug ?? line.scopes[0].serviceSlug;
  return (
    heroMediaFor(line.categorySlug, slug) ?? heroMediaFor(line.categorySlug)
  );
}

function imageFor(line: PortLine, scope?: PortScope) {
  const slug = scope?.serviceSlug ?? line.scopes[0].serviceSlug;
  return heroImageFor(line.categorySlug, slug) ?? heroImageFor(line.categorySlug);
}

function shareImage(line: PortLine, scope?: PortScope) {
  const media = mediaFor(line, scope);
  if (media) return { url: `/posters/${media.slug}.jpg`, alt: media.alt };
  const still = imageFor(line, scope);
  return still ? { url: still.src, alt: still.alt } : undefined;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { portPage } = await params;
  const page = getPortPage(portPage);
  if (!page) return { title: "Not found" };

  return buildMetadata({
    title: pageTitle(page),
    description: pageDescription(page),
    path: `/${page.slug}`,
    keywords: pageKeywords(page),
    image: shareImage(page.line, page.kind === "scope" ? page.scope : undefined),
  });
}

export default async function PortLandingPage({ params }: Params) {
  const { portPage } = await params;
  const page = getPortPage(portPage);
  if (!page) notFound();

  if (page.kind === "region") return <RegionHub page={page} />;
  if (page.kind === "port") return <PortHub page={page} />;
  return <ScopePage page={page} />;
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function portTrail(port: Port, line: PortLine) {
  const region = regionOf(port);
  return [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: line.name, path: `/services/${line.categorySlug}` },
    { name: region.name, path: `/${regionHubSlug(line, region)}` },
    { name: portLabel(port), path: `/${portHubSlug(port, line)}` },
  ];
}

/** Service node scoped to one port — this is the local-intent signal. */
function portServiceSchema({
  port,
  name,
  description,
  url,
  scopeItems,
}: {
  port: Port;
  name: string;
  description: string;
  url: string;
  scopeItems: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType: name,
    description,
    provider: { "@id": `${BASE_URL}/#organization` },
    url,
    areaServed: {
      "@type": "Place",
      name: `${portLabel(port)}, ${port.state}, ${port.country}`,
      identifier: port.unlocode,
      address: {
        "@type": "PostalAddress",
        addressLocality: port.name,
        addressRegion: port.state,
        addressCountry: port.countryCode,
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${name} scope of work`,
      itemListElement: scopeItems.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
    },
  };
}

function EnquiryCard({ port, line }: { port: Port; line: PortLine }) {
  return (
    <div className="on-navy rule-accent-top relative isolate overflow-hidden bg-navy-800 p-6 text-white">
      <PhotoOverlay
        image={stockImages.vesselOnPassage}
        strength="heavy"
        sizes="(min-width: 1024px) 33vw, 100vw"
      />
      <h2 className="font-display text-[20px] font-bold uppercase leading-tight">
        Enquire for {portLabel(port)}
      </h2>
      <p className="mt-3 text-[15px] leading-[1.6] text-white/72">
        Give us the vessel, her ETA at {port.name} and the window. Scoped reply,
        usually the same working day.
      </p>
      <Button href="/contact" variant="light" className="mt-6 w-full">
        Get a quote
      </Button>
      <a
        href={siteConfig.phones[0].href}
        className="label-caps mt-3 flex h-11 w-full items-center justify-center gap-2 border border-white/40 text-white transition-colors duration-[140ms] hover:border-aqua-500 hover:bg-white/10"
      >
        <PhoneIcon className="size-4" />
        <span className="tabular">{siteConfig.phones[0].number}</span>
      </a>
      <p className="sr-only">
        {line.name} enquiries for {portLabel(port)}.
      </p>
    </div>
  );
}

function WhatsAppCard() {
  return (
    <div className="rule-accent-top border border-line-200 bg-paper p-6">
      <h2 className="font-display text-[17px] font-bold uppercase leading-tight text-ink-900">
        Need an answer now?
      </h2>
      <p className="mt-2 text-[14px] leading-[1.6] text-slate-600">
        The operations desk is manned 24/7.
      </p>
      <WhatsAppCta className="mt-4 w-full" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Region hub — one line across a whole region                         */
/* ------------------------------------------------------------------ */

function RegionHub({
  page,
}: {
  page: Extract<PortPage, { kind: "region" }>;
}) {
  const { region, line, slug } = page;
  const ports = portsWithLine(line.key, region);
  const grouped = portsGrouped(region, line.key);
  const faqs = regionHubFaqs(region, line);
  const bases = region.ports.filter((p) => p.base);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: line.name, path: `/services/${line.categorySlug}` },
    { name: region.name, path: `/${slug}` },
  ];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${BASE_URL}/${slug}#service`,
            name: `${line.name} in ${region.name}`,
            serviceType: line.name,
            description: pageDescription(page),
            provider: { "@id": `${BASE_URL}/#organization` },
            url: `${BASE_URL}/${slug}`,
            areaServed: ports.map((port) => ({
              "@type": "Place",
              name: `${portLabel(port)}, ${port.state}, ${port.country}`,
              identifier: port.unlocode,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Ports served for ${line.noun} in ${region.name}`,
            numberOfItems: ports.length,
            itemListElement: ports.map((port, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${line.name} at ${portLabel(port)}`,
              url: `${BASE_URL}/${portHubSlug(port, line)}`,
            })),
          },
          faqSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow={`${region.name} coverage`}
        title={`${line.name} in ${region.name}`}
        description={`${line.hubTagline} at ${ports.length} ${region.portsLabel}.`}
        trail={trail}
        media={mediaFor(line)}
        image={imageFor(line)}
        aside={
          <HeroEnquiryForm serviceName={`${line.name} in ${region.name}`} />
        }
      />

      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-[19px] leading-[1.62] text-ink-900">
                  Cleanship Marine works {ports.length} {region.portsLabel} for{" "}
                  {line.noun}. Every scope is delivered with the vessel afloat
                  and working — no dry dock, no diversion, no off-hire.
                </p>
                <p className="mt-5 text-[16px] leading-[1.62] text-ink-700">
                  {region.intro} Each port page below says what the conditions
                  actually are there, who approves the work, and what the
                  traffic looks like — because scoping against an average is how
                  attendances overrun.
                </p>
                <p className="mt-5 text-[16px] leading-[1.62] text-ink-700">
                  {region.regionNote}
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={60}>
                <div className="rule-accent-top border border-line-200 bg-paper p-7">
                  <h2 className="font-display text-[20px] font-bold uppercase leading-tight text-ink-900">
                    Coverage at a glance
                  </h2>
                  <dl className="mt-5 divide-y divide-line-200">
                    {[
                      { label: "Ports covered", value: ports.length },
                      { label: "Operating bases", value: bases.length },
                      { label: "Scopes per port", value: line.scopes.length },
                      { label: `${region.groupNoun}s served`, value: grouped.length },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-baseline justify-between gap-4 py-3"
                      >
                        <dt className="text-[15px] capitalize text-ink-700">
                          {row.label}
                        </dt>
                        <dd className="tabular text-[22px] text-blue-600">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Scopes */}
          <section className="mt-16">
            <Reveal>
              <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                The {line.scopes.length} scopes
              </h2>
              <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.62] text-slate-600">
                One team covers all of them. Most vessels take more than one on
                the same attendance, which is where the mobilisation cost stops
                being the expensive part of the job.
              </p>
            </Reveal>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {line.scopes.map((scope, i) => (
                <Reveal as="li" key={scope.urlPrefix} delay={i * 40}>
                  <Link
                    href={`/services/${line.categorySlug}/${scope.serviceSlug}`}
                    className="card card-interactive group flex h-full flex-col p-6"
                  >
                    <h3 className="font-display text-[19px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                      {scope.name}
                    </h3>
                    <p className="mt-3 flex-1 text-[14px] leading-[1.6] text-slate-600">
                      {scope.tagline}
                    </p>
                    <span className="label-caps mt-5 inline-flex items-center gap-2 text-blue-600">
                      Service details
                      <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </section>

          {/* Ports */}
          <section className="mt-16">
            <Reveal>
              <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                Ports we cover
              </h2>
              <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.62] text-slate-600">
                Every port below has its own page covering local conditions,
                the approving authority, vessel traffic and each scope.
              </p>
            </Reveal>

            <div className="mt-10 space-y-12">
              {grouped.map((group) => (
                <div key={group.state}>
                  <h3 className="label-caps border-b border-line-200 pb-3 text-[12px] text-slate-500">
                    {group.state}
                    <span className="tabular ml-3 text-blue-600">
                      {String(group.ports.length).padStart(2, "0")}
                    </span>
                  </h3>

                  <ul className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.ports.map((port) => (
                      <li key={port.slug}>
                        <Link
                          href={`/${portHubSlug(port, line)}`}
                          className="group inline-flex items-baseline gap-2"
                        >
                          <span className="font-display text-[18px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                            {portLabel(port)}
                          </span>
                          <span className="tabular text-[12px] text-slate-400">
                            {port.unlocode}
                          </span>
                        </Link>
                        <p className="mt-1 text-[13px] leading-[1.5] text-slate-500">
                          {port.type} · {port.waterBody}
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                          {line.scopes.map((scope) => (
                            <li key={scope.urlPrefix}>
                              <Link
                                href={`/${portScopeSlug(port, scope)}`}
                                className="text-[12px] text-slate-500 underline decoration-line-200 underline-offset-4 transition-colors duration-[140ms] hover:text-blue-600 hover:decoration-blue-400"
                              >
                                {scope.titleStem}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Other lines in this region */}
          <section className="mt-16">
            <Reveal>
              <h2 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
                Other service lines in {region.name}
              </h2>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                {portLines
                  .filter(
                    (other) =>
                      other.key !== line.key &&
                      portsWithLine(other.key, region).length > 0,
                  )
                  .map((other) => (
                    <li key={other.key}>
                      <Link
                        href={`/${regionHubSlug(other, region)}`}
                        className="label-caps group inline-flex items-center gap-2 text-blue-600"
                      >
                        {other.name} in {region.name}
                        <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </Reveal>
          </section>

          {/* FAQ */}
          <section className="mt-16 max-w-4xl">
            <Reveal>
              <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                Frequently asked — {region.name}
              </h2>
              <div className="mt-6">
                <FaqList faqs={faqs} />
              </div>
            </Reveal>
          </section>
        </div>
      </section>

      <CtaBand
        title={`${line.name} at a ${region.name === "the UAE" ? "UAE" : region.name} port.`}
        description="Tell us the vessel, the port and the window. You get a scope, a crew size and an honest duration — usually the same working day."
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Port hub — one line at one port                                     */
/* ------------------------------------------------------------------ */

function PortHub({ page }: { page: Extract<PortPage, { kind: "port" }> }) {
  const { port, line, slug } = page;
  const url = `${BASE_URL}/${slug}`;
  const region = regionOf(port);
  const trail = portTrail(port, line);
  const faqs = portHubFaqs(port, line);
  const steps = deliverySteps(port, line);

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          portServiceSchema({
            port,
            name: `${line.name} at ${portLabel(port)}`,
            description: pageDescription(page),
            url,
            scopeItems: line.scopes.map((s) => s.name),
          }),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${line.name} scopes at ${portLabel(port)}`,
            itemListElement: line.scopes.map((scope, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${scope.name} at ${portLabel(port)}`,
              url: `${BASE_URL}/${portScopeSlug(port, scope)}`,
            })),
          },
          faqSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow={`${port.state} · ${port.unlocode}`}
        title={`${line.name} at ${portLabel(port)}`}
        description={`${line.hubTagline} at ${portLabel(port)} — ${port.hook}.`}
        trail={trail}
        media={mediaFor(line)}
        image={imageFor(line)}
        aside={
          <HeroEnquiryForm
            serviceName={`${line.name} at ${portLabel(port)}`}
          />
        }
      />

      <section className="bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="text-[19px] leading-[1.62] text-ink-900">
                {line.hubIntro(port)}
              </p>
              <p className="mt-5 text-[16px] leading-[1.62] text-ink-700">
                {port.profile}
              </p>
            </Reveal>

            <Reveal delay={60}>
              <div className="mt-10">
                <PortConditions port={port} line={line.key} />
              </div>
            </Reveal>

            <section className="mt-14">
              <Reveal>
                <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                  {line.name} scopes at {port.name}
                </h2>
                <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.62] text-slate-600">
                  {line.scopes.length} scopes, one team and one mobilisation.
                  Most vessels calling here take more than one on the same
                  attendance.
                </p>
              </Reveal>

              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {line.scopes.map((scope, i) => (
                  <Reveal as="li" key={scope.urlPrefix} delay={i * 40}>
                    <Link
                      href={`/${portScopeSlug(port, scope)}`}
                      className="card card-interactive group flex h-full flex-col p-6"
                    >
                      <h3 className="font-display text-[19px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                        {scope.titleStem} at {port.name}
                      </h3>
                      <p className="mt-3 flex-1 text-[14px] leading-[1.6] text-slate-600">
                        {scope.tagline}
                      </p>
                      <span className="label-caps mt-5 inline-flex items-center gap-2 text-blue-600">
                        View
                        <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </section>

            <PortPlanning port={port} line={line.key} />

            <PortDelivery port={port} steps={steps} />

            <Reveal>
              <div className="mt-14">
                <PortFacts port={port} />
              </div>
            </Reveal>

            <section className="mt-14">
              <Reveal>
                <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                  Frequently asked — {portLabel(port)}
                </h2>
                <div className="mt-6">
                  <FaqList faqs={faqs} />
                </div>
              </Reveal>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-[128px]">
              <EnquiryCard port={port} line={line} />
              <OtherScopesAtPort port={port} line={line} />
              <OtherLinesAtPort port={port} current={line.key} />
              <NearbyPorts
                port={port}
                line={line}
                regionHubPath={`/${regionHubSlug(line, region)}`}
                regionLabel={region.portsLabel}
              />
              <WhatsAppCard />
            </div>
          </aside>
        </div>
      </section>

      <CtaBand
        title={`${line.name} at ${portLabel(port)}.`}
        description={`Tell us the vessel, her ETA at ${port.name} and the window. You get a scope, a crew size and an honest duration — usually the same working day.`}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* One scope at one port                                               */
/* ------------------------------------------------------------------ */

function ScopePage({ page }: { page: Extract<PortPage, { kind: "scope" }> }) {
  const { port, line, scope, slug } = page;
  const url = `${BASE_URL}/${slug}`;
  const region = regionOf(port);
  const canonical = getService(line.categorySlug, scope.serviceSlug);
  const trail = [
    ...portTrail(port, line),
    { name: scope.titleStem, path: `/${slug}` },
  ];
  const faqs = scopeFaqs(port, line, scope);
  const localScope = scope.localScope(port);
  const steps = deliverySteps(port, line, scope);

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          portServiceSchema({
            port,
            name: `${scope.name} at ${portLabel(port)}`,
            description: pageDescription(page),
            url,
            scopeItems: localScope,
          }),
          faqSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow={`${portLabel(port)} · ${port.unlocode}`}
        title={`${scope.name} at ${portLabel(port)}`}
        description={scope.tagline}
        trail={trail}
        media={mediaFor(line, scope)}
        image={imageFor(line, scope)}
        aside={
          <HeroEnquiryForm
            serviceName={`${scope.name} at ${portLabel(port)}`}
          />
        }
      />

      <section className="bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="text-[19px] leading-[1.62] text-ink-900">
                {scope.lead(port)}
              </p>
              <p className="mt-5 text-[16px] leading-[1.62] text-ink-700">
                {scope.angle(port)}
              </p>
            </Reveal>

            <Reveal delay={60}>
              <PortOutcomes items={scope.outcomes} />
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-10">
                <PortConditions port={port} line={line.key} />
              </div>
            </Reveal>

            <PortScopeList
              heading={`What we do at ${port.name}`}
              items={localScope}
            />

            <PortPlanning port={port} line={line.key} />

            {canonical && (
              <section className="mt-14">
                <Reveal>
                  <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                    Standard scope of work
                  </h2>
                  <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.62] text-slate-600">
                    Included as standard on every {scope.noun} attendance,
                    wherever the vessel is. Anything outside it is quoted
                    separately and flagged before mobilisation, never added
                    afterwards.
                  </p>
                </Reveal>
                <dl className="mt-8 divide-y divide-line-100 border-t border-line-200">
                  {canonical.service.scope.map((item, i) => (
                    <Reveal key={item.title} delay={i * 30}>
                      <div className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-8">
                        <dt className="font-display text-[17px] font-bold uppercase leading-tight text-ink-900">
                          {item.title}
                        </dt>
                        <dd className="text-[15px] leading-[1.62] text-slate-600 sm:col-span-2">
                          {item.body}
                        </dd>
                      </div>
                    </Reveal>
                  ))}
                </dl>
                <Reveal>
                  <Link
                    href={`/services/${line.categorySlug}/${scope.serviceSlug}`}
                    className="label-caps group mt-6 inline-flex items-center gap-2 text-blue-600"
                  >
                    Full {canonical.service.name} service details
                    <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                  </Link>
                </Reveal>
              </section>
            )}

            <PortDelivery port={port} steps={steps} />

            <Reveal>
              <div className="mt-14">
                <PortFacts port={port} />
              </div>
            </Reveal>

            <section className="mt-14">
              <Reveal>
                <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                  Frequently asked — {scope.titleStem} at {port.name}
                </h2>
                <div className="mt-6">
                  <FaqList faqs={faqs} />
                </div>
              </Reveal>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-[128px]">
              <EnquiryCard port={port} line={line} />
              <OtherScopesAtPort
                port={port}
                line={line}
                currentPrefix={scope.urlPrefix}
              />
              <NearbyPorts
                port={port}
                line={line}
                scope={scope}
                regionHubPath={`/${regionHubSlug(line, region)}`}
                regionLabel={region.portsLabel}
              />
              <OtherLinesAtPort port={port} current={line.key} />
              <div className="card p-6">
                <h2 className="label-caps text-[12px] text-slate-500">
                  Typically applied to
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {(canonical?.service.appliesTo ?? port.vesselTypes).map(
                    (item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] text-ink-700"
                      >
                        <span className="mt-2 size-1 shrink-0 bg-aqua-500" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <WhatsAppCard />
            </div>
          </aside>
        </div>
      </section>

      <CtaBand
        title={`${scope.name} at ${portLabel(port)}.`}
        description={`Tell us the vessel, her ETA at ${port.name} and the window. You get a scope, a crew size and an honest duration — usually the same working day.`}
      />
    </>
  );
}

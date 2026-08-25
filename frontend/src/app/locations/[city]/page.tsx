import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui";
import { ArrowIcon, PhoneIcon } from "@/components/icons";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { heroMediaFor } from "@/lib/service-media";
import { getOffice, offices, siteConfig, type Office } from "@/lib/site";
import { portLabel, linesFor } from "@/lib/ports/types";
import {
  getLine,
  getPort,
  getRegion,
  portHubSlug,
  regionHubSlug,
} from "@/lib/ports/registry";
import { BASE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";

/**
 * One page per operating base.
 *
 * Eight bases were advertised on /contact as a list of addresses and nothing
 * more — no page, no schema of their own, no local number, no link to the
 * ports they actually serve. For a service business with physical bases and
 * no local pack presence, that is the highest-return unglamorous work there
 * is: a LocalBusiness node per office, each on its own URL, each linked to
 * the port programme it works out to.
 *
 * ⚠️ NO COORDINATES ARE EMITTED. Inventing a lat/long is worse than omitting
 * one, because a wrong pin sends a superintendent to the wrong gate. Add them
 * from the Google Business Profile for each base once claimed — that profile,
 * not this page, is what earns a map pack listing.
 */

type Params = { params: Promise<{ city: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return offices.map((office) => ({ city: office.slug }));
}

function officeTitle(office: Office) {
  return office.head
    ? `Marine Services in ${office.city} — Head Office`
    : `Marine Services in ${office.city}`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city } = await params;
  const office = getOffice(city);
  if (!office) return { title: "Not found" };

  return buildMetadata({
    title: officeTitle(office),
    description: `Cleanship Marine Services at ${office.city}, ${office.country}. ${office.head ? "Registered head office." : "Operating base."} Hull, hold and tank cleaning crews and equipment held locally.`,
    path: `/locations/${office.slug}`,
    keywords: [
      `marine services ${office.city}`,
      `ship cleaning ${office.city}`,
      `hull cleaning ${office.city}`,
      `diving contractor ${office.city}`,
    ],
    image: {
      url: "/posters/underwater-hull-cleaning.jpg",
      alt: "Diver cleaning a vessel's underwater hull",
    },
  });
}

export default async function LocationPage({ params }: Params) {
  const { city } = await params;
  const office = getOffice(city);
  if (!office) notFound();

  const phone = siteConfig.phones[office.phone];
  const port = office.portSlug ? getPort(office.portSlug) : undefined;
  const region = office.regionSlug ? getRegion(office.regionSlug) : undefined;
  const lines = port ? linesFor(port).map(getLine) : [];

  const trail = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: office.city, path: `/locations/${office.slug}` },
  ];

  /* Some countries arrive as "Gujarat, India" — schema.org expects a country
     in addressCountry, so anything before the last comma becomes the region. */
  const hasRegion = office.country.includes(",");
  const address = {
    "@type": "PostalAddress",
    ...(office.street ? { streetAddress: office.street } : {}),
    addressLocality: office.city,
    ...(hasRegion
      ? {
          addressRegion: office.country
            .slice(0, office.country.lastIndexOf(","))
            .trim(),
          addressCountry: office.country
            .slice(office.country.lastIndexOf(",") + 1)
            .trim(),
        }
      : { addressCountry: office.country }),
  };

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${BASE_URL}/locations/${office.slug}#localbusiness`,
            name: `${siteConfig.legalName} — ${office.city}`,
            description: office.role,
            parentOrganization: { "@id": `${BASE_URL}/#organization` },
            url: `${BASE_URL}/locations/${office.slug}`,
            email: siteConfig.email,
            telephone: phone.href.replace("tel:", ""),
            address,
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
                opens: "10:00",
                closes: "18:00",
              },
            ],
            ...(region
              ? {
                  areaServed: region.ports.map((p) => ({
                    "@type": "Place",
                    name: `${portLabel(p)}, ${p.country}`,
                    identifier: p.unlocode,
                  })),
                }
              : {}),
          },
        ]}
      />

      <PageHero
        eyebrow={office.head ? "Head office" : "Operating base"}
        title={`Cleanship Marine Services — ${office.city}`}
        description={office.role}
        trail={trail}
        media={heroMediaFor("hull-cleaning", "underwater-hull-cleaning")}
      />

      <section className="bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-7">
            {/* office.role is the hero description; repeating it here put the
                same paragraph on the page twice. This section carries what the
                hero cannot: the contracting entity and the licence. */}
            <Reveal>
              <h2 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
                Working with this base
              </h2>
              <p className="mt-4 text-[16px] leading-[1.62] text-ink-700">
                Enquiries for {office.city} reach the same operations desk as
                every other base, manned around the clock. Give us the vessel,
                the berth and the window and you get a scope, a crew size and a
                duration we will stand behind.
              </p>
              {office.head && (
                <p className="mt-4 text-[16px] leading-[1.62] text-ink-700">
                  {siteConfig.legalName} is registered here under licence{" "}
                  <span className="tabular">{siteConfig.licence}</span>. It is
                  the contracting entity for every job on this site.
                </p>
              )}
            </Reveal>

            {port && lines.length > 0 && (
              <Reveal delay={60}>
                <section className="mt-12">
                  <h2 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
                    Services at {portLabel(port)}
                  </h2>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                    {lines.map((line) => (
                      <li key={line.key}>
                        <Link
                          href={`/${portHubSlug(port, line)}`}
                          className="card card-interactive group flex items-center justify-between gap-4 p-5"
                        >
                          <span>
                            <span className="block font-display text-[17px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                              {line.name}
                            </span>
                            <span className="mt-1 block text-[13px] text-slate-500">
                              {line.scopes.length} scopes
                            </span>
                          </span>
                          <ArrowIcon className="size-4 shrink-0 text-slate-300 transition-transform duration-[140ms] group-hover:translate-x-0.5 group-hover:text-blue-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {region && (
              <Reveal delay={80}>
                <section className="mt-12">
                  <h2 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
                    Ports worked from {office.city}
                  </h2>
                  <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.62] text-slate-600">
                    {region.regionNote}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                    {region.ports.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/${portHubSlug(p, getLine(linesFor(p)[0]))}`}
                          className="text-[14px] text-slate-600 underline decoration-line-200 underline-offset-4 transition-colors duration-[140ms] hover:text-blue-600 hover:decoration-blue-400"
                        >
                          {portLabel(p)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${regionHubSlug(getLine("hull-cleaning"), region)}`}
                    className="label-caps group mt-6 inline-flex items-center gap-2 text-blue-600"
                  >
                    All {region.portsLabel}
                    <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                  </Link>
                </section>
              </Reveal>
            )}

            <Reveal delay={100}>
              <section className="mt-12">
                <h2 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
                  Other bases
                </h2>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {offices
                    .filter((o) => o.slug !== office.slug)
                    .map((o) => (
                      <li key={o.slug}>
                        <Link
                          href={`/locations/${o.slug}`}
                          className="text-[14px] text-slate-600 underline decoration-line-200 underline-offset-4 transition-colors duration-[140ms] hover:text-blue-600 hover:decoration-blue-400"
                        >
                          {o.city}
                        </Link>
                      </li>
                    ))}
                </ul>
              </section>
            </Reveal>
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-[128px]">
              <div className="rule-accent-top border border-line-200 bg-paper p-7">
                <h2 className="font-display text-[20px] font-bold uppercase leading-tight text-ink-900">
                  {office.city}
                </h2>
                <address className="mt-5 not-italic">
                  <dl className="divide-y divide-line-200">
                    <div className="py-3">
                      <dt className="label-caps text-[11px] text-slate-500">
                        Address
                      </dt>
                      <dd className="mt-2 text-[15px] leading-[1.55] text-ink-700">
                        {office.street && (
                          <>
                            {office.street}
                            <br />
                          </>
                        )}
                        {office.city}
                        <br />
                        {office.country}
                      </dd>
                    </div>
                    <div className="py-3">
                      <dt className="label-caps text-[11px] text-slate-500">
                        Phone
                      </dt>
                      <dd className="mt-2">
                        <a
                          href={phone.href}
                          className="tabular text-[15px] text-blue-600"
                        >
                          {phone.number}
                        </a>
                        <span className="ml-2 text-[13px] text-slate-500">
                          ({phone.label} line)
                        </span>
                      </dd>
                    </div>
                    <div className="py-3">
                      <dt className="label-caps text-[11px] text-slate-500">
                        Email
                      </dt>
                      <dd className="mt-2">
                        <a
                          href={`mailto:${siteConfig.email}`}
                          className="text-[15px] text-blue-600"
                        >
                          {siteConfig.email}
                        </a>
                      </dd>
                    </div>
                    <div className="py-3">
                      <dt className="label-caps text-[11px] text-slate-500">
                        Hours
                      </dt>
                      <dd className="mt-2 text-[15px] leading-[1.55] text-ink-700">
                        {siteConfig.hours.office}
                        <br />
                        <span className="text-blue-600">
                          {siteConfig.hours.operations}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </address>

                <Button href="/contact" className="mt-6 w-full">
                  Get a quote
                </Button>
                <a
                  href={phone.href}
                  className="label-caps mt-3 flex h-11 w-full items-center justify-center gap-2 border border-blue-600 text-blue-600 transition-colors duration-[140ms] hover:bg-blue-50"
                >
                  <PhoneIcon className="size-4" />
                  <span className="tabular">{phone.number}</span>
                </a>
                <WhatsAppCta className="mt-3 w-full" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand
        title={`A vessel at ${office.city}?`}
        description="Tell us the vessel, the berth and the window. You get a scope, a crew size and an honest duration — usually the same working day."
      />
    </>
  );
}

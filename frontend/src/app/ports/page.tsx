import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { ArrowIcon } from "@/components/icons";
import { heroMediaFor } from "@/lib/service-media";
import { portLabel, linesFor } from "@/lib/ports/types";
import { brazilPorts } from "@/lib/ports/brazil";
import {
  getLine,
  portHubSlug,
  portLines,
  portsGrouped,
  portsWithLine,
  regionHubSlug,
  regions,
} from "@/lib/ports/registry";
import { BASE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";

/**
 * The crawl hub for the whole port network.
 *
 * Before this existed, several hundred port pages were discoverable only
 * through the XML sitemap and the footer. Sitemap inclusion gets a URL
 * crawled; internal links from a linked-to page are what tell Google it
 * matters. This page is linked from the main navigation for that reason —
 * a hub nobody links to is not a hub.
 */

const totalPorts = regions.reduce((n, r) => n + r.ports.length, 0);

export const metadata: Metadata = buildMetadata({
  title: "Ports We Cover",
  description: `Marine cleaning at ${totalPorts} ports across India, the UAE and Brazil. Hull, hold and tank cleaning with local conditions, approvals and waste disposal handled at each.`,
  path: "/ports",
  keywords: [
    "marine cleaning ports",
    "ship cleaning port coverage",
    "hull cleaning ports India UAE",
  ],
  image: {
    url: "/posters/underwater-hull-cleaning.jpg",
    alt: "Diver cleaning a vessel's underwater hull",
  },
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Ports", path: "/ports" },
];

export default function PortsHubPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Ports served by Cleanship Marine Services",
            numberOfItems: totalPorts,
            itemListElement: regions.flatMap((region) =>
              region.ports.map((port, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${portLabel(port)}, ${port.country}`,
                url: `${BASE_URL}/${portHubSlug(port, getLine(linesFor(port)[0]))}`,
              })),
            ),
          },
        ]}
      />

      <PageHero
        eyebrow="Coverage"
        title="Ports We Cover"
        description={`Every port where we hold gear, people or a working relationship — ${totalPorts} with full service pages, plus ${brazilPorts.length} in Brazil.`}
        trail={trail}
        media={heroMediaFor("hull-cleaning", "underwater-hull-cleaning")}
      />

      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <Reveal>
            <p className="max-w-[70ch] text-[19px] leading-[1.62] text-ink-900">
              Each port below has its own pages covering the local working
              conditions, the approving authority, the vessel traffic that calls
              there and every service line we run at it. Not every line runs at
              every port — a pure ore anchorage gets no tank cleaning page,
              because there would be nothing true to put on it.
            </p>
          </Reveal>

          {/* Line hubs, per region */}
          <section className="mt-12">
            <Reveal>
              <h2 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
                By service line
              </h2>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {regions.flatMap((region) =>
                portLines
                  .filter((line) => portsWithLine(line.key, region).length > 0)
                  .map((line) => (
                    <Reveal key={`${region.slug}-${line.key}`}>
                      <Link
                        href={`/${regionHubSlug(line, region)}`}
                        className="card card-interactive group flex items-center justify-between gap-4 p-5"
                      >
                        <span>
                          <span className="block font-display text-[17px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                            {line.name} in {region.name}
                          </span>
                          <span className="mt-1 block text-[13px] text-slate-500">
                            {portsWithLine(line.key, region).length} ports
                          </span>
                        </span>
                        <ArrowIcon className="size-4 shrink-0 text-slate-300 transition-transform duration-[140ms] group-hover:translate-x-0.5 group-hover:text-blue-600" />
                      </Link>
                    </Reveal>
                  )),
              )}
            </div>
          </section>

          {/* Every port, grouped */}
          {regions.map((region) => (
            <section key={region.slug} className="mt-16">
              <Reveal>
                <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                  {region.name}
                  <span className="tabular ml-4 text-[18px] text-blue-600">
                    {String(region.ports.length).padStart(2, "0")} ports
                  </span>
                </h2>
              </Reveal>

              <div className="mt-8 space-y-10">
                {portsGrouped(region).map((group) => (
                  <div key={group.state}>
                    <h3 className="label-caps border-b border-line-200 pb-3 text-[12px] text-slate-500">
                      {group.state}
                    </h3>
                    <ul className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                      {group.ports.map((port) => {
                        const lines = linesFor(port).map(getLine);
                        return (
                          <li key={port.slug}>
                            <Link
                              href={`/${portHubSlug(port, lines[0])}`}
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
                              {port.base && (
                                <span className="ml-2 text-blue-600">
                                  · Operating base
                                </span>
                              )}
                            </p>
                            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                              {lines.map((line) => (
                                <li key={line.key}>
                                  <Link
                                    href={`/${portHubSlug(port, line)}`}
                                    className="text-[12px] text-slate-500 underline decoration-line-200 underline-offset-4 transition-colors duration-[140ms] hover:text-blue-600 hover:decoration-blue-400"
                                  >
                                    {line.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Brazil — list-only coverage, stated as such */}
          <section className="mt-16">
            <Reveal>
              <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                Brazil
                <span className="tabular ml-4 text-[18px] text-blue-600">
                  {String(brazilPorts.length).padStart(2, "0")} ports
                </span>
              </h2>
              <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.62] text-slate-600">
                Hold cleaning coverage across the Brazilian coast, on one
                country page rather than per-port pages. We publish a port page
                where we can say something specific and true about the local
                conditions and the approving authority; that depth exists for
                India and the UAE today and is being built for Brazil.
              </p>
              <Link
                href="/hold-cleaning-in-brazil"
                className="label-caps group mt-5 inline-flex items-center gap-2 text-blue-600"
              >
                Hold cleaning in Brazil
                <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </section>
        </div>
      </section>

      <CtaBand
        title="Not seeing your port?"
        description="We work well beyond the ports listed here. Tell us the vessel, the port and the window — you get a straight answer on whether we can meet her."
      />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { ArrowIcon } from "@/components/icons";
import { HeroEnquiryForm } from "@/components/hero-enquiry-form";
import { heroMediaFor } from "@/lib/service-media";
import { heroImageFor } from "@/lib/stock-images";
import { brazilPorts } from "@/lib/ports/brazil";
import { getLine } from "@/lib/ports/registry";
import {
  BASE_URL,
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
} from "@/lib/seo";

/**
 * Brazil country page.
 *
 * Previously a 46-line page that canonicalised to /services/hold-cleaning/
 * shore-gang, which meant it could not rank for "hold cleaning Brazil" —
 * Google was told to show the service page instead. It now self-canonicalises
 * and carries content that earns it: the trades, the cleaning problems those
 * trades actually create, and the port list.
 *
 * It links to no per-port pages because there are none yet, and that is
 * deliberate — see the note at the top of lib/ports/brazil.ts.
 */

export const metadata: Metadata = buildMetadata({
  title: "Hold Cleaning in Brazil — 33 Ports",
  description:
    "Cargo hold cleaning at Brazilian ports. Shore gangs and riding crews for grain, soya, sugar and iron ore residues, worked to the next fixture's standard.",
  path: "/hold-cleaning-in-brazil",
  keywords: [
    "hold cleaning Brazil",
    "cargo hold cleaning Brazil",
    "hold cleaning Santos",
    "hold cleaning Paranagua",
    "grain hold cleaning Brazil",
    "riding crew Brazil",
  ],
  image: {
    url: "/images/bulk-carrier-berth.jpg",
    alt: "Bulk carrier alongside at a grain berth",
  },
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Hold Cleaning", path: "/services/hold-cleaning" },
  { name: "Brazil", path: "/hold-cleaning-in-brazil" },
];

const faqs = [
  {
    q: "Which Brazilian ports does Cleanship cover for hold cleaning?",
    a: `${brazilPorts.length} ports across the whole coast — the southern grain and container range at Santos, Paranaguá, Rio Grande, São Francisco do Sul and Itapoã; the iron ore and steel terminals at Tubarão, Ponta da Madeira, Praia Mole, Sepetiba and Itaguaí; and the northern and Amazon terminals at Itaqui, Barcarena, Vila do Conde, Santarém and Itacoatiara.`,
  },
  {
    q: "What makes hold cleaning in Brazil different?",
    a: "Two things. First, the trade: Brazil loads grain, soya and sugar in enormous volume, and those are food-grade fixtures with surveyor-attended inspections where a failure means the vessel sits. Second, the waiting: anchorage queues at the grain ports run long in the harvest season, and that waiting time is the single best cleaning window a bulk carrier gets — a gang put on board during it costs no schedule at all.",
  },
  {
    q: "Do you handle iron ore residue as well as grain?",
    a: "Yes, and they are opposite problems. Ore fines stain and pack into frames and tank-top margins and need chemical treatment and rinsing, not sweeping. Grain and soya are about dryness, absence of infestation and absence of any prior residue — a hold that is visually clean but damp will still fail. The sequence is built from the pair: what came out, and what is going in.",
  },
  {
    q: "Can a riding crew join in Brazil and clean on the passage?",
    a: "Yes, and on the long ballast legs out of Brazil it is usually the better answer. The crew embarks at the load or discharge port, works the holds at sea across a passage the vessel is making anyway, and disembarks at a nominated port — so the cleaning costs no port time. Visas, tickets and clearances are handled as part of the job.",
  },
  {
    q: "How are hold washings and residues disposed of at Brazilian ports?",
    a: "To MARPOL Annex V, through the reception route agreed with the port and terminal before the gang boards. Brazilian ports enforce this seriously and the documentation matters, so residues and washing water are tracked from hold to reception with a record the vessel keeps.",
  },
  {
    q: "Do you have per-port pages for Brazil?",
    a: "Not yet. We publish port pages where we can say something specific and true about the local conditions, the approving authority and the traffic — that exists for our Indian and UAE coverage today and is being built for Brazil. In the meantime, tell us the port and the fixture and we will answer directly rather than point you at a generic page.",
  },
];

export default function HoldCleaningInBrazilPage() {
  const line = getLine("hold-cleaning");

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${BASE_URL}/hold-cleaning-in-brazil#service`,
            name: "Hold Cleaning in Brazil",
            serviceType: "Cargo hold cleaning",
            description:
              "Cargo hold cleaning at Brazilian ports by shore gang and riding crew.",
            provider: { "@id": `${BASE_URL}/#organization` },
            url: `${BASE_URL}/hold-cleaning-in-brazil`,
            areaServed: brazilPorts.map((port) => ({
              "@type": "Place",
              name: `${port.name}, Brazil`,
              identifier: port.unlocode,
            })),
          },
          faqSchema(faqs),
        ]}
      />

      <PageHero
        eyebrow="Brazil coverage"
        title="Hold Cleaning in Brazil"
        description={`Shore gangs and riding crews at ${brazilPorts.length} Brazilian ports, from the southern grain range to the Amazon terminals.`}
        trail={trail}
        media={heroMediaFor("hold-cleaning")}
        image={heroImageFor("hold-cleaning")}
        aside={<HeroEnquiryForm serviceName="Hold cleaning in Brazil" />}
      />

      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-[19px] leading-[1.62] text-ink-900">
                Cleanship Marine cleans cargo holds at Brazilian ports — shore
                gangs alongside and at anchorage, and riding crews that finish
                the job on the passage out. Brazil is a hold cleaning market
                unlike any other in the fleet&apos;s trading pattern, and it is worth
                being specific about why.
              </p>
              <p className="mt-5 text-[16px] leading-[1.62] text-ink-700">
                The first reason is the cargo. Brazil loads grain, soya and
                sugar in volume, and those are food-grade fixtures inspected by
                a surveyor before loading starts. A hold that is visually clean
                but still damp, or that carries a trace of the last mineral
                cargo in the frames, fails — and a failed inspection at a
                Brazilian grain berth is not a delay measured in hours. The
                standard that matters is the one the next fixture demands, not
                the one the last one left behind.
              </p>
              <p className="mt-5 text-[16px] leading-[1.62] text-ink-700">
                The second is the waiting. Anchorage queues at the southern
                grain ports run long through the harvest, and at the ore
                terminals the loading sequence leaves real gaps. That waiting
                time is the best cleaning window a bulk carrier gets anywhere in
                its rotation — a gang put on board during it costs the vessel
                nothing in schedule, where the same work squeezed against a
                berth clock costs everything.
              </p>
              <p className="mt-5 text-[16px] leading-[1.62] text-ink-700">
                The third is the ballast leg. Voyages out of Brazil are long, so
                a riding crew embarked here has the passage time to do the holds
                properly and disembark at a nominated port with the vessel ready
                for inspection on arrival.
              </p>
            </Reveal>
          </div>

          {/* Scopes */}
          <section className="mt-16">
            <Reveal>
              <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                How we work it
              </h2>
            </Reveal>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {line.scopes.map((scope, i) => (
                <Reveal as="li" key={scope.urlPrefix} delay={i * 40}>
                  <Link
                    href={`/services/hold-cleaning/${scope.serviceSlug}`}
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
                Brazilian ports we cover
              </h2>
              <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.62] text-slate-600">
                {brazilPorts.length} ports, from the southern grain and
                container range through the ore and steel terminals to the
                Amazon river ports. Tell us the port and the fixture.
              </p>
            </Reveal>
            <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {brazilPorts.map((port) => (
                <li
                  key={port.unlocode}
                  className="border-b border-line-100 pb-3"
                >
                  <p className="font-display text-[16px] font-bold uppercase leading-tight text-ink-900">
                    {port.name}
                    <span className="tabular ml-2 text-[12px] font-normal text-slate-400">
                      {port.unlocode}
                    </span>
                  </p>
                  {port.note && (
                    <p className="mt-1 text-[13px] leading-[1.5] text-slate-500">
                      {port.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section className="mt-16 max-w-4xl">
            <Reveal>
              <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
                Frequently asked — Brazil
              </h2>
              <div className="mt-6">
                <FaqList faqs={faqs} />
              </div>
            </Reveal>
          </section>
        </div>
      </section>

      <CtaBand
        title="Hold cleaning at a Brazilian port."
        description="Tell us the vessel, the port and the fixture. You get a scope, a crew size and an honest duration — usually the same working day."
      />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { StatsBand } from "@/components/stats";
import { PhotoOverlay } from "@/components/photo-overlay";
import { HeroEnquiryForm } from "@/components/hero-enquiry-form";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { Button, CheckList, SectionHeading } from "@/components/ui";
import {
  ArrowIcon,
  BrushIcon,
  CertificateIcon,
  CheckIcon,
  ClipboardIcon,
  ClockIcon,
  DiverIcon,
  FuelDropIcon,
  GaugeIcon,
  GlobeIcon,
  HullIcon,
  LeafIcon,
  NdtIcon,
  PhoneIcon,
  PinIcon,
  PropellerIcon,
  ShieldIcon,
  ThrusterIcon,
  UsersIcon,
  VesselIcon,
  VideoIcon,
  WavesIcon,
  WhatsAppIcon,
  WrenchIcon,
} from "@/components/icons";
import { getCategory, getService, type Faq } from "@/lib/services";
import { heroMediaFor } from "@/lib/service-media";
import { categoryCoverage, offices, siteConfig } from "@/lib/site";
import { getLine, portsWithLine, regionHubSlug, regions } from "@/lib/ports/registry";
import { buildMetadata } from "@/lib/seo";

/**
 * Paid-campaign landing page for underwater hull cleaning.
 *
 * WHAT THIS PAGE IS FOR
 *
 * It is the destination for Meta, Google and LinkedIn ad traffic — people who
 * arrived on a promise about fuel and dry-dock avoidance, not people who
 * navigated the site. So it is built around one conversion: the quote form,
 * which is above the fold on desktop, one tap away on mobile, and repeated at
 * the foot of every major section. Everything the canonical service pages say
 * about the work is here too, because a visitor who wants the detail before
 * enquiring should never have to leave the page to find it.
 *
 * WHY IT IS NOINDEX
 *
 * Its content overlaps /services/hull-cleaning and
 * /services/hull-cleaning/underwater-hull-cleaning almost completely. Indexed,
 * it would compete with both for the same head terms and split the signal
 * three ways — the exact cannibalisation the port programme was restructured
 * to avoid. `noindex, follow` keeps it out of the index while still passing
 * the internal links it carries. It is deliberately NOT in sitemap.ts, since
 * listing a noindex URL contradicts the directive on the page.
 *
 * Flip INDEXABLE to true and add the URL to sitemap.ts if it is ever meant to
 * rank on its own — but then the copy has to be rewritten to stop duplicating
 * the service pages, or all three lose.
 */
const INDEXABLE = false;

/**
 * WHY IT LIVES UNDER /lp/
 *
 * Two reasons. `/underwater-hull-cleaning` is already a permanent redirect to
 * the nested service page (see next.config.ts — it is an old WordPress URL
 * carrying real equity), so that slug is not available and must not be taken
 * back. And a shared prefix makes paid traffic separable in GA4 with one
 * "page path starts with /lp/" filter, instead of maintaining a list of
 * campaign URLs by hand. Every future ad landing page belongs here too.
 */
const PATH = "/lp/underwater-hull-cleaning";

/** Tags the enquiry in the inbox so campaign leads are separable from organic. */
const LEAD_SOURCE = "Underwater Hull Cleaning — campaign landing page";

export const metadata: Metadata = buildMetadata({
  title: "Underwater Hull Cleaning — Get a Quote",
  description:
    "In-water hull cleaning by commercial divers. No dry dock, no off-hire — coating-safe fouling removal at anchorage or alongside, with video evidence. Get a quote.",
  path: PATH,
  keywords: [
    "underwater hull cleaning",
    "in water hull cleaning",
    "ship hull cleaning service",
    "hull fouling removal",
    "propeller polishing",
    "diver hull cleaning",
  ],
  image: {
    url: "/posters/underwater-hull-cleaning.jpg",
    alt: "Diver cleaning marine growth from a vessel's underwater hull",
  },
  noIndex: !INDEXABLE,
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Underwater Hull Cleaning", path: PATH },
];

/* -------------------------------------------------------------------- */
/* Page copy                                                             */
/*                                                                       */
/* Everything factual is pulled from lib/services and lib/site at render */
/* time rather than retyped, so this page cannot drift away from the     */
/* canonical service pages it advertises. Only the campaign framing —    */
/* the cost-of-fouling panel, the trust strip and the section headings — */
/* is written here.                                                      */
/* -------------------------------------------------------------------- */

const trustPoints = [
  { icon: HullIcon, label: "No dry dock, no off-hire" },
  { icon: ShieldIcon, label: "Coating-safe method" },
  { icon: VideoIcon, label: "Before-and-after video" },
  { icon: ClockIcon, label: "24/7 operations desk" },
];

const costOfFouling = [
  {
    icon: FuelDropIcon,
    title: "Fuel burn climbs quietly",
    body: "A moderate layer of slime and barnacle growth can add double-digit percentages to fuel consumption, and it accumulates steadily between dry dockings without ever producing a defect report.",
  },
  {
    icon: GaugeIcon,
    title: "Speed and schedule slip",
    body: "Drag costs you speed at the same power, or power at the same speed. Either way the main engine works harder to hold a schedule that was fixed on a clean hull.",
  },
  {
    icon: LeafIcon,
    title: "Carbon intensity follows fuel",
    body: "Every extra tonne burned is extra CO₂ against a carbon intensity figure that is now reported rather than internal. A fouled hull shows up in that number long before anyone calls it a defect.",
  },
];

/** Icons for the five scope items on the underwater hull cleaning service. */
const scopeIcons = [NdtIcon, BrushIcon, WrenchIcon, WavesIcon, VideoIcon];

/** Icons for the four process steps, in the order the service declares them. */
const processIcons = [ClipboardIcon, ShieldIcon, DiverIcon, VideoIcon];

/** Icons for the five scopes in the hull cleaning line, keyed by service slug. */
const serviceIcons: Record<string, (p: { className?: string }) => React.ReactElement> = {
  "underwater-hull-cleaning": HullIcon,
  "thruster-cleaning-polishing": ThrusterIcon,
  "propeller-super-polishing": PropellerIcon,
  "in-water-class-survey": NdtIcon,
  uwild: CertificateIcon,
};

const whyCleanship = [
  "Commercial dive teams and equipment held at eight operating bases, not mobilised from a third country when you call",
  "Brush hardness, tooling and working pressure selected against your antifouling coating and its remaining service life",
  "Port authority diving permission and environmental clearance obtained by us, not left to the agent",
  "Work carried out alongside or at anchorage, day or night, with the vessel afloat and on hire throughout",
  "Surface-supervised diving with continuous diver communications and live video",
  "A completion report with underwater video and stills, plus coating and anode condition, issued on the job",
  "The same mobilisation can take in propeller polishing, thruster work and a class-approved in-water survey",
];

const plate =
  "flex size-11 shrink-0 items-center justify-center rounded-xs bg-blue-50 text-blue-600";
const plateOnNavy =
  "flex size-11 shrink-0 items-center justify-center rounded-xs bg-white/10 text-aqua-200";

export default function UnderwaterHullCleaningLandingPage() {
  const category = getCategory("hull-cleaning");
  const found = getService("hull-cleaning", "underwater-hull-cleaning");

  /* Both are compile-time constants in lib/services; the guard exists so a
     future rename fails loudly here instead of rendering an empty page. */
  if (!category || !found) notFound();
  const { service } = found;

  const line = getLine("hull-cleaning");
  const hullPorts = portsWithLine("hull-cleaning");
  const coverage = categoryCoverage["hull-cleaning"];

  /* Category FAQs first — they answer the objections an ad click arrives
     with — then the service FAQs, deduplicated by question. */
  const faqs: Faq[] = [...category.faqs, ...service.faqs].filter(
    (faq, i, all) => all.findIndex((f) => f.q === faq.q) === i,
  );

  const stats = [
    { value: hullPorts.length, label: "Ports with published coverage" },
    { value: offices.length, label: "Operating bases" },
    { value: 24, suffix: "/7", label: "Operations desk manned" },
    { value: category.services.length, label: "Underwater scopes" },
  ];

  return (
    /* .lp-root is read by globals.css, which hides the floating WhatsApp
       button below lg so it cannot sit on top of the sticky CTA bar. */
    <div className="lp-root pb-[72px] lg:pb-0">
      <PageHero
        eyebrow="In-water hull cleaning"
        title="Underwater Hull Cleaning"
        description="Commercial dive teams remove hull fouling with the vessel afloat and on hire — at anchorage or alongside, day or night. The fuel saving starts the moment the divers surface."
        trail={trail}
        media={heroMediaFor("hull-cleaning", "underwater-hull-cleaning")}
        aside={
          <div id="quote" className="scroll-mt-[88px]">
            <HeroEnquiryForm serviceName={LEAD_SOURCE} />
          </div>
        }
      >
        <ul className="mt-7 grid max-w-xl gap-x-6 gap-y-3 sm:grid-cols-2">
          {trustPoints.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xs bg-white/10 text-aqua-200">
                <Icon className="size-[18px]" />
              </span>
              <span className="text-[14px] leading-[1.4] text-white/80">
                {label}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          {/* On desktop the form is already beside this copy, so the jump
              link would scroll to something the visitor can see. On mobile
              the form sits below the fold and this is the fastest route to
              it. */}
          <a
            href="#quote"
            className="label-caps group inline-flex h-11 items-center justify-center gap-2.5 bg-aqua-500 px-6 text-abyss-950 transition-colors duration-[140ms] hover:bg-aqua-400 lg:hidden"
          >
            Get a quote
            <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
          </a>
          <WhatsAppCta />
          <a
            href={siteConfig.phones[0].href}
            className="label-caps inline-flex h-11 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap border border-white/40 px-6 text-white transition-colors duration-[140ms] hover:border-aqua-500 hover:bg-white/10"
          >
            <PhoneIcon className="size-4" />
            <span className="tabular">{siteConfig.phones[0].number}</span>
          </a>
        </div>
      </PageHero>

      {/* ---------- Proof strip ---------- */}
      <section className="bg-white">
        <div className="container-page py-12 lg:py-16">
          <StatsBand stats={stats} />
        </div>
      </section>

      {/* ---------- The cost of fouling ---------- */}
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Why it matters"
              title="Hull fouling is the quietest cost on the P&amp;L"
              description="It never produces a defect report, never triggers an alarm and never appears on a work list. It simply takes a percentage of every tonne of fuel you burn, and takes a little more each week."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {costOfFouling.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="card flex h-full flex-col p-7">
                  <span className={plate}>
                    <Icon className="size-[22px]" />
                  </span>
                  <h3 className="mt-5 font-display text-[20px] font-bold uppercase leading-tight text-ink-900">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.62] text-ink-700">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="rule-accent-left mt-10 grid gap-8 border-y border-r border-line-200 bg-white p-8 lg:grid-cols-2 lg:p-10">
              {service.intro.map((paragraph, i) => (
                <p key={i} className="text-[16px] leading-[1.62] text-ink-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- What the job includes ---------- */}
      <section className="bg-white">
        <div className="container-page py-16 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Scope of work"
              title="What an underwater hull clean includes"
              description="Every job is quoted against the fouling actually found, not a menu. This is the full scope a standard attendance covers."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.scope.map((item, i) => {
              const Icon = scopeIcons[i] ?? CheckIcon;
              return (
                <Reveal key={item.title} delay={i * 50}>
                  <div className="card flex h-full flex-col p-7">
                    <span className={plate}>
                      <Icon className="size-[22px]" />
                    </span>
                    <h3 className="mt-5 font-display text-[19px] font-bold uppercase leading-tight text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.6] text-ink-700">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}

            <Reveal delay={service.scope.length * 50}>
              <div className="rule-accent-top flex h-full flex-col justify-between border border-line-200 bg-navy-900 p-7">
                <div>
                  <span className={plateOnNavy}>
                    <ClockIcon className="size-[22px]" />
                  </span>
                  <h3 className="mt-5 font-display text-[19px] font-bold uppercase leading-tight text-white">
                    Tell us the vessel
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-white/72">
                    Send the vessel, the port and the window. You get a scope, a
                    crew size and an honest duration — usually the same working
                    day.
                  </p>
                </div>
                <a
                  href="#quote"
                  className="label-caps group mt-6 inline-flex h-11 items-center justify-center gap-2.5 bg-aqua-500 px-6 text-abyss-950 transition-colors duration-[140ms] hover:bg-aqua-400"
                >
                  Get a quote
                  <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- How a job runs ---------- */}
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="How it runs"
              title="From enquiry to completion report"
              description="Four steps, in this order, every time. The permits are ours to obtain and the safety case is agreed with the master before a diver enters the water."
            />
          </Reveal>

          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, i) => {
              const Icon = processIcons[i] ?? CheckIcon;
              return (
                <Reveal as="li" key={step.title} delay={i * 60}>
                  <div className="card flex h-full flex-col p-7">
                    <div className="flex items-center justify-between gap-4">
                      <span className={plate}>
                        <Icon className="size-[22px]" />
                      </span>
                      <span className="num-index text-[26px] text-slate-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-[18px] font-bold uppercase leading-tight text-ink-900">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.6] text-ink-700">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------- The full underwater scope ---------- */}
      <section className="bg-white">
        <div className="container-page py-16 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="One mobilisation"
              title="Everything underwater, on the same attendance"
              description="The dive team that cleans the hull carries out the propeller, thruster and survey work too. Combining them is cheaper than calling anyone back."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.services.map((item, i) => {
              const Icon = serviceIcons[item.slug] ?? HullIcon;
              return (
                <Reveal key={item.slug} delay={i * 50}>
                  <Link
                    href={`/services/${category.slug}/${item.slug}`}
                    className="card card-interactive group flex h-full flex-col p-7"
                  >
                    <span className={plate}>
                      <Icon className="size-[22px]" />
                    </span>
                    <h3 className="mt-5 font-display text-[19px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.5] text-aqua-600">
                      {item.tagline}
                    </p>
                    <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-ink-700">
                      {item.summary}
                    </p>
                    <span className="label-caps mt-5 inline-flex items-center gap-2 text-blue-600">
                      Service details
                      <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Why Cleanship ---------- */}
      <section className="on-navy relative isolate overflow-hidden bg-navy-800">
        <PhotoOverlay image={{ src: "/posters/underwater-hull-cleaning.jpg", alt: "", sourceUrl: "" }} />
        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Why operators call us"
                title="A dive contractor, not a broker"
                description="Crews, compressors and brush carts are ours and are held in country. Nobody is subcontracting your hull to whoever answered the phone at the port."
                onNavy
              />
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#quote" variant="light">
                  Get a quote
                </Button>
                <WhatsAppCta variant="onNavy" />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={60}>
              <CheckList items={whyCleanship} onNavy />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Vessels and coverage ---------- */}
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  eyebrow="Who we work for"
                  title="Vessels we clean"
                />
              </Reveal>
              <ul className="mt-8 space-y-3">
                {service.appliesTo.map((item, i) => (
                  <Reveal as="li" key={item} delay={i * 40}>
                    <div className="flex items-center gap-3.5 border border-line-200 bg-white px-5 py-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xs bg-blue-50 text-blue-600">
                        <VesselIcon className="size-5" />
                      </span>
                      <span className="text-[15px] leading-[1.5] text-ink-900">
                        {item}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <Reveal>
                <SectionHeading
                  eyebrow="Where we work"
                  title="Divers within a day of your berth"
                  description={`${hullPorts.length} ports carry a published hull cleaning page of their own, covering local conditions, the approving authority and the traffic that calls there.`}
                />
              </Reveal>

              <Reveal delay={60}>
                <div className="mt-8 border border-line-200 bg-white p-7">
                  <div className="flex items-center gap-3">
                    <span className={plate}>
                      <GlobeIcon className="size-[22px]" />
                    </span>
                    <h3 className="font-display text-[19px] font-bold uppercase leading-tight text-ink-900">
                      Coverage
                    </h3>
                  </div>
                  <p className="mt-4 text-[15px] leading-[1.62] text-ink-700">
                    {coverage?.areas.join(" · ")}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                    {regions.map((region) => {
                      const ports = portsWithLine("hull-cleaning", region);
                      if (ports.length === 0) return null;
                      return (
                        <li key={region.slug}>
                          <Link
                            href={`/${regionHubSlug(line, region)}`}
                            className="label-caps inline-flex items-center gap-2 border border-line-200 px-3 py-2 text-[11px] text-blue-600 transition-colors duration-[140ms] hover:border-blue-400 hover:bg-blue-50"
                          >
                            {region.name}
                            <span className="tabular text-slate-400">
                              {ports.length}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="mt-6 border border-line-200 bg-white p-7">
                  <div className="flex items-center gap-3">
                    <span className={plate}>
                      <UsersIcon className="size-[22px]" />
                    </span>
                    <h3 className="font-display text-[19px] font-bold uppercase leading-tight text-ink-900">
                      Operating bases
                    </h3>
                  </div>
                  <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {offices.map((office) => (
                      <li key={office.slug} className="flex items-start gap-2.5">
                        <PinIcon className="mt-0.5 size-4 shrink-0 text-aqua-600" />
                        <span className="text-[14px] leading-[1.5] text-ink-700">
                          {office.city}
                          <span className="text-slate-500">
                            {" "}
                            — {office.country}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Questions"
                title="Underwater hull cleaning — frequently asked"
                description="If the answer you need is not here, ask the operations desk directly. It is manned around the clock."
              />
            </Reveal>
            <Reveal delay={60}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#quote">Get a quote</Button>
                <a
                  href={siteConfig.phones[0].href}
                  className="label-caps inline-flex h-11 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap border border-line-200 px-6 text-ink-900 transition-colors duration-[140ms] hover:border-blue-400 hover:bg-blue-50"
                >
                  <PhoneIcon className="size-4" />
                  <span className="tabular">{siteConfig.phones[0].number}</span>
                </a>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <FaqList faqs={faqs} />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        title="Get your hull assessed."
        description="Send the vessel, the port and the window. You get a scope, a crew size and an honest duration — usually the same working day."
      />

      {/* ---------- Sticky conversion bar (mobile) ----------
          No JavaScript: three anchors in a fixed bar. globals.css hides the
          floating WhatsApp button below lg so the two never overlap. */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-abyss-950/95 px-3 py-2.5 backdrop-blur lg:hidden">
        <div
          className="flex items-center gap-2"
          style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <a
            href="#quote"
            className="label-caps inline-flex h-11 flex-1 items-center justify-center gap-2 bg-aqua-500 px-4 text-abyss-950"
          >
            Get a quote
          </a>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message Cleanship on WhatsApp"
            className="inline-flex size-11 shrink-0 items-center justify-center bg-[#25D366] text-[#04361a]"
          >
            <WhatsAppIcon className="size-5" />
          </a>
          <a
            href={siteConfig.phones[0].href}
            aria-label={`Call the operations desk on ${siteConfig.phones[0].number}`}
            className="inline-flex size-11 shrink-0 items-center justify-center border border-white/35 text-white"
          >
            <PhoneIcon className="size-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

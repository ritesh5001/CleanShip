import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { CategoryCard } from "@/components/service-cards";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq";
import { StatsBand } from "@/components/stats";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { Button, CheckList, SectionHeading } from "@/components/ui";
import {
  ArrowIcon,
  ClipboardIcon,
  GlobeIcon,
  LeafIcon,
  ShieldIcon,
} from "@/components/icons";
import { serviceCategories } from "@/lib/services";
import { serviceAreas, siteConfig } from "@/lib/site";
import { buildMetadata, faqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title:
    "Hold, Tank & Hull Cleaning Specialists | Cleanship Marine Services",
  description: siteConfig.shortDescription,
  path: "/",
  keywords: [
    "hold cleaning services",
    "tank cleaning company UAE",
    "underwater hull cleaning",
    "marine cleaning Ajman",
    "riding crew hold cleaning",
    "propeller polishing UAE",
  ],
});

const differentiators = [
  {
    Icon: ShieldIcon,
    title: "Safety that is not negotiable",
    body: "Enclosed-space entry, work at height and diving operations all run under written procedures with continuous monitoring and a manned rescue standby. When a space cannot be made safe, we stop and say so.",
  },
  {
    Icon: ClipboardIcon,
    title: "Documented, not just done",
    body: "Every job closes with a photographic report, disposal manifests and — where relevant — measurement records and class-acceptable documentation. Your superintendent gets evidence, not assurances.",
  },
  {
    Icon: LeafIcon,
    title: "Eco-compliant by default",
    body: "Biodegradable, marine-approved chemicals, MARPOL Annex V residue handling and debris capture where the port requires it. Compliance is designed into the method rather than bolted on.",
  },
  {
    Icon: GlobeIcon,
    title: "Mobilised where you trade",
    body: "Core coverage across the UAE and the Gulf, with riding crews and specialist teams that travel to the vessel wherever the fixture takes it.",
  },
];

const process = [
  {
    step: "01",
    title: "Tell us the vessel and the window",
    body: "Vessel type, previous and next cargo, port, and the hours you actually have. The more precise the brief, the more honest the plan.",
  },
  {
    step: "02",
    title: "We scope it properly",
    body: "You get a method statement, crew size, equipment list and a realistic duration — including what we think will not fit in the window.",
  },
  {
    step: "03",
    title: "Certified crews mobilise",
    body: "Documentation, permits and port approvals are handled by us. The team boards with its own equipment, chemicals and PPE.",
  },
  {
    step: "04",
    title: "Inspection and handover",
    body: "We attend the inspection, rectify observations on the spot, and close out with a photographic report and disposal documentation.",
  },
];

const stats = [
  { value: 300, suffix: "+", label: "Clients served" },
  { value: 1200, suffix: "+", label: "Holds cleaned" },
  { value: 18, suffix: "+", label: "Ports covered" },
  { value: 24, suffix: "/7", label: "Operations desk" },
];

/** Homepage FAQs — chosen for the questions people actually search. */
const homeFaqs = [
  {
    q: "What does Cleanship do?",
    a: "Cleanship Marine Services is a marine cleaning and support contractor. We deliver cargo hold cleaning, tank cleaning, underwater hull cleaning and propeller polishing, offshore support services, and NDT inspection with repair, blasting and painting — for bulk carriers, tankers, container ships and offshore vessels.",
  },
  {
    q: "Where are you based and where do you operate?",
    a: `We are based at ${siteConfig.address.full}, and operate across the UAE and wider Gulf including Fujairah, Khor Fakkan, Jebel Ali, Sharjah and Abu Dhabi. Riding crews and specialist teams travel worldwide to join vessels wherever the fixture requires.`,
  },
  {
    q: "How quickly can you mobilise?",
    a: "In our core UAE ports we typically mobilise a shore gang within 12 to 24 hours of firm nomination. Riding crews and offshore teams need longer because of documentation, visas and flag-state approvals, and we will give you a realistic date rather than an optimistic one.",
  },
  {
    q: "Do you provide the equipment and chemicals?",
    a: "Yes. Our teams arrive self-sufficient — high-pressure units, chemicals with current safety data sheets, lighting, access equipment and PPE. Nothing is drawn from the ship's stores or the crew's working hours.",
  },
  {
    q: "Can you handle inspection and repair in the same mobilisation?",
    a: "Yes, and it is usually faster and cheaper that way. Our NDT technicians, riding fabricators and coating teams work together, so a defect can be found, quantified, repaired and re-protected without waiting for a second contractor to mobilise.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd schema={faqSchema(homeFaqs)} />

      <Hero />

      {/* ---------- Capability marquee ---------- */}
      <section
        aria-label="Capabilities at a glance"
        className="border-y border-white/8 bg-abyss-900/40 py-5"
      >
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
            {/* Duplicated once so the -50% translation loops seamlessly. */}
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-10">
                {[
                  "Grain clean holds",
                  "DPP & CPP tanks",
                  "Propeller super polishing",
                  "UWILD & in-water survey",
                  "IRATA rope access",
                  "Riding crews & squads",
                  "Hydroblasting to WJ-2",
                  "Class-approved NDT",
                  "Offshore support",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex shrink-0 items-center gap-3 text-sm font-medium text-abyss-300"
                  >
                    <span className="size-1.5 rounded-full bg-aqua-400" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section id="services" className="py-20 lg:py-28">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Our services"
                title="Comprehensive marine solutions, under one contractor"
                description="Five service lines that cover a vessel from the tank top to the propeller boss — so a single mobilisation can close out work that would otherwise need four separate suppliers."
              />
              <Link
                href="/services"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-aqua-300"
              >
                View all services
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category, i) => (
              <CategoryCard key={category.slug} category={category} index={i} />
            ))}

            {/* Contact card completing the grid */}
            <Reveal delay={serviceCategories.length * 80} className="h-full">
              <div className="flex h-full flex-col justify-between rounded-3xl border border-aqua-400/25 bg-gradient-to-br from-aqua-600/20 to-abyss-900/60 p-7">
                <div>
                  <h3 className="text-xl text-white">
                    Not sure which scope you need?
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-abyss-200">
                    Send us the vessel, the previous cargo and the port. We will
                    tell you what the job actually requires — including when it
                    is less than you were expecting.
                  </p>
                </div>
                <Button href="/contact" className="mt-6 w-full">
                  Talk to operations
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- About / differentiators ---------- */}
      <section className="relative overflow-hidden border-y border-white/8 bg-abyss-900/30 py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/3 size-[30rem] rounded-full bg-aqua-500/8 blur-[120px]"
        />
        <div className="container-page relative">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  eyebrow="About Cleanship"
                  title="Why operators keep coming back"
                  description="We are a hold and tank cleaning specialist first. Everything else we do grew out of what our clients kept asking us to solve on the same mobilisation."
                />
                <CheckList
                  className="mt-8"
                  items={[
                    "Experienced marine cleaning professionals",
                    "IMO and port-compliant procedures",
                    "Eco-friendly cleaning solutions",
                    "Self-sufficient crews and equipment",
                  ]}
                />
                <div className="mt-9">
                  <Button href="/about" variant="ghost">
                    More about us
                  </Button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-5 sm:grid-cols-2">
                {differentiators.map(({ Icon, title, body }, i) => (
                  <Reveal key={title} delay={i * 90} className="h-full">
                    <div className="card-hover h-full rounded-2xl border border-white/10 bg-abyss-950/50 p-6">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-aqua-400/10 text-aqua-300 ring-1 ring-aqua-400/20">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="mt-5 text-base text-white">{title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-abyss-300">
                        {body}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="py-20 lg:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title="From enquiry to sign-off, in four steps"
              description="No layers, no account managers relaying messages. You speak to the people who will plan and run the job."
              align="center"
            />
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, i) => (
              <Reveal key={item.step} delay={i * 100}>
                <div className="relative">
                  {/* Connector line between steps on wide screens */}
                  {i < process.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute left-14 top-6 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-aqua-400/40 to-transparent lg:block"
                    />
                  )}
                  <span className="relative flex size-12 items-center justify-center rounded-2xl border border-aqua-400/30 bg-abyss-950 font-display text-sm font-semibold text-aqua-300">
                    {item.step}
                  </span>
                  <h3 className="mt-6 text-lg text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-abyss-300">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="pb-20 lg:pb-28">
        <div className="container-page">
          <Reveal>
            <StatsBand stats={stats} />
            <p className="mt-4 text-center text-xs text-abyss-500">
              Figures are indicative of current operating scale — replace with
              your audited numbers before launch.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Coverage ---------- */}
      <section className="border-y border-white/8 bg-abyss-900/30 py-20 lg:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Coverage"
              title="Where we mobilise"
              description="Core coverage across the UAE and the Gulf, with crews that travel to join vessels worldwide."
              align="center"
            />
          </Reveal>
          <Reveal delay={120}>
            <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-2.5">
              {serviceAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-abyss-200 transition hover:border-aqua-400/40 hover:text-aqua-300"
                >
                  {area}
                </li>
              ))}
              <li className="rounded-full border border-aqua-400/30 bg-aqua-400/10 px-4 py-2 text-sm text-aqua-300">
                + worldwide by arrangement
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="py-20 lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Questions"
                title="The things operators ask us first"
                description="If your question is not here, the operations desk will answer it directly — no sales script."
              />
              <div className="mt-8">
                <Button href="/contact" variant="ghost">
                  Ask us anything
                </Button>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={100}>
              <FaqList faqs={homeFaqs} />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

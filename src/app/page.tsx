import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { CategoryCard } from "@/components/service-cards";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq";
import { StatsBand } from "@/components/stats";
import { Reveal } from "@/components/reveal";
import { StaggerGroup } from "@/components/motion/scroll-reveal";
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
  title: "Hold, Tank & Hull Cleaning Specialists | Cleanship Marine Services",
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
    body: "Enclosed-space entry, work at height and diving operations run under written procedures with continuous monitoring and a manned rescue standby. When a space cannot be made safe, we stop and say so.",
  },
  {
    Icon: ClipboardIcon,
    title: "Documented, not just done",
    body: "Every job closes with a photographic report, disposal manifests and, where relevant, measurement records and class-acceptable documentation. Your superintendent gets evidence, not assurances.",
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
    title: "Tell us the vessel and the window",
    body: "Vessel type, previous and next cargo, port, and the hours you actually have. The more precise the brief, the more honest the plan.",
  },
  {
    title: "We scope it properly",
    body: "You get a method statement, crew size, equipment list and a realistic duration — including what we think will not fit in the window.",
  },
  {
    title: "Certified crews mobilise",
    body: "Documentation, permits and port approvals are handled by us. The team boards with its own equipment, chemicals and PPE.",
  },
  {
    title: "Inspection and handover",
    body: "We attend the inspection, rectify observations on the spot, and close out with a photographic report and disposal documentation.",
  },
];

const stats = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 300, suffix: "+", label: "Clients" },
  { value: 100, suffix: "+", label: "Project Done" },
  { value: 10, suffix: "+", label: "Team Member" },
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

      {/* ---------- Counters ---------- */}
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-20">
          <StatsBand stats={stats} />
          <p className="mt-4 text-[13px] text-slate-400">
            Figures are indicative of current operating scale — replace with
            audited numbers before launch.
          </p>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section id="services" className="bg-white">
        <div className="container-page py-20 lg:py-24">
          <Reveal>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Our Services"
                title="Comprehensive marine solutions"
                description="Five service lines covering a vessel from the tank top to the propeller boss — so a single mobilisation can close out work that would otherwise need four separate suppliers."
              />
              <Link
                href="/services"
                className="label-caps group inline-flex shrink-0 items-center gap-2 text-blue-600"
              >
                View more services
                <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category, i) => (
              <CategoryCard key={category.slug} category={category} index={i} />
            ))}

            <div data-stagger className="h-full">
              <div className="on-navy rule-accent-top flex h-full flex-col justify-between bg-navy-800 p-6 text-white">
                <div>
                  <h3 className="font-display text-[22px] font-bold uppercase leading-tight">
                    Not sure which scope you need?
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-white/72">
                    Send us the vessel, the previous cargo and the port. We tell
                    you what the job actually requires — including when it is
                    less than you were expecting.
                  </p>
                </div>
                <div className="mt-8">
                  <Button href="/contact" variant="light" className="w-full">
                    Contact us
                  </Button>
                </div>
              </div>
            </div>
          </StaggerGroup>
        </div>
      </section>

      {/* ---------- About / differentiators ---------- */}
      <section className="bg-paper">
        <div className="container-page py-20 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <SectionHeading
                  eyebrow="About Cleanship"
                  title="Why will you choose our services?"
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
                  <Button href="/about" variant="outline">
                    Read more
                  </Button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-6 sm:grid-cols-2">
                {differentiators.map(({ Icon, title, body }, i) => (
                  <Reveal key={title} delay={i * 60} className="h-full">
                    <div className="card h-full p-6">
                      <span className="flex size-12 items-center justify-center bg-blue-50 text-blue-600">
                        <Icon className="size-[26px]" />
                      </span>
                      <h3 className="mt-5 font-display text-[19px] font-bold uppercase leading-tight text-ink-900">
                        {title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-[1.6] text-slate-600">
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
      <section className="bg-white">
        <div className="container-page py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="How We Work"
              title="From enquiry to sign-off"
              description="No layers, no account managers relaying messages. You speak to the people who plan and run the job."
              align="center"
            />
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="rule-accent-top pt-6">
                  <span className="tabular text-[13px] text-blue-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-[19px] font-bold uppercase leading-tight text-ink-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-slate-600">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Coverage ---------- */}
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Coverage"
              title="Where we mobilise"
              description="Core coverage across the UAE and the Gulf, with crews that travel to join vessels worldwide."
              align="center"
            />
          </Reveal>
          <Reveal delay={80}>
            <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-2">
              {serviceAreas.map((area) => (
                <li
                  key={area}
                  className="border border-line-200 bg-white px-4 py-2 text-[14px] text-ink-700 transition-colors duration-[140ms] hover:border-blue-400 hover:text-blue-600"
                >
                  {area}
                </li>
              ))}
              <li className="border border-blue-200 bg-blue-50 px-4 py-2 text-[14px] text-blue-600">
                + worldwide by arrangement
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Questions"
                title="The things operators ask first"
                description="If your question is not here, the operations desk answers it directly — no sales script."
              />
              <div className="mt-8">
                <Button href="/contact" variant="outline">
                  Contact us
                </Button>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <FaqList faqs={homeFaqs} />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

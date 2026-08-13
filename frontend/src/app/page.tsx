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
import { LocationsGrid } from "@/components/locations";
import { CapabilityGallery } from "@/components/capability-gallery";
import { PhotoOverlay } from "@/components/photo-overlay";
import { stockImages } from "@/lib/stock-images";
import { buildMetadata, faqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Underwater Hull Cleaning & Marine Services | Cleanship",
  description: siteConfig.shortDescription,
  path: "/",
  keywords: [
    "underwater hull cleaning",
    "propeller polishing UAE",
    "in-water hull cleaning Fujairah",
    "hold cleaning services",
    "tank cleaning company UAE",
    "marine cleaning Ajman",
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
  { value: 30, suffix: "+", label: "Clients" },
  { value: 100, suffix: "+", label: "Project Done" },
  { value: 40, suffix: "+", label: "Team Member" },
];

/** Homepage FAQs — chosen for the questions people actually search. */
const homeFaqs = [
  {
    q: "What marine cleaning services does CleanShip Marine offer?",
    a: "CleanShip Marine offers professional underwater hull cleaning, hold cleaning, tank cleaning, demucking, hydroblasting, marine painting, shore tank cleaning, and offshore vessel cleaning services. We serve bulk carriers, tankers, container ships, and offshore vessels at ports worldwide.",
  },
  {
    q: "Do you provide hold cleaning at port and hold cleaning at sea?",
    a: "Yes, we offer both hold cleaning at port and hold cleaning at sea, allowing shipowners to schedule cleaning around voyage timelines and minimize vessel downtime and turnaround delays.",
  },
  {
    q: "What is underwater hull cleaning and how does it help?",
    a: "Underwater hull cleaning removes marine growth, algae, and fouling from a vessel's hull without dry-docking. This improves fuel efficiency, boosts vessel speed and performance, and lowers overall operational costs.",
  },
  {
    q: "What is included in your tank cleaning services?",
    a: "Our tank cleaning services cover cargo tank cleaning, demucking, shore tank cleaning, and cleaning for offshore vessels, ensuring residue-free tanks that meet safety, compliance, and cargo-readiness requirements.",
  },
  {
    q: "What is hydroblasting and when is it used in marine cleaning?",
    a: "Hydroblasting is a high-pressure water-jet cleaning method used to remove rust, old paint, coatings, and marine deposits from ship surfaces safely and efficiently - without harsh chemicals.",
  },
  {
    q: "Does CleanShip Marine offer ship painting services?",
    a: "Yes, we provide professional marine painting services that protect vessel surfaces from corrosion, extend hull life, and deliver a durable, high-quality finish for ships of all sizes.",
  },
  {
    q: "Are CleanShip Marine's cleaning methods eco-friendly?",
    a: "Yes. We use eco-friendly cleaning solutions and advanced marine-grade equipment to minimize environmental impact while maintaining full compliance with international maritime cleaning standards.",
  },
  {
    q: "Which vessel types and ports does CleanShip Marine service?",
    a: "We provide marine cleaning services for bulk carriers, tankers, container ships, and offshore installations across global ports, with mobilized teams ready to respond quickly wherever your vessel is berthed.",
  },
  {
    q: "Who are the marine cleaning experts at CleanShip Marine?",
    a: "Our hull cleaning and hold cleaning specialists are experienced marine professionals trained in international safety protocols, delivering reliable, efficient, and industry standard cleaning solutions on every project.",
  },
  {
    q: "How do I request a quote for ship cleaning services?",
    a: "You can request a marine cleaning quote directly through our website, or contact our team via phone, email, or WhatsApp for a fast response and customized service plan.",
  },
  {
    q: "What are CleanShip Marine's contact details and working hours?",
    a: "Our team is available for marine cleaning inquiries via phone and email, with support ready to assist ship operators and fleet managers with cleaning schedules and service bookings.",
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
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section id="services" className="bg-white">
        <div className="container-page py-20 lg:py-24">
          <Reveal>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Our Services"
                title="One Mobilisation. Multiple Marine Solutions."
                description="From underwater services to hold preparation to tank cleaning, CleanShip delivers end-to-end solutions through one coordinated teams."
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
              <div className="on-navy rule-accent-top relative isolate flex h-full flex-col justify-between overflow-hidden bg-navy-800 p-6 text-white">
                <PhotoOverlay
                  image={stockImages.weldDetail}
                  strength="heavy"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="relative">
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
                  title="Why Will You Choose Our Services?"
                  description="Marine cleaning you can trust, backed by Industry compliant procedures and years of hands-on experience. Every vessel we service reflects our commitment to reliability, efficiency, and care."
                />
                <CheckList
                  className="mt-8"
                  items={[
                    "Experienced marine cleaning professionals",
                    "Industry and port-compliant procedures",
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
              title="From enquiry to Job Done"
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

      {/* ---------- Capability gallery ---------- */}
      <section className="border-t border-line-200 bg-white">
        <div className="container-page py-20 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="In the field"
              title="What the work actually looks like"
              description="Five service lines, from the propeller boss to the tank top. Every scope is delivered by our own certified crews, with our own equipment."
            />
          </Reveal>
          <div className="mt-12">
            <CapabilityGallery />
          </div>
        </div>
      </section>

      {/* ---------- Coverage ---------- */}
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Our Locations"
              title="Eight bases, three regions"
              description="Offices and operating bases across the Middle East, South Asia and West Africa — with riding crews that join the vessel wherever the fixture takes it."
            />
          </Reveal>

          {/* Offices first: a named address in a named city is the strongest
              proof of reach. The port list below it is supporting detail. */}
          <div className="mt-12">
            <LocationsGrid />
          </div>

          <Reveal delay={80}>
            <div className="mt-14 border-t border-line-200 pt-8">
              <h3 className="label-caps text-[12px] text-slate-500">
                Ports &amp; regions served
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <li
                    key={area}
                    className="border border-line-200 bg-white px-3.5 py-1.5 text-[13px] text-ink-700 transition-colors duration-[140ms] hover:border-blue-400 hover:text-blue-600"
                  >
                    {area}
                  </li>
                ))}
                <li className="border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-[13px] text-blue-600">
                  + worldwide by arrangement
                </li>
              </ul>
            </div>
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

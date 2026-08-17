import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { ServiceCard } from "@/components/service-cards";
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
import { hullCleaning } from "@/lib/services";
import { serviceAreas, siteConfig } from "@/lib/site";
import { LocationsGrid } from "@/components/locations";
import { CapabilityGallery } from "@/components/capability-gallery";
import { PhotoOverlay } from "@/components/photo-overlay";
import { stockImages } from "@/lib/stock-images";
import { buildMetadata, faqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Underwater Hull Cleaning & Propeller Polishing",
  description: siteConfig.shortDescription,
  path: "/",
  keywords: [
    "underwater hull cleaning",
    "propeller super polishing",
    "in-water hull cleaning Fujairah",
    "thruster cleaning and polishing",
    "in-water class survey",
    "UWILD",
    "commercial diving UAE",
  ],
  image: { url: "/posters/underwater-hull-cleaning.jpg", alt: "Diver cleaning a vessel's underwater hull" },
});

const differentiators = [
  {
    Icon: ShieldIcon,
    title: "Diving safety that is not negotiable",
    body: "Every dive runs under a written procedure with surface supervision, continuous comms and a standby diver ready to enter. When conditions — current, visibility, traffic — put the team at risk, we surface and say so.",
  },
  {
    Icon: ClipboardIcon,
    title: "Documented, not just done",
    body: "Every job closes with a video and photographic record of the hull, before-and-after coverage by area, and class-acceptable reporting where the scope calls for it. Your superintendent gets evidence, not assurances.",
  },
  {
    Icon: LeafIcon,
    title: "Coating-safe and port-compliant",
    body: "Brush hardness and operating pressure are matched to your antifouling specification and its remaining life. Debris capture is used where the port requires it, and diving permits are obtained by us, not left to the agent.",
  },
  {
    Icon: GlobeIcon,
    title: "Mobilised where you trade",
    body: "Core coverage across the UAE, the Gulf and West Africa, with dive teams that travel to the vessel at anchorage or alongside wherever the fixture takes it.",
  },
];

const process = [
  {
    title: "Tell us the vessel and the coating",
    body: "Vessel particulars, antifouling specification, last dry docking and the port. The coating spec is the one detail that changes the method, so we ask for it before quoting.",
  },
  {
    title: "We scope it properly",
    body: "You get a dive plan, team size, equipment list and a realistic duration — including an honest view of what the fouling state will allow.",
  },
  {
    title: "Dive team mobilises",
    body: "Diving permits, port authority approval and environmental clearance are handled by us. The team arrives with its own compressors, brush gear and surface-supplied equipment.",
  },
  {
    title: "Inspection and handover",
    body: "We review the footage with your superintendent, re-clean any area that falls short, and close out with a full video and photographic report.",
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
    q: "What services does CleanHull Marine offer?",
    a: "CleanHull Marine is a specialist underwater hull cleaning contractor. We deliver in-water hull cleaning, propeller super polishing, thruster cleaning and polishing, in-water class survey and UWILD for bulk carriers, tankers, container ships and offshore vessels at ports worldwide.",
  },
  {
    q: "What is underwater hull cleaning and how does it help?",
    a: "Underwater hull cleaning removes slime, algae and shell growth from a vessel's hull in the water, without dry-docking. Removing that fouling restores the hull's designed resistance, which cuts fuel consumption and CO2 emissions and recovers lost speed.",
  },
  {
    q: "Will hull cleaning damage the antifouling coating?",
    a: "Not when the method is matched to the coating. Brush hardness, tool selection and operating pressure are chosen against the coating type and its remaining service life. An aggressive clean on a soft self-polishing coating shortens its life, which is why we ask for the coating specification before quoting.",
  },
  {
    q: "How much fuel can hull cleaning actually save?",
    a: "It depends on the fouling state, the hull form and the trade. Independently published studies put the penalty from heavy fouling well into double digits, but we would rather survey your hull and give you a specific assessment than quote a headline number.",
  },
  {
    q: "Does the vessel have to go off hire for hull cleaning?",
    a: "No. Hull cleaning, propeller polishing and thruster work are carried out in the water at anchorage or alongside, so the vessel stays on hire and the work fits inside the port call or the waiting time you already have.",
  },
  {
    q: "What is propeller super polishing and why does it matter?",
    a: "Propeller super polishing restores the blade surface to a mirror finish, removing the roughness and calcareous growth that disrupt flow across the blade. Because the propeller does all the work of converting power into thrust, polishing it typically returns a disproportionate fuel saving for the time spent.",
  },
  {
    q: "What is UWILD and is it accepted by class?",
    a: "UWILD is an Underwater Inspection In Lieu of Drydocking — a class-accepted survey carried out in the water that can substitute for a bottom survey in dry dock. We coordinate with your class society in advance and provide the documentation and footage the surveyor requires.",
  },
  {
    q: "Do you need port permission to dive?",
    a: "Yes, and we obtain it. Diving permits, port authority approval and, where required, environmental clearance for cleaning operations are arranged as part of the job rather than left to the agent.",
  },
  {
    q: "Which ports does CleanHull cover?",
    a: "We operate across the UAE and the Gulf, South Asia and West Africa, with bases in Ajman, Fujairah, Khorfakkan, Dammam, Kandla, Visakhapatnam, Colombo and Conakry — and mobilise to other ports by arrangement.",
  },
  {
    q: "What documentation do I get at the end of the job?",
    a: "A full video and photographic record of the hull by area, before-and-after coverage of the work carried out, and class-acceptable reporting where the scope is a survey or UWILD.",
  },
  {
    q: "How do I request a quote for hull cleaning?",
    a: "Send us the vessel particulars, the antifouling specification, the last dry docking date and the port. You can request a quote through our website or contact the dive desk by phone, email or WhatsApp for a fast response.",
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
                eyebrow="Our Scopes"
                title="One Dive. Every Underwater Scope."
                description="Hull cleaning, propeller and thruster work, class survey and UWILD — all delivered by the same commercial dive team, so a single mobilisation covers both the performance and the compliance side of underwater work."
              />
              <Link
                href="/services"
                className="label-caps group inline-flex shrink-0 items-center gap-2 text-blue-600"
              >
                View all scopes
                <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hullCleaning.services.map((service, i) => (
              <ServiceCard
                key={service.slug}
                service={service}
                categorySlug={hullCleaning.slug}
                index={i}
              />
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
                    Send us the vessel, the antifouling specification and the
                    port. We tell you what the hull actually requires —
                    including when it is less than you were expecting.
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
                  eyebrow="About CleanHull"
                  title="Why Will You Choose Our Divers?"
                  description="Hull performance you can trust, backed by port-compliant diving procedures and years of hands-on in-water experience. Every hull we clean reflects our commitment to reliability, efficiency, and care for your coating."
                />
                <CheckList
                  className="mt-8"
                  items={[
                    "Certified commercial dive teams",
                    "Coating-safe methods matched to your antifouling",
                    "Diving permits and port approvals handled by us",
                    "Self-sufficient teams and surface-supplied equipment",
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
              description="No layers, no account managers relaying messages. You speak to the people who plan the dive and run it."
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
              eyebrow="In the water"
              title="What the work actually looks like"
              description="Five scopes, from the boot top to the propeller boss. Every one is delivered by our own certified dive teams, with our own equipment."
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
              description="Offices and operating bases across the Middle East, South Asia and West Africa — with dive teams that meet the vessel wherever the fixture takes it."
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
                description="If your question is not here, the dive desk answers it directly — no sales script."
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

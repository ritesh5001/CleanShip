import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { StatsBand } from "@/components/stats";
import { JsonLd } from "@/components/json-ld";
import { Button, CheckList, SectionHeading } from "@/components/ui";
import {
  ClipboardIcon,
  GlobeIcon,
  LeafIcon,
  ShieldIcon,
} from "@/components/icons";
import { hullCleaning } from "@/lib/services";
import { siteConfig } from "@/lib/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us — Underwater Hull Cleaning Specialists",
  description:
    "Specialist underwater hull cleaning contractor based in Ajman Free Zone, UAE. Certified commercial dive teams, coating-safe methods, port-compliant procedures.",
  path: "/about",
  keywords: [
    "about CleanHull",
    "hull cleaning company UAE",
    "Ajman Free Zone marine services",
    "commercial diving specialists",
  ],
  image: { url: "/images/crew-at-work.jpg", alt: "Crew working on the deck of a cargo vessel" },
});

const trail = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
];

const values = [
  {
    Icon: ShieldIcon,
    title: "Safety first, commercially second",
    body: "Every dive runs under a written procedure with surface supervision, continuous comms and a standby diver. If conditions cannot be made safe, the dive stops — and we tell you why rather than finding a way around it.",
  },
  {
    Icon: ClipboardIcon,
    title: "Say what is actually achievable",
    body: "If the coating is too far gone to clean without damaging it, or the fouling has hardened past what a soft-brush pass will shift, you hear it before mobilisation rather than in a report afterwards.",
  },
  {
    Icon: LeafIcon,
    title: "Compliance built into the method",
    body: "Brush hardness and pressure matched to your antifouling so the coating keeps its service life. Debris capture where the port requires it, and no chemical release into the water column. Compliance is designed into the method, not added afterwards.",
  },
  {
    Icon: GlobeIcon,
    title: "Go to the vessel",
    body: "Dive teams in our core ports and specialist teams that fly to wherever the fixture takes you, working at anchorage or alongside. The vessel should not have to divert — or dry dock — to meet its contractor.",
  },
];

const stats = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 30, suffix: "+", label: "Clients" },
  { value: 100, suffix: "+", label: "Project Done" },
  { value: 3, suffix: "+", label: "Award Winner" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="About CleanHull"
        title="Why will you choose our divers?"
        description="CleanHull is a specialist underwater hull cleaning contractor, offering professional in-water cleaning, polishing and survey for hulls, propellers and thrusters on all types of ships — including bulk carriers, tankers and container ships."
        trail={trail}
      />

      {/* ---------- Story ---------- */}
      <section className="bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="space-y-5 text-[17px] leading-[1.62] text-ink-700">
                <p>
                  Our coating-safe methods and advanced tooling remove slime,
                  algae and shell growth without stripping the antifouling that
                  is protecting your hull. We follow international safety and
                  environmental standards strictly, so your vessel stays
                  compliant and ready for operations.
                </p>
                <p>
                  CleanHull exists because hull fouling is the quietest cost on a
                  vessel&apos;s P&amp;L. It never produces a defect report. It
                  never stops a fixture. It just adds a few percent to the fuel
                  bill every day, accumulating steadily between dry dockings
                  until somebody finally looks.
                </p>
                <p>
                  So we built a business around looking — and then fixing it in
                  the water. Hull cleaning to recover the resistance the hull was
                  designed for. Propeller super polishing, because the propeller
                  converts every kilowatt into thrust and rewards a mirror finish
                  out of all proportion to the time spent on it. Thruster work,
                  because a fouled tunnel costs manoeuvring power exactly when
                  you need it. And in-water class survey and UWILD, because once
                  a competent dive team is already down there with cameras
                  running, the compliance work should not need a second
                  mobilisation.
                </p>
                <p>
                  We are registered in Ajman Free Zone under licence{" "}
                  <span className="tabular">{siteConfig.licence}</span>, and our
                  dive desk is manned around the clock — because vessels do not
                  arrive at convenient hours.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={80}>
              <div className="rule-accent-top border border-line-200 bg-paper p-8">
                <h2 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
                  What we stand on
                </h2>
                <CheckList
                  className="mt-6"
                  items={[
                    "Certified commercial divers and dive supervisors",
                    "Port-compliant diving permits and approvals",
                    "Coating-safe methods matched to your antifouling",
                    "Class-accepted survey and UWILD reporting",
                    "Self-sufficient teams — own compressors and brush gear",
                    "Full video and photographic reporting by hull area",
                  ]}
                />

                <div className="mt-8 border-t border-line-200 pt-6">
                  <h3 className="label-caps text-[12px] text-slate-500">
                    Registered office
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.62] text-ink-700">
                    {siteConfig.legalName}
                    <br />
                    {siteConfig.address.full}
                  </p>
                  <p className="mt-3 text-[15px] text-slate-600">
                    {siteConfig.hours.office}
                    <br />
                    <span className="text-blue-600">
                      {siteConfig.hours.operations}
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Counters ---------- */}
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-20">
          <StatsBand stats={stats} />
        </div>
      </section>

      {/* ---------- Values ---------- */}
      <section className="bg-white">
        <div className="container-page py-16 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="How We Operate"
              title="Four commitments we do not trade away"
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {values.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 60} className="h-full">
                <div className="card h-full p-7">
                  <span className="flex size-12 items-center justify-center bg-blue-50 text-blue-600">
                    <Icon className="size-[26px]" />
                  </span>
                  <h3 className="mt-5 font-display text-[20px] font-bold uppercase leading-tight text-ink-900">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.62] text-slate-600">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Capability ---------- */}
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Capability"
              title="Five scopes, one dive team"
              description="Each scope stands on its own. Together they mean a hull can be cleaned, its propeller and thrusters polished, and its class survey completed without a second mobilisation."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {hullCleaning.services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 50} className="h-full">
                <div className="card h-full p-6">
                  <span className="tabular text-[13px] text-blue-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-[18px] font-bold uppercase leading-tight text-ink-900">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-slate-600">
                    {service.summary}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <div className="mt-10">
              <Button href="/services">View more services</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

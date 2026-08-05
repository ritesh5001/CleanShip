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
import { serviceCategories } from "@/lib/services";
import { siteConfig } from "@/lib/site";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Cleanship Marine Services | Hold & Tank Cleaning Specialists",
  description:
    "Cleanship Marine Services FZE is a trusted hold and tank cleaning provider based in Ajman Free Zone, UAE. Certified crews, IMO-compliant procedures and eco-friendly methods for vessels worldwide.",
  path: "/about",
  keywords: [
    "about Cleanship",
    "marine cleaning company UAE",
    "Ajman Free Zone marine services",
    "hold cleaning specialists",
  ],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
];

const values = [
  {
    Icon: ShieldIcon,
    title: "Safety first, commercially second",
    body: "Every enclosed-space entry, every dive and every work-at-height task runs under a written procedure with monitoring and manned rescue standby. If a space cannot be made safe, the work stops — and we tell you why rather than finding a way around it.",
  },
  {
    Icon: ClipboardIcon,
    title: "Say what is actually achievable",
    body: "If your coating condition makes a wall wash unrealistic, or the port window is too short for the holds you have, you will hear it before mobilisation rather than in a delay notice afterwards.",
  },
  {
    Icon: LeafIcon,
    title: "Compliance built into the method",
    body: "Biodegradable, marine-approved chemicals. MARPOL Annex V residue handling with manifests. Debris capture where the port requires it. Environmental compliance is designed into how we work, not added as an afterthought.",
  },
  {
    Icon: GlobeIcon,
    title: "Go to the vessel",
    body: "Shore gangs in our core ports, riding crews that sail with the ship, and specialist teams that fly to wherever the fixture takes you. The vessel should not have to divert to meet its contractor.",
  },
];

const stats = [
  { value: 300, suffix: "+", label: "Clients served" },
  { value: 1200, suffix: "+", label: "Holds cleaned" },
  { value: 18, suffix: "+", label: "Ports covered" },
  { value: 24, suffix: "/7", label: "Operations desk" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="About Cleanship"
        title="Why will you choose our services?"
        description="Cleanship is a trusted hold and tank cleaning service provider, offering professional cleaning for cargo holds on all types of ships — including bulk carriers, tankers and container ships."
        trail={trail}
      />

      {/* ---------- Story ---------- */}
      <section className="pb-16 lg:pb-24">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="space-y-5 text-base leading-relaxed text-abyss-200">
                  <p>
                    Our eco-friendly methods and advanced tools thoroughly remove
                    dirt, residues and contaminants. We follow international
                    safety and environmental standards strictly, so your vessel
                    stays compliant and ready for operations.
                  </p>
                  <p>
                    Cleanship began where most of this industry&apos;s pain sits
                    — cargo holds that had to be grain-clean before a fixture
                    that would not wait. Hold cleaning is still the core of what
                    we do, and it taught us the thing that shapes everything
                    else: on a vessel, the constraint is almost never the
                    cleaning itself. It is access, documentation, permits, and
                    the hours actually available between one cargo and the next.
                  </p>
                  <p>
                    So we built outward from that. Tank cleaning, because the
                    same operators asked. Underwater services, because a hull and
                    propeller left fouled quietly costs more than any cleaning
                    invoice. NDT and repair, because finding a defect is only
                    useful when someone on board can fix it before the vessel
                    sails. Today a single Cleanship mobilisation can close out
                    work that would otherwise need four separate contractors and
                    three handovers between them.
                  </p>
                  <p>
                    We are registered in Ajman Free Zone under licence{" "}
                    {siteConfig.licence}, and our operations desk is manned
                    around the clock — because vessels do not arrive at
                    convenient hours.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={100}>
                <div className="rounded-3xl border border-white/10 bg-abyss-900/50 p-8">
                  <h2 className="text-xl text-white">What we stand on</h2>
                  <CheckList
                    className="mt-6"
                    items={[
                      "Experienced marine cleaning professionals",
                      "IMO and port-compliant procedures",
                      "Eco-friendly cleaning solutions",
                      "Certified riding crews, divers and technicians",
                      "Self-sufficient teams — own equipment and consumables",
                      "Photographic reporting and disposal documentation",
                    ]}
                  />

                  <div className="mt-8 border-t border-white/10 pt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-abyss-300">
                      Registered office
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-abyss-200">
                      {siteConfig.legalName}
                      <br />
                      {siteConfig.address.full}
                    </p>
                    <p className="mt-3 text-sm text-abyss-300">
                      <span className="text-abyss-400">Office hours:</span>{" "}
                      {siteConfig.hours.office}
                      <br />
                      <span className="text-marine-300">
                        {siteConfig.hours.operations}
                      </span>
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="pb-16 lg:pb-24">
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

      {/* ---------- Values ---------- */}
      <section className="border-y border-white/8 bg-abyss-900/30 py-16 lg:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="How we operate"
              title="Four commitments we do not trade away"
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {values.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 90} className="h-full">
                <div className="card-hover h-full rounded-2xl border border-white/10 bg-abyss-950/50 p-7">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-marine-400/10 text-marine-300 ring-1 ring-marine-400/20">
                    <Icon className="size-5.5" />
                  </span>
                  <h3 className="mt-5 text-lg text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-abyss-300">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Capability summary ---------- */}
      <section className="py-16 lg:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Capability"
              title="Five service lines, one contractor"
              description="Each line stands on its own. Together they mean a vessel can be cleaned, inspected, repaired and re-protected without a second mobilisation."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {serviceCategories.map((category, i) => (
              <Reveal key={category.slug} delay={i * 70} className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-base text-white">{category.name}</h3>
                  <p className="mt-2 text-xs font-medium text-marine-400">
                    {category.services.length} scopes
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-abyss-300">
                    {category.summary}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10">
              <Button href="/services">Explore all services</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

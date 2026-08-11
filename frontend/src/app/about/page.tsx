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
  title: "About Cleanship | Underwater Hull Cleaning Specialists",
  description:
    "Cleanship Marine Services FZE is a trusted underwater hull cleaning specialist, and a hold and tank cleaning provider, based in Ajman Free Zone, UAE. Certified crews, IMO-compliant procedures and eco-friendly methods for vessels worldwide.",
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
    body: "Every enclosed-space entry, dive and work-at-height task runs under a written procedure with monitoring and manned rescue standby. If a space cannot be made safe, the work stops — and we tell you why rather than finding a way around it.",
  },
  {
    Icon: ClipboardIcon,
    title: "Say what is actually achievable",
    body: "If coating condition makes a wall wash unrealistic, or the port window is too short for the holds you have, you hear it before mobilisation rather than in a delay notice afterwards.",
  },
  {
    Icon: LeafIcon,
    title: "Compliance built into the method",
    body: "Biodegradable, marine-approved chemicals. MARPOL Annex V residue handling with manifests. Debris capture where the port requires it. Environmental compliance is designed into how we work, not added afterwards.",
  },
  {
    Icon: GlobeIcon,
    title: "Go to the vessel",
    body: "Shore gangs in our core ports, riding crews that sail with the ship, and specialist teams that fly to wherever the fixture takes you. The vessel should not have to divert to meet its contractor.",
  },
];

const stats = [
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 300, suffix: "+", label: "Clients" },
  { value: 100, suffix: "+", label: "Project Done" },
  { value: 3, suffix: "+", label: "Award Winner" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="About Cleanship"
        title="Why will you choose our services?"
        // Reordered to lead with hull cleaning at the brand owner's direction.
        // The original site string opened "a trusted hold and tank cleaning
        // service provider" — the DS asks for source copy to be kept verbatim,
        // so this is a deliberate, instructed departure rather than a rewrite.
        description="Cleanship is a trusted underwater hull cleaning specialist and hold and tank cleaning service provider, offering professional cleaning for hulls, propellers and cargo holds on all types of ships — including bulk carriers, tankers and container ships."
        trail={trail}
      />

      {/* ---------- Story ---------- */}
      <section className="bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="space-y-5 text-[17px] leading-[1.62] text-ink-700">
                <p>
                  Our eco-friendly methods and advanced tools thoroughly remove
                  dirt, residues and contaminants. We follow international safety
                  and environmental standards strictly, so your vessel stays
                  compliant and ready for operations.
                </p>
                <p>
                  Cleanship began where most of this industry&apos;s pain sits —
                  cargo holds that had to be grain-clean before a fixture that
                  would not wait. Hold cleaning is still the core of what we do,
                  and it taught us the thing that shapes everything else: on a
                  vessel, the constraint is almost never the cleaning itself. It
                  is access, documentation, permits, and the hours actually
                  available between one cargo and the next.
                </p>
                <p>
                  So we built outward from that. Tank cleaning, because the same
                  operators asked. Underwater services, because a hull and
                  propeller left fouled quietly costs more than any cleaning
                  invoice. NDT and repair, because finding a defect is only
                  useful when someone on board can fix it before the vessel
                  sails. Today a single Cleanship mobilisation can close out work
                  that would otherwise need four separate contractors and three
                  handovers between them.
                </p>
                <p>
                  We are registered in Ajman Free Zone under licence{" "}
                  <span className="tabular">{siteConfig.licence}</span>, and our
                  operations desk is manned around the clock — because vessels do
                  not arrive at convenient hours.
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
                    "Experienced marine cleaning professionals",
                    "IMO and port-compliant procedures",
                    "Eco-friendly cleaning solutions",
                    "Certified riding crews, divers and technicians",
                    "Self-sufficient teams — own equipment and consumables",
                    "Photographic reporting and disposal documentation",
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
          <p className="mt-4 text-[13px] text-slate-400">
            Figures are indicative of current operating scale — replace with
            audited numbers before launch.
          </p>
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
              title="Five service lines, one contractor"
              description="Each line stands on its own. Together they mean a vessel can be cleaned, inspected, repaired and re-protected without a second mobilisation."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {serviceCategories.map((category, i) => (
              <Reveal key={category.slug} delay={i * 50} className="h-full">
                <div className="card h-full p-6">
                  <span className="tabular text-[13px] text-blue-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-[18px] font-bold uppercase leading-tight text-ink-900">
                    {category.name}
                  </h3>
                  <p className="tabular mt-2 text-[12px] text-slate-400">
                    {category.services.length} scopes
                  </p>
                  <p className="mt-3 text-[14px] leading-[1.6] text-slate-600">
                    {category.summary}
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

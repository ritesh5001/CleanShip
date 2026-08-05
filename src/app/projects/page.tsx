import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/ui";
import { ArrowIcon, CategoryIcon } from "@/components/icons";
import { serviceCategories } from "@/lib/services";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projects & Case Studies | Marine Cleaning Work",
  description:
    "Representative Cleanship marine cleaning projects — cargo hold cleaning, tank cleaning, underwater hull work and offshore support across bulk carriers, tankers, container ships and OSVs.",
  path: "/projects",
  keywords: [
    "marine cleaning projects",
    "hold cleaning case study",
    "tank cleaning project UAE",
  ],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
];

/**
 * ⚠️ PLACEHOLDER CONTENT — REPLACE BEFORE LAUNCH.
 *
 * These entries describe the *shape* of a case study so the page layout and
 * SEO structure are ready. They are written as illustrative scope patterns,
 * not as claims about specific completed jobs. Swap each one for a real
 * project (with the client's permission) and delete the notice rendered below
 * the grid. Do not publish this page as-is with these presented as history.
 */
const PLACEHOLDER_PROJECTS = [
  {
    vesselType: "Supramax bulk carrier",
    scope: "Hold cleaning — riding crew",
    category: "hold-cleaning",
    service: "riding-crew",
    challenge:
      "Five holds carrying petcoke residue, with a grain-clean requirement at the next load port and only a six-day ballast passage available.",
    approach:
      "An eight-person riding crew joined at the discharge port and worked the holds in sequence across the passage, sweeping and washing forward-to-aft so completed holds had maximum drying time.",
    outcome:
      "All five holds presented and passed at the load port with no commercial time lost to cleaning.",
  },
  {
    vesselType: "MR product tanker",
    scope: "Tank cleaning — CPP grade change",
    category: "tank-cleaning",
    service: "oil-tanker-dpp-cpp",
    challenge:
      "Grade change from gasoil into jet fuel, with a wall wash requirement and a coating system approaching the end of its service life.",
    approach:
      "Cycle programme planned against the cargo pair, machine washing followed by manual finishing of bellmouths, coils and structural shadows, then drying and testing before presentation.",
    outcome:
      "Tanks presented to the inspector with the coating limitation identified and communicated in advance rather than discovered at test.",
  },
  {
    vesselType: "Panamax container ship",
    scope: "Hull cleaning & propeller polishing",
    category: "hull-cleaning",
    service: "propeller-super-polishing",
    challenge:
      "Extended period at anchorage in warm water had produced heavy fouling on the flat bottom and calcareous growth on the propeller.",
    approach:
      "Brush cart cleaning of the full underwater hull with hand work on niche areas, followed by staged propeller polishing to a Class A mirror finish. Carried out at anchorage over two working days.",
    outcome:
      "Hull and propeller returned to a smooth condition without off-hire, with before-and-after video issued for the technical file.",
  },
  {
    vesselType: "Platform supply vessel",
    scope: "Offshore — charter turnaround",
    category: "offshore",
    service: "offshore-support-vessel-services",
    challenge:
      "Off-charter to on-charter window of under three days, covering mud and brine tanks, cargo deck degreasing and accommodation presentation.",
    approach:
      "Deck, tank and accommodation scopes run in parallel by a single team, with line and pump flushing included so cross-contamination did not reappear from the system.",
    outcome:
      "Vessel presented for on-hire inspection inside the window with observations rectified on the spot.",
  },
  {
    vesselType: "Handysize bulk carrier",
    scope: "NDT inspection & riding fabricator",
    category: "ndt-and-repair",
    service: "riding-fabricator",
    challenge:
      "Thickness gauging in ballast tanks identified wasted plating and cracked brackets requiring rectification ahead of a class survey.",
    approach:
      "Certified NDT technicians quantified the wastage, then riding fabricators cropped and renewed the affected plating under class-approved procedures and hot-work permit.",
    outcome:
      "Repairs NDT tested and presented to the attending surveyor within the same mobilisation, avoiding a second contractor call-out.",
  },
  {
    vesselType: "Crude oil tanker",
    scope: "Demucking & gas-freeing",
    category: "tank-cleaning",
    service: "demucking",
    challenge:
      "Heavy compacted sludge around bellmouths and heating coils requiring removal before a gas-free-for-hot-work certificate could be pursued.",
    approach:
      "Rotating teams worked under full enclosed-space entry regime with continuous monitoring and manned rescue standby, with residues quantified and landed to an approved facility.",
    outcome:
      "Tanks cleared and washed down, with independent certification arranged separately as the correct next step.",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Projects"
        title="Work that reflects how we operate"
        description="Marine cleaning problems repeat in patterns — a cargo pair that fights the coating, a window too short for the holds, a defect found too late to fix before sailing. These are the patterns we plan around."
        trail={trail}
      />

      {/* ---------- Case studies ---------- */}
      <section className="pb-16 lg:pb-24">
        <div className="container-page">
          <div className="grid gap-5 lg:grid-cols-2">
            {PLACEHOLDER_PROJECTS.map((project, i) => (
              <Reveal key={project.vesselType + project.scope} delay={i * 70}>
                <article className="card-hover h-full rounded-3xl border border-white/10 bg-abyss-900/50 p-7 lg:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-aqua-400/10 px-3 py-1 text-xs font-medium text-aqua-300 ring-1 ring-aqua-400/20">
                      {project.scope}
                    </span>
                    <span className="text-xs text-abyss-400">
                      {project.vesselType}
                    </span>
                  </div>

                  <dl className="mt-6 space-y-4">
                    {[
                      { term: "The problem", detail: project.challenge },
                      { term: "What we did", detail: project.approach },
                      { term: "Result", detail: project.outcome },
                    ].map((row) => (
                      <div key={row.term}>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-abyss-500">
                          {row.term}
                        </dt>
                        <dd className="mt-1.5 text-sm leading-relaxed text-abyss-200">
                          {row.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={`/services/${project.category}/${project.service}`}
                    className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-aqua-300"
                  >
                    About this service
                    <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          {/*
            Remove this notice once real, permission-cleared case studies
            replace the placeholder entries above.
          */}
          <Reveal>
            <p className="mt-8 rounded-2xl border border-sand-400/25 bg-sand-400/8 px-5 py-4 text-sm leading-relaxed text-sand-300">
              <strong className="font-semibold">Note:</strong> the entries above
              are illustrative scope patterns showing how we approach typical
              jobs — not records of specific completed contracts. Replace them
              with real project write-ups (with client permission) and delete
              this notice before launch.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Sectors ---------- */}
      <section className="border-t border-white/8 bg-abyss-900/30 py-16 lg:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Capability"
              title="Every service line, available on the same mobilisation"
              description="Most of our work is multi-scope. Cleaning, inspection and repair delivered together removes the handover delays that dominate a timeline when trades are split across contractors."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {serviceCategories.map((category, i) => (
              <Reveal key={category.slug} delay={i * 70} className="h-full">
                <Link
                  href={`/services/${category.slug}`}
                  className="card-hover flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-aqua-400/10 text-aqua-300 ring-1 ring-aqua-400/20">
                    <CategoryIcon name={category.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 text-base text-white">{category.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-abyss-300">
                    {category.tagline}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Have a scope you want assessed?"
        description="Send the vessel, the previous cargo and the port. We will tell you what the job actually needs — including when it is less than you expected."
      />
    </>
  );
}

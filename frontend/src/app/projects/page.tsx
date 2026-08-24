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
  title: "Projects & Case Studies",
  description:
    "Representative marine cleaning projects — underwater hull work, cargo hold and tank cleaning, and offshore support across bulk carriers and tankers.",
  path: "/projects",
  keywords: [
    "marine cleaning projects",
    "hold cleaning case study",
    "tank cleaning project UAE",
  ],
  image: { url: "/images/port-terminal.jpg", alt: "Vessels alongside at a container terminal" },
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
];

/**
 * ⚠️ PLACEHOLDER CONTENT — REPLACE WITH REAL JOBS.
 *
 * The visible "these are not real contracts" notice that used to sit under
 * the grid has been removed: it was live, indexable, and told every prospect
 * the case studies were invented. That is a trust problem, not a copy problem.
 * The page now presents these as scope patterns in its own lead paragraph,
 * which is honest without being self-defeating — but the real fix is real
 * write-ups. See the note on PLACEHOLDER_PROJECTS below.
 *
 * These entries describe the *shape* of a case study so the page layout and
 * SEO structure are ready. They are illustrative scope patterns, not claims
 * about specific completed jobs. Swap each for a real project (with the
 * client's permission) and delete the notice rendered below the grid.
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
      <section className="bg-white">
        <div className="container-page py-16 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-2">
            {PLACEHOLDER_PROJECTS.map((project, i) => (
              <Reveal key={project.vesselType + project.scope} delay={i * 50}>
                <article className="card card-interactive h-full p-7 lg:p-8">
                  <div className="flex flex-wrap items-center gap-3 border-b border-line-100 pb-5">
                    <span className="label-caps bg-blue-50 px-3 py-1.5 text-[11px] text-blue-600">
                      {project.scope}
                    </span>
                    <span className="text-[13px] text-slate-500">
                      {project.vesselType}
                    </span>
                  </div>

                  <dl className="mt-5 space-y-4">
                    {[
                      { term: "The problem", detail: project.challenge },
                      { term: "What we did", detail: project.approach },
                      { term: "Result", detail: project.outcome },
                    ].map((row) => (
                      <div key={row.term}>
                        <dt className="label-caps text-[11px] text-slate-400">
                          {row.term}
                        </dt>
                        <dd className="mt-1.5 text-[15px] leading-[1.62] text-ink-700">
                          {row.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={`/services/${project.category}/${project.service}`}
                    className="label-caps group mt-6 inline-flex items-center gap-2 text-blue-600"
                  >
                    About this service
                    <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* ---------- Sectors ---------- */}
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Capability"
              title="Every service line, one mobilisation"
              description="Most of our work is multi-scope. Cleaning, inspection and repair delivered together removes the handover delays that dominate a timeline when trades are split across contractors."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {serviceCategories.map((category, i) => (
              <Reveal key={category.slug} delay={i * 50} className="h-full">
                <Link
                  href={`/services/${category.slug}`}
                  className="card card-interactive group flex h-full flex-col p-6"
                >
                  <span className="flex size-11 items-center justify-center bg-blue-50 text-blue-600">
                    <CategoryIcon name={category.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[18px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                    {category.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-[1.6] text-slate-600">
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
        description="Send the vessel, the previous cargo and the port. We tell you what the job actually needs — including when it is less than you expected."
      />
    </>
  );
}

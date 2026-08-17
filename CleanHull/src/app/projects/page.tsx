import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/ui";
import { ArrowIcon, CategoryIcon } from "@/components/icons";
import { hullCleaning } from "@/lib/services";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projects & Case Studies",
  description:
    "Representative underwater hull projects — hull cleaning, propeller and thruster polishing, in-water class survey and UWILD across bulk carriers, tankers and container ships.",
  path: "/projects",
  keywords: [
    "hull cleaning projects",
    "propeller polishing case study",
    "UWILD project UAE",
  ],
  image: { url: "/images/port-terminal.jpg", alt: "Vessels alongside at a container terminal" },
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
];

/**
 * ⚠️ PLACEHOLDER CONTENT — REPLACE BEFORE LAUNCH.
 *
 * These entries describe the *shape* of a case study so the page layout and
 * SEO structure are ready. They are illustrative scope patterns, not claims
 * about specific completed jobs. Swap each for a real project (with the
 * client's permission) and delete the notice rendered below the grid.
 */
const PLACEHOLDER_PROJECTS = [
  {
    vesselType: "Panamax container ship",
    scope: "Underwater hull cleaning",
    category: "hull-cleaning",
    service: "underwater-hull-cleaning",
    challenge:
      "An extended period at anchorage in warm water had produced heavy slime and shell growth across the flat bottom and vertical sides, with a self-polishing coating already two-thirds through its service life.",
    approach:
      "Brush cart cleaning of the full underwater hull with hand work on niche areas, brush hardness selected against the coating specification so the remaining antifouling was not stripped. Carried out at anchorage over two working days.",
    outcome:
      "Hull returned to a smooth condition without off-hire, with before-and-after video by area issued for the technical file.",
  },
  {
    vesselType: "Supramax bulk carrier",
    scope: "Propeller super polishing",
    category: "hull-cleaning",
    service: "propeller-super-polishing",
    challenge:
      "Calcareous growth and blade roughness following a long idle period, with a performance claim under discussion between owners and charterers.",
    approach:
      "Staged polishing of all blade faces to a Class A mirror finish, working the leading edges and blade tips where roughness costs the most, with surface-supplied divers over a single working day.",
    outcome:
      "Blade finish documented before and after, giving both parties an evidenced baseline rather than a disputed estimate.",
  },
  {
    vesselType: "Handysize bulk carrier",
    scope: "Thruster cleaning & polishing",
    category: "hull-cleaning",
    service: "thruster-cleaning-polishing",
    challenge:
      "Reduced bow thruster response reported during berthing, with growth suspected in the tunnel and on the propeller but no confirmed cause.",
    approach:
      "Tunnel inspected and filmed first, then grating, tunnel walls and thruster blades cleaned by hand under a strict lock-out of the thruster controls with the bridge briefed and the isolation confirmed.",
    outcome:
      "Manoeuvring response restored, with the tunnel condition recorded on video for the vessel's maintenance file.",
  },
  {
    vesselType: "MR product tanker",
    scope: "In-water class survey",
    category: "hull-cleaning",
    service: "in-water-class-survey",
    challenge:
      "Bottom survey falling due with no dry docking slot available inside the window, and a class society requiring evidence before granting credit.",
    approach:
      "Survey planned with the attending class society in advance, hull cleaned where necessary for visibility, then filmed to the society's required coverage with divers in continuous comms with the surveyor.",
    outcome:
      "Survey completed in the water and accepted by class, with the documentation package issued the same week.",
  },
  {
    vesselType: "Aframax crude oil tanker",
    scope: "UWILD",
    category: "hull-cleaning",
    service: "uwild",
    challenge:
      "Underwater inspection in lieu of drydocking required for a vessel on a tight trading pattern, covering rudder, propeller, sea chests and hull plating.",
    approach:
      "Full UWILD scope run over three days at anchorage, with measured references, close-up filming of designated areas and the sea chest gratings opened and inspected under permit.",
    outcome:
      "Class-acceptable UWILD report delivered, with the vessel keeping its trading pattern instead of taking a dry dock slot.",
  },
  {
    vesselType: "Platform supply vessel",
    scope: "Hull cleaning & propeller polishing",
    category: "hull-cleaning",
    service: "underwater-hull-cleaning",
    challenge:
      "Off-charter to on-charter window of under three days, with the incoming charterer requiring evidence of hull and propeller condition.",
    approach:
      "Hull cleaning and propeller polishing run back to back by a single dive team, filming throughout so the condition record was produced as a by-product of the work rather than a separate survey.",
    outcome:
      "Vessel presented for on-hire inspection inside the window with the hull condition already evidenced on video.",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <JsonLd schema={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Projects"
        title="Work that reflects how we operate"
        description="Underwater problems repeat in patterns — a coating too far gone to clean hard, a survey due with no dry dock slot, a thruster losing response with no confirmed cause. These are the patterns we plan around."
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

          {/* Remove once real, permission-cleared case studies replace the
              placeholder entries above. */}
          <Reveal>
            <p className="rule-accent-left mt-8 border-y border-r border-warning-600/30 bg-warning-100 px-6 py-5 text-[15px] leading-[1.62] text-ink-700">
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
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Capability"
              title="Every scope, one mobilisation"
              description="Most of our work is multi-scope. Cleaning, polishing and survey delivered on the same dive removes the handover delays that dominate a timeline when the work is split across contractors."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {hullCleaning.services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 50} className="h-full">
                <Link
                  href={`/services/${hullCleaning.slug}/${service.slug}`}
                  className="card card-interactive group flex h-full flex-col p-6"
                >
                  <span className="flex size-11 items-center justify-center bg-blue-50 text-blue-600">
                    <CategoryIcon name={hullCleaning.icon} className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[18px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-[1.6] text-slate-600">
                    {service.tagline}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Have a scope you want assessed?"
        description="Send the vessel, the antifouling specification and the port. We tell you what the hull actually needs — including when it is less than you expected."
      />
    </>
  );
}

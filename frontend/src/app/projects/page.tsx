import type { Metadata } from "next";
import { projects } from "@/lib/projects";
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
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 50}>
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

                  {/* Each case study has its own URL — see lib/projects.ts
                      for the real/illustrative gate that controls whether it
                      is indexable. */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="label-caps group mt-6 inline-flex items-center gap-2 text-blue-600"
                  >
                    Read the write-up
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

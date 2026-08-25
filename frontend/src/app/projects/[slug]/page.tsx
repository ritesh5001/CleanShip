import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { ArrowIcon } from "@/components/icons";
import { heroMediaFor } from "@/lib/service-media";
import { heroImageFor } from "@/lib/stock-images";
import { getProject, projects, type Project } from "@/lib/projects";
import { getService } from "@/lib/services";
import { BASE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";

/**
 * One URL per case study.
 *
 * Six case studies sharing a single /projects URL is six pages of ranking
 * potential unused — a superintendent searching "riding crew grain clean
 * petcoke" should be able to land on the write-up, not the index.
 *
 * ⚠️ INDEXATION IS GATED ON `project.real`. Entries still marked
 * `real: false` are illustrative scope patterns, and their detail pages are
 * `noindex, follow` so nothing invented reaches the index. Flip the flag in
 * lib/projects.ts when a real write-up replaces one and the page becomes
 * indexable and enters the sitemap on the next build. No other change needed.
 */

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function heading(p: Project) {
  return p.port ? `${p.vesselType} — ${p.port}` : `${p.vesselType} — ${p.scope}`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };

  return buildMetadata({
    title: `${project.vesselType} — ${project.scope.split("—").pop()?.trim() ?? project.scope}`,
    description: `${project.scope} on a ${project.vesselType.toLowerCase()}${project.port ? ` at ${project.port}` : ""}. ${project.outcome}`,
    path: `/projects/${project.slug}`,
    keywords: [project.vesselType, project.scope, "marine cleaning case study"],
    image: (() => {
      const media = heroMediaFor(project.category, project.service);
      const still = heroImageFor(project.category, project.service);
      if (media) return { url: `/posters/${media.slug}.jpg`, alt: media.alt };
      return still ? { url: still.src, alt: still.alt } : undefined;
    })(),
    noIndex: !project.real,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const found = getService(project.category, project.service);
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.vesselType, path: `/projects/${project.slug}` },
  ];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          /* Only a real, completed job is described as one in schema. An
             illustrative pattern gets breadcrumbs and nothing else. */
          ...(project.real
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "Article",
                  "@id": `${BASE_URL}/projects/${project.slug}#article`,
                  headline: heading(project),
                  description: project.outcome,
                  author: { "@id": `${BASE_URL}/#organization` },
                  publisher: { "@id": `${BASE_URL}/#organization` },
                  ...(project.date ? { datePublished: project.date } : {}),
                  about: {
                    "@type": "Service",
                    name: found?.service.name ?? project.scope,
                  },
                },
              ]
            : []),
        ]}
      />

      <PageHero
        eyebrow={project.scope}
        title={heading(project)}
        description={project.outcome}
        trail={trail}
        media={heroMediaFor(project.category, project.service)}
        image={heroImageFor(project.category, project.service)}
      />

      <section className="bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-8">
            {!project.real && (
              <Reveal>
                <p className="rule-accent-left border-y border-r border-line-200 bg-blue-50 px-6 py-5 text-[15px] leading-[1.62] text-ink-700">
                  This is a scope pattern — how we approach a job of this
                  shape — rather than a write-up of one specific contract.
                  Real, permission-cleared case studies are published as they
                  become available.
                </p>
              </Reveal>
            )}

            <Reveal delay={40}>
              <div className="mt-10 space-y-10">
                {[
                  { h: "The problem", body: project.challenge },
                  { h: "How we worked it", body: project.approach },
                  { h: "The outcome", body: project.outcome },
                ].map((block) => (
                  <div key={block.h}>
                    <h2 className="font-display text-[22px] font-bold uppercase leading-tight text-ink-900">
                      {block.h}
                    </h2>
                    <p className="mt-3 max-w-[70ch] text-[16px] leading-[1.62] text-ink-700">
                      {block.body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {found && (
              <Reveal delay={60}>
                <div className="mt-12 border border-line-200 bg-paper p-7">
                  <h2 className="label-caps text-[12px] text-slate-500">
                    The service behind it
                  </h2>
                  <h3 className="mt-3 font-display text-[20px] font-bold uppercase leading-tight text-ink-900">
                    {found.service.name}
                  </h3>
                  <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.62] text-ink-700">
                    {found.service.summary}
                  </p>
                  <Link
                    href={`/services/${project.category}/${project.service}`}
                    className="label-caps group mt-5 inline-flex items-center gap-2 text-blue-600"
                  >
                    Full service details
                    <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Reveal>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="card p-6 lg:sticky lg:top-[128px]">
              <h2 className="label-caps text-[12px] text-slate-500">
                Other work
              </h2>
              <ul className="mt-4 divide-y divide-line-100">
                {others.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="group flex items-center justify-between gap-3 py-3 text-[15px] text-ink-700 transition-colors duration-[140ms] hover:text-blue-600"
                    >
                      <span className="min-w-0">
                        <span className="block">{p.vesselType}</span>
                        <span className="mt-0.5 block text-[12px] text-slate-500">
                          {p.scope}
                        </span>
                      </span>
                      <ArrowIcon className="size-4 shrink-0 text-slate-300 transition-transform duration-[140ms] group-hover:translate-x-0.5 group-hover:text-blue-600" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/projects"
                className="label-caps mt-4 inline-flex items-center gap-2 text-blue-600"
              >
                All projects
                <ArrowIcon className="size-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

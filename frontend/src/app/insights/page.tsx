import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { ArrowIcon } from "@/components/icons";
import { heroMediaFor } from "@/lib/service-media";
import { insights } from "@/lib/insights";
import { BASE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insights",
  description:
    "Operational writing on marine cleaning, in-water survey and compliance — what our operations desk knows, written for superintendents rather than search engines.",
  path: "/insights",
  keywords: [
    "marine cleaning insights",
    "hold cleaning guidance",
    "in-water survey explained",
  ],
  image: {
    url: "/posters/underwater-hull-cleaning.jpg",
    alt: "Diver cleaning a vessel's underwater hull",
  },
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Insights", path: "/insights" },
];

export default function InsightsIndexPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${BASE_URL}/insights#blog`,
            name: "Cleanship Insights",
            url: `${BASE_URL}/insights`,
            publisher: { "@id": `${BASE_URL}/#organization` },
            blogPost: insights.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: `${BASE_URL}/insights/${post.slug}`,
              datePublished: post.date,
            })),
          },
        ]}
      />

      <PageHero
        eyebrow="Insights"
        title="Insights"
        description="What the operations desk knows, written down. Process, not promotion — the questions superintendents actually ask before they commission work."
        trail={trail}
        media={heroMediaFor("hull-cleaning", "underwater-hull-cleaning")}
      />

      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <ul className="grid gap-6 lg:grid-cols-2">
            {insights.map((post, i) => (
              <Reveal as="li" key={post.slug} delay={i * 50}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="card card-interactive group flex h-full flex-col p-7"
                >
                  <p className="label-caps text-[11px] text-blue-600">
                    {post.category}
                  </p>
                  <h2 className="mt-4 font-display text-[22px] font-bold uppercase leading-tight text-ink-900 transition-colors duration-[140ms] group-hover:text-blue-600">
                    {post.title}
                  </h2>
                  <p className="mt-4 flex-1 text-[15px] leading-[1.62] text-slate-600">
                    {post.description}
                  </p>
                  <p className="mt-5 text-[13px] text-slate-500">
                    <span className="tabular">
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="mx-2">·</span>
                    {post.minutes} min read
                  </p>
                  <span className="label-caps mt-5 inline-flex items-center gap-2 text-blue-600">
                    Read
                    <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { ArrowIcon } from "@/components/icons";
import { heroMediaFor } from "@/lib/service-media";
import { heroImageFor } from "@/lib/stock-images";
import { getInsight, insights } from "@/lib/insights";
import { getService } from "@/lib/services";
import {
  BASE_URL,
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
} from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsight(slug);
  if (!post) return { title: "Not found" };

  return buildMetadata({
    title: post.seoTitle,
    description: post.description,
    path: `/insights/${post.slug}`,
    keywords: [post.category, post.title],
    image: (() => {
      const media = heroMediaFor(post.serviceCategory, post.serviceSlug);
      const still = heroImageFor(post.serviceCategory, post.serviceSlug);
      if (media) return { url: `/posters/${media.slug}.jpg`, alt: media.alt };
      return still ? { url: still.src, alt: still.alt } : undefined;
    })(),
  });
}

export default async function InsightPage({ params }: Params) {
  const { slug } = await params;
  const post = getInsight(slug);
  if (!post) notFound();

  const found = getService(post.serviceCategory, post.serviceSlug);
  const others = insights.filter((i) => i.slug !== post.slug);

  const trail = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: post.category, path: "/insights" },
    { name: post.title, path: `/insights/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": `${BASE_URL}/insights/${post.slug}#article`,
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            /* Author is the organisation until a named person replaces it —
               see the note at the top of lib/insights.ts. */
            author: { "@id": `${BASE_URL}/#organization` },
            publisher: { "@id": `${BASE_URL}/#organization` },
            mainEntityOfPage: `${BASE_URL}/insights/${post.slug}`,
            articleSection: post.category,
          },
          faqSchema(post.faqs),
        ]}
      />

      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.description}
        trail={trail}
        media={heroMediaFor(post.serviceCategory, post.serviceSlug)}
        image={heroImageFor(post.serviceCategory, post.serviceSlug)}
      />

      <section className="bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <article className="lg:col-span-8">
            <Reveal>
              <p className="border-b border-line-200 pb-5 text-[13px] text-slate-500">
                <span className="tabular">
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="mx-2">·</span>
                {post.minutes} min read
                <span className="mx-2">·</span>
                {post.author}
              </p>
              <p className="mt-8 text-[19px] leading-[1.62] text-ink-900">
                {post.lead}
              </p>
            </Reveal>

            {post.body.map((section, i) => (
              <Reveal key={section.heading} delay={i * 30}>
                <section className="mt-10">
                  <h2 className="font-display text-[24px] font-bold uppercase leading-tight text-ink-900">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((para, j) => (
                    <p
                      key={j}
                      className="mt-4 max-w-[70ch] text-[16px] leading-[1.62] text-ink-700"
                    >
                      {para}
                    </p>
                  ))}
                </section>
              </Reveal>
            ))}

            <section className="mt-14">
              <Reveal>
                <h2 className="font-display text-[24px] font-bold uppercase leading-tight text-ink-900">
                  Frequently asked
                </h2>
                <div className="mt-6">
                  <FaqList faqs={post.faqs} />
                </div>
              </Reveal>
            </section>
          </article>

          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-[128px]">
              {found && (
                <div className="rule-accent-top border border-line-200 bg-paper p-6">
                  <h2 className="label-caps text-[12px] text-slate-500">
                    The service
                  </h2>
                  <h3 className="mt-3 font-display text-[19px] font-bold uppercase leading-tight text-ink-900">
                    {found.service.name}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-slate-600">
                    {found.service.summary}
                  </p>
                  <Link
                    href={`/services/${post.serviceCategory}/${post.serviceSlug}`}
                    className="label-caps group mt-5 inline-flex items-center gap-2 text-blue-600"
                  >
                    Service details
                    <ArrowIcon className="size-4 transition-transform duration-[140ms] group-hover:translate-x-0.5" />
                  </Link>
                </div>
              )}

              {others.length > 0 && (
                <div className="card p-6">
                  <h2 className="label-caps text-[12px] text-slate-500">
                    More insights
                  </h2>
                  <ul className="mt-4 divide-y divide-line-100">
                    {others.map((o) => (
                      <li key={o.slug}>
                        <Link
                          href={`/insights/${o.slug}`}
                          className="group flex items-start justify-between gap-3 py-3 text-[15px] leading-snug text-ink-700 transition-colors duration-[140ms] hover:text-blue-600"
                        >
                          {o.title}
                          <ArrowIcon className="mt-1 size-4 shrink-0 text-slate-300 transition-transform duration-[140ms] group-hover:translate-x-0.5 group-hover:text-blue-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

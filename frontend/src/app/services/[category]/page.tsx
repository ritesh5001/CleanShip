import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { FaqList } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/service-cards";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/ui";
import { getCategory, serviceCategories } from "@/lib/services";
import { heroMediaFor } from "@/lib/service-media";
import { CoverageNote } from "@/components/locations";
import { categoryCoverage } from "@/lib/site";
import { HeroEnquiryForm } from "@/components/hero-enquiry-form";
import {
  breadcrumbSchema,
  buildMetadata,
  categorySchema,
  faqSchema,
} from "@/lib/seo";

type Params = { params: Promise<{ category: string }> };

/** Every category is known at build time, so all pages are static. */
export function generateStaticParams() {
  return serviceCategories.map((category) => ({ category: category.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) return { title: "Service not found" };

  return buildMetadata({
    title: category.seoTitle,
    description: category.metaDescription,
    path: `/services/${category.slug}`,
    keywords: category.keywords,
  });
}

export default async function CategoryPage({ params }: Params) {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) notFound();

  const trail = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: category.name, path: `/services/${category.slug}` },
  ];

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          categorySchema(category),
          faqSchema(category.faqs),
        ]}
      />

      <PageHero
        eyebrow={category.tagline}
        title={category.name}
        description={category.summary}
        trail={trail}
        media={heroMediaFor(category.slug)}
        aside={<HeroEnquiryForm serviceName={category.name} />}
      />

      {/* ---------- Introduction ---------- */}
      <section className="bg-white">
        <div className="container-page py-16 lg:py-20">
          <Reveal>
            <div className="rule-accent-left grid gap-8 border-y border-r border-line-200 bg-paper p-8 lg:grid-cols-2 lg:p-12">
              {category.intro.map((paragraph, i) => (
                <p key={i} className="text-[17px] leading-[1.62] text-ink-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {categoryCoverage[category.slug] && (
            <Reveal delay={80}>
              <CoverageNote
                areas={categoryCoverage[category.slug].areas}
                worldwide={categoryCoverage[category.slug].worldwide}
                className="mt-8"
              />
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------- Child services ---------- */}
      <section className="bg-paper">
        <div className="container-page py-16 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="Scopes Available"
              title={`${category.name} services`}
              description="Each scope below is a distinct service with its own method, crew and equipment. Combine them in one mobilisation where it makes sense."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.services.map((service, i) => (
              <ServiceCard
                key={service.slug}
                service={service}
                categorySlug={category.slug}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Questions"
                title={`${category.name} — frequently asked`}
              />
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <FaqList faqs={category.faqs} />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand
        title={`Need ${category.name.toLowerCase()} arranged?`}
        description="Send us the vessel, the port and the window. You get a scope, a crew size and an honest duration — usually the same working day."
      />
    </>
  );
}

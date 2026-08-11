import type { Metadata } from "next";
import { siteConfig, serviceAreas } from "./site";
import type { Faq, Service, ServiceCategory } from "./services";

/**
 * Metadata and JSON-LD builders.
 *
 * Every page routes its <head> through `buildMetadata` so canonical URLs,
 * Open Graph and Twitter cards can never drift apart, and every page emits
 * structured data from the builders below rather than hand-written JSON.
 */

export const BASE_URL = siteConfig.url;

type MetaInput = {
  title: string;
  description: string;
  /** Path with leading slash, e.g. "/services/hold-cleaning". */
  path: string;
  keywords?: readonly string[];
  /** Set true on pages that should stay out of the index (e.g. thank-you). */
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noIndex,
}: MetaInput): Metadata {
  const url = `${BASE_URL}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: "en_AE",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

/* -------------------------------------------------------------------- */
/* JSON-LD builders                                                     */
/* -------------------------------------------------------------------- */

const ORG_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

/**
 * Organization + LocalBusiness combined node. Emitted once, in the root
 * layout, and referenced by @id from every other node so search engines see
 * one entity rather than a new company on every page.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORG_ID,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: BASE_URL,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phones.map((p) => p.href.replace("tel:", "")),
    foundingDate: String(siteConfig.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.address.latitude,
      longitude: siteConfig.address.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    areaServed: serviceAreas.map((area) => ({ "@type": "Place", name: area })),
    sameAs: Object.values(siteConfig.social),
    knowsAbout: [
      "Cargo hold cleaning",
      "Marine tank cleaning",
      "Underwater hull cleaning",
      "Propeller polishing",
      "UWILD",
      "Marine NDT inspection",
      "Hydroblasting",
      "Marine painting",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: BASE_URL,
    name: siteConfig.name,
    description: siteConfig.shortDescription,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(service: Service, category: ServiceCategory) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/services/${category.slug}/${service.slug}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.metaDescription,
    provider: { "@id": ORG_ID },
    category: category.name,
    areaServed: serviceAreas.map((area) => ({ "@type": "Place", name: area })),
    url: `${BASE_URL}/services/${category.slug}/${service.slug}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.name} scope of work`,
      itemListElement: service.scope.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item.title },
      })),
    },
  };
}

export function categorySchema(category: ServiceCategory) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/services/${category.slug}#service`,
    name: category.name,
    serviceType: category.name,
    description: category.metaDescription,
    provider: { "@id": ORG_ID },
    url: `${BASE_URL}/services/${category.slug}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${category.name} services`,
      itemListElement: category.services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          url: `${BASE_URL}/services/${category.slug}/${s.slug}`,
        },
      })),
    },
  };
}

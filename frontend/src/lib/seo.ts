import type { Metadata } from "next";
import { offices, siteConfig, serviceAreas } from "./site";
import type { Faq, Service, ServiceCategory } from "./services";

/**
 * Metadata and JSON-LD builders.
 *
 * Every page routes its <head> through `buildMetadata` so canonical URLs,
 * Open Graph and Twitter cards can never drift apart, and every page emits
 * structured data from the builders below rather than hand-written JSON.
 */

export const BASE_URL = siteConfig.url;

/* -------------------------------------------------------------------- */
/* Length guards                                                         */
/*                                                                       */
/* Enforced HERE rather than left to each caller. Titles and descriptions */
/* are assembled from free text in several generated templates — project  */
/* write-ups, port pages, insight posts — and a template that fits for    */
/* one entry overflows for the next. Trimming each string by hand fixes   */
/* today's overflow and none of tomorrow's.                               */
/*                                                                       */
/* Google truncates around 60 characters of title and ~160 of description */
/* including the brand suffix. A snippet cut mid-word by the SERP reads   */
/* worse than one we ended deliberately.                                  */
/* -------------------------------------------------------------------- */

/** " | Cleanship" appended by the root layout's title template. */
const BRAND_SUFFIX_LENGTH = 12;
const TITLE_BUDGET = 60 - BRAND_SUFFIX_LENGTH;
const DESCRIPTION_BUDGET = 162;

/** Truncates on a word boundary, never mid-word and never on a connective. */
function fit(text: string, budget: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= budget) return clean;

  const cut = clean.slice(0, budget - 1);
  let end = cut.lastIndexOf(" ");
  while (
    end > 0 &&
    /\b(and|or|with|for|at|in|to|the|a|of|on|by)$/i.test(cut.slice(0, end))
  ) {
    end = cut.lastIndexOf(" ", end - 1);
  }
  return `${cut.slice(0, end > 0 ? end : budget - 1).replace(/[,;:—-]$/, "")}…`;
}

type MetaInput = {
  title: string;
  description: string;
  /** Path with leading slash, e.g. "/services/hold-cleaning". */
  path: string;
  /**
   * Overrides the canonical URL. Used by location-targeted landing pages
   * (e.g. "/hold-cleaning-in-sharjah") that exist for search intent but
   * should consolidate ranking signal onto the service page they duplicate,
   * rather than self-canonicalizing off `path`.
   */
  canonicalPath?: string;
  /**
   * Target terms for this page.
   *
   * NOT emitted as <meta name="keywords">. Google and Bing have ignored that
   * tag for over a decade, and the one we shipped was a stale UAE-only list on
   * a site where most pages target India — a tell that the head template was
   * carried over without review. The arrays stay because they document what
   * each page is built to rank for, and they feed nothing else.
   */
  keywords?: readonly string[];
  /**
   * Keeps the page out of the index while still following its links.
   *
   * Emits `noindex, follow`, never `noindex, nofollow`. The distinction
   * matters for the port scope pages: they are excluded so they stop
   * competing with their own port hub, but they still carry internal links
   * onward and must keep passing that signal. `nofollow` would strand them.
   */
  noIndex?: boolean;
  /**
   * Path under public/ for a page-specific share card. Without this a page
   * falls back to the generated site-wide card, which means every service
   * link shared on LinkedIn or WhatsApp looks identical — the single biggest
   * missed signal on an otherwise well-marked-up page.
   */
  image?: { url: string; alt: string };
};

export function buildMetadata({
  title,
  description,
  path,
  canonicalPath,
  keywords,
  noIndex,
  image,
}: MetaInput): Metadata {
  /* The root layout's title template appends " | Cleanship" to child pages,
     so their budget is 60 minus that. The homepage is not a child of the
     template and writes the brand inline, so it gets the full 60 — budgeting
     it at 48 clamped a title that already fitted. */
  const carriesBrand = title.includes(`| ${siteConfig.name}`);
  const fittedTitle = fit(title, carriesBrand ? 60 : TITLE_BUDGET);
  const fittedDescription = fit(description, DESCRIPTION_BUDGET);
  const url = `${BASE_URL}${path === "/" ? "" : path}`;
  const canonical = canonicalPath ? `${BASE_URL}${canonicalPath}` : url;
  // Absolute URLs — relative paths are not resolved by every scraper.
  const images = image
    ? [{ url: `${BASE_URL}${image.url}`, width: 1600, height: 900, alt: image.alt }]
    : undefined;

  void keywords;

  return {
    title: fittedTitle,
    description: fittedDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title: fittedTitle,
      description: fittedDescription,
      locale: "en_AE",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fittedTitle,
      description: fittedDescription,
      ...(images ? { images } : {}),
    },
    robots: noIndex
      ? { index: false, follow: true }
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

/**
 * One LocalBusiness node per operating base.
 *
 * The Organization node carries only the registered head office, so the seven
 * other bases were invisible to local search — a real gap for a contractor
 * whose whole pitch is "we have a crew near your vessel". Each is linked back
 * to the parent organisation via `parentOrganization`, so they read as
 * branches of one company rather than eight unrelated businesses.
 *
 * No coordinates are emitted for the branches: inventing a lat/long is worse
 * than omitting it, because a wrong pin sends people to the wrong place.
 * Add them from the Google Business Profile for each base.
 */
export function officeSchemas() {
  return offices.map((office) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#office-${office.city.toLowerCase().replace(/\s+/g, "-")}`,
    name: `${siteConfig.legalName} — ${office.city}`,
    parentOrganization: { "@id": ORG_ID },
    url: `${BASE_URL}/contact`,
    email: siteConfig.email,
    telephone: siteConfig.phones.map((p) => p.href.replace("tel:", "")),
    address: {
      "@type": "PostalAddress",
      ...(office.street ? { streetAddress: office.street } : {}),
      addressLocality: office.city,
      /* Some entries carry a state, e.g. "Gujarat, India". schema.org expects
         a country in addressCountry, so anything before the last comma is
         split out as addressRegion — "Gujarat, India" as a country is invalid
         and would be discarded by consumers. */
      ...(office.country.includes(",")
        ? {
            addressRegion: office.country
              .slice(0, office.country.lastIndexOf(","))
              .trim(),
            addressCountry: office.country
              .slice(office.country.lastIndexOf(",") + 1)
              .trim(),
          }
        : { addressCountry: office.country }),
    },
    ...(office.head
      ? { additionalType: "https://schema.org/Organization" }
      : {}),
  }));
}

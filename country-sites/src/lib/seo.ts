import type { Metadata } from "next";
import { company, offices, officePostalAddress, certification } from "@/content/company";
import { domains, site } from "@/content/site";
import type { Faq, Place, Service } from "@/content/types";

export const BASE_URL = site.url;
export const ORG_ID = `${BASE_URL}/#organization`;

export function buildMetadata({
  title,
  description,
  path,
  image,
  keywords,
}: {
  title?: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const url = `${BASE_URL}${path === "/" ? "" : path}`;
  const img = image ?? site.home.image;
  return {
    ...(title ? { title } : {}),
    description,
    keywords: keywords ?? site.keywords,
    alternates: {
      canonical: url || BASE_URL,
      /* The three domains are regional versions of one company, so the home
         pages declare each other. Inner pages are different content and get
         no alternates. cleanship.co must carry the same three links back. */
      ...(path === "/"
        ? { languages: { "en-AE": `${domains.ae}/`, "en-GR": `${domains.gr}/`, "x-default": `${domains.main}/` } }
        : {}),
    },
    openGraph: {
      type: "website",
      url: url || BASE_URL,
      siteName: `${company.name} ${site.code === "ae" ? "UAE" : "Greece"}`,
      locale: site.locale,
      title: title ?? site.defaultTitle,
      description,
      images: [{ url: img, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: title ?? site.defaultTitle, description, images: [img] },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORG_ID,
    name: company.legalName,
    alternateName: `${company.name} ${site.code === "ae" ? "UAE" : "Greece"}`,
    url: BASE_URL,
    logo: `${BASE_URL}/brand/cleanship-logo.webp`,
    image: `${BASE_URL}${site.home.image}`,
    description: site.description,
    email: company.email,
    telephone: company.phones.map((p) => p.href.replace("tel:", "")),
    foundingDate: String(company.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: company.registeredAddress.street,
      addressLocality: company.registeredAddress.locality,
      addressRegion: company.registeredAddress.region,
      addressCountry: company.registeredAddress.country,
    },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    sameAs: [domains.main, ...Object.values(company.social)],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: `${certification.title} — ${certification.number}`,
      credentialCategory: "Approval of Service Supplier",
      description: certification.scope,
      recognizedBy: { "@type": "Organization", name: certification.issuer, url: certification.issuerUrl },
      validFrom: certification.issued,
      expires: certification.validUntil,
    },
    knowsAbout: site.services.map((s) => s.name),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: `${company.name} ${site.code === "ae" ? "UAE" : "Greece"}`,
    inLanguage: site.lang,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${BASE_URL}${t.path === "/" ? "" : t.path}`,
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceSchema(service: Service, place?: Place) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: place ? `${service.name} at ${place.name}` : service.name,
    serviceType: service.name,
    description: service.metaDescription,
    provider: { "@id": ORG_ID },
    areaServed: place
      ? { "@type": "Place", name: `${place.name}, ${place.area}` }
      : site.code === "ae"
        ? { "@type": "Country", name: site.countryName }
        : site.places.map((p) => ({ "@type": "Place", name: `${p.name}, ${p.area}` })),
    url: `${BASE_URL}/services/${service.slug}`,
  };
}

export function officeSchemas() {
  return offices.map((o) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/offices#${o.slug}`,
    name: `${company.legalName} — ${o.city}`,
    parentOrganization: { "@id": ORG_ID },
    url: `${BASE_URL}/offices`,
    email: company.email,
    telephone: company.phones.map((p) => p.href.replace("tel:", "")),
    address: officePostalAddress(o),
  }));
}

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  name: string;
  /** Card / menu line. */
  short: string;
  /** Without the brand suffix. Keep under ~48 characters. */
  seoTitle: string;
  metaDescription: string;
  icon: "hull" | "hold" | "tank" | "ndt" | "offshore";
  image: string;
  intro: string[];
  points: string[];
  sections: { heading: string; body: string }[];
  faqs: Faq[];
  keywords: string[];
};

export type Place = {
  slug: string;
  name: string;
  /** Emirate on the UAE site; country on the Greek site. */
  area: string;
  waterBody?: string;
  unlocode?: string;
  /** One line for cards. */
  hook: string;
  seoTitle: string;
  metaDescription: string;
  body: string[];
  /** What the work looks like here, as short bullet lines. */
  work: string[];
  /** Service slugs most relevant here. */
  services: string[];
  faqs: Faq[];
};

export type SiteContent = {
  code: "ae" | "gr";
  domain: string;
  url: string;
  /** Open Graph locale. */
  locale: string;
  /** hreflang / html lang. */
  lang: string;
  countryName: string;
  /** ISO 3166-1 alpha-2 for schema areaServed. */
  countryCode: string;
  defaultTitle: string;
  description: string;
  keywords: string[];
  placesLabel: string;
  placesTitle: string;
  placesIntro: string;
  home: {
    eyebrow: string;
    title: string;
    lead: string;
    image: string;
    imageAlt: string;
    introTitle: string;
    intro: string[];
    why: { title: string; body: string }[];
    process: { title: string; body: string }[];
    faqs: Faq[];
  };
  about: { title: string; lead: string; paras: string[] };
  servicesIntro: string;
  contactIntro: string;
  /** Countries listed first in the offices block. */
  officeOrder: string[];
  services: Service[];
  places: Place[];
  areaServed: string[];
};

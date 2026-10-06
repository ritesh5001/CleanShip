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
  /** The site's name, e.g. "CleanShip UAE". Used in titles, schema and the header. */
  brand: string;
  /** Short tag beside the logo. */
  tag: string;
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
  /** Thin bar above the header. */
  topBar: string;
  /** Index into company.phones shown first on this site. */
  primaryPhone: 0 | 1;
  servicesTitle: string;
  portsPageTitle: string;
  whyTitle: string;
  /** Label for Place.area in the port fact box ("Emirate", "Country"). */
  areaLabel: string;
  /** Sidebar heading listing the ports for a service. */
  servicePortsLabel: string;
  /** Optional note under the offices grid. */
  officesNote?: string;
  /** Other Cleanship sites linked from the footer, and declared as hreflang alternates on the home page. */
  sisterSites: { label: string; url: string; hreflang: string }[];
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

/**
 * Single source of truth for company / NAP (Name-Address-Phone) data.
 * Keeping this in one place guarantees the details stay identical across
 * every page, the footer, and the structured data — which is what local SEO
 * consistency actually depends on.
 */

/**
 * WhatsApp enquiry link, defined once.
 *
 * The number and the pre-filled message live here as separate constants and
 * every link on the site is built from them, so the message can never drift
 * between the header, the hero, the CTA band, the service sidebars, the
 * floating bubble and the contact page. The contact page in particular used to
 * link to a bare `wa.me/<number>` with no text at all, which meant a visitor
 * arriving from there opened an empty chat and had to introduce themselves.
 *
 * `encodeURIComponent` does the escaping — never hand-encode the text, which
 * is how the previous URL ended up with a literal `%0A%0A` nobody could read.
 */
const WHATSAPP_NUMBER = "919236520609";

const WHATSAPP_MESSAGE =
  "Hi, I found CleanShip Marine Services through your website. I’d like to know more about your marine services.";

export const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export const siteConfig = {
  name: "Cleanship",
  legalName: "Cleanship Marine Services FZE",
  tagline: "Marine Cleaning You Can Trust",
  shortDescription:
    "Underwater hull cleaning, propeller polishing, hold and tank cleaning, offshore support and NDT services for bulk carriers, tankers and container ships worldwide.",
  description:
    "Cleanship Marine Services FZE is a trusted underwater hull cleaning specialist delivering professional in-water hull cleaning, propeller polishing, thruster work and UWILD, alongside cargo hold cleaning, tank cleaning, offshore support and NDT & repair services to bulk carriers, tankers, container ships and offshore vessels. Industry and port-compliant procedures, eco-friendly methods, experienced riding crews.",
  url: "https://www.cleanship.co",
  licence: "B.C. 1302955",
  foundingYear: 2019,

  email: "ops@cleanship.co",
  /**
   * phones[0] is the primary line — every CTA, the header, the hero and the
   * service sidebars read it directly. The India number leads at the brand
   * owner's direction; the UAE line is kept as a secondary contact rather
   * than dropped, so existing calls to it are not lost.
   */
  phones: [
    { label: "India", number: "+91 92365 20609", href: "tel:+919236520609" },
    { label: "UAE", number: "+971 55 402 9954", href: "tel:+971554029954" },
  ],
  whatsapp: WHATSAPP_NUMBER,
  /** The raw message, for anything that needs the text rather than the link. */
  whatsappMessage: WHATSAPP_MESSAGE,
  /**
   * Pre-filled WhatsApp deep link. Already percent-encoded — do not re-encode
   * it when building hrefs. Use this everywhere; never link to a bare
   * `wa.me/<number>`, which opens a chat with no message in it.
   */
  whatsappUrl: WHATSAPP_URL,

  address: {
    street: "Ajman Free Zone, C1 Building",
    locality: "Ajman",
    region: "Ajman",
    country: "AE",
    countryName: "United Arab Emirates",
    full: "B.C. 1302955, Ajman Free Zone C1 Building, Ajman, UAE",
    // Approximate coordinates for Ajman Free Zone — refine with the exact
    // pin from your Google Business Profile before launch.
    latitude: 25.4052,
    longitude: 55.4481,
  },

  hours: {
    office: "Monday – Saturday, 10:00 – 18:00 (GST)",
    operations: "Operations desk manned 24 / 7, 365 days",
  },

  social: {
    linkedin: "https://www.linkedin.com/company/cleanship",
    instagram: "https://www.instagram.com/cleanship",
    facebook: "https://www.facebook.com/cleanship",
  },
} as const;

/** Ports and regions we mention for local / long-tail SEO reach. */
export const serviceAreas = [
  "Fujairah",
  "Khor Fakkan",
  "Jebel Ali",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Abu Dhabi",
  "Hamriyah",
  "Khalifa Port",
  "Sohar",
  "Salalah",
  "Dammam",
  "Jubail",
  "Bahrain",
  "Singapore",
  "Kandla",
  "Mumbai",
  "Visakhapatnam",
  "Colombo",
  "Lomé",
  "Conakry",
] as const;

/**
 * Physical offices and operating bases, grouped by region.
 *
 * ⚠️ Two street lines need confirming before launch — see the notes on the
 * Colombo and Dammam entries. An address that is subtly wrong is worse than
 * one that is obviously missing, so nothing here has been silently corrected.
 */
export type Office = {
  city: string;
  country: string;
  /** Street line, omitted where only the city/zone was supplied. */
  street?: string;
  /** Grouping used by the locations grid. */
  region: "Middle East" | "South Asia" | "West Africa";
  /** Marks the registered head office. */
  head?: boolean;
};

export const offices: Office[] = [
  {
    city: "Ajman",
    country: "United Arab Emirates",
    street: "Ajman Free Zone, C1 Building",
    region: "Middle East",
    head: true,
  },
  {
    city: "Fujairah",
    country: "United Arab Emirates",
    street: "Al Hail",
    region: "Middle East",
  },
  {
    /* "Khor Fakkan" everywhere — the site previously used "Khorfakkan" here
       and "Khor Fakkan" in serviceAreas. Local search matches on exact-string
       agreement between the site and its citations, so one spelling only. */
    city: "Khor Fakkan",
    country: "United Arab Emirates",
    region: "Middle East",
  },
  {
    city: "Dammam",
    country: "Saudi Arabia",
    // Supplied as "our Commercial Centre, 1st Floor -Office 106" — the
    // building name looks truncated. Confirm before launch.
    street: "Commercial Centre, 1st Floor, Office 106",
    region: "Middle East",
  },
  {
    city: "Kandla",
    country: "Gujarat, India",
    region: "South Asia",
  },
  {
    city: "Visakhapatnam",
    country: "India",
    street: "Nad Kotha Road",
    region: "South Asia",
  },
  {
    city: "Colombo",
    country: "Sri Lanka",
    /* Supplied as "Merchantile Logistics, No 23, Alfered Place". Corrected to
       the real spellings — local citation matching is exact-string, so a
       misspelled street means every directory citation built against it fails
       to match and the office earns nothing. Confirm with the office. */
    street: "Mercantile Logistics, No 23, Alfred Place",
    region: "South Asia",
  },
  {
    city: "Conakry",
    country: "Guinea",
    street: "Sonoco Trade Center",
    region: "West Africa",
  },
];

/**
 * Where each service line actually operates.
 *
 * Coverage differs sharply by service — hull cleaning is a West Africa
 * operation while riding crews travel anywhere — so this is keyed by service
 * slug rather than stated once for the company. Slugs match lib/services.ts.
 */
export const serviceCoverage: Record<
  string,
  { label: string; areas: readonly string[]; worldwide?: boolean }
> = {
  "shore-gang": {
    label: "Hold Cleaning Shore Gang",
    areas: ["India", "UAE", "Sri Lanka", "Brazil", "West Africa ports"],
  },
  "riding-crew": {
    label: "Hold Cleaning Riding Crew",
    areas: [],
    worldwide: true,
  },
  "rope-access": {
    label: "Rope Access Hold Cleaning",
    areas: [],
    worldwide: true,
  },
  "underwater-hull-cleaning": {
    label: "Hull Cleaning",
    /* India leads because it is the only region with a published port-level
       programme behind it — see /hull-cleaning-in-india and the 33 port pages
       generated from lib/ports. Claiming West Africa alone while shipping 198
       Indian port pages would contradict the site's own content. */
    areas: [
      "India (33 ports)",
      "UAE",
      "Togo",
      "Côte d'Ivoire",
      "Liberia",
      "Sierra Leone",
      "Guinea",
      "Guinea-Bissau",
      "The Gambia",
      "Senegal",
    ],
  },
};

/** Coverage stated for a whole service line rather than one scope. */
export const categoryCoverage: Record<
  string,
  { areas: readonly string[]; worldwide?: boolean }
> = {
  "tank-cleaning": {
    areas: ["UAE", "Singapore", "India", "Sri Lanka", "Lomé"],
  },
  "hull-cleaning": {
    areas: [
      "India (33 ports)",
      "UAE",
      "Togo",
      "Côte d'Ivoire",
      "Liberia",
      "Sierra Leone",
      "Guinea",
      "Guinea-Bissau",
      "The Gambia",
      "Senegal",
    ],
  },
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  // The port network is the largest thing on the site; without a nav link its
  // several hundred pages were discoverable only via the sitemap and footer.
  { label: "Ports", href: "/ports" },
  { label: "Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

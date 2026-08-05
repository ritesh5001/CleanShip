/**
 * Single source of truth for company / NAP (Name-Address-Phone) data.
 * Keeping this in one place guarantees the details stay identical across
 * every page, the footer, and the structured data — which is what local SEO
 * consistency actually depends on.
 */

export const siteConfig = {
  name: "Cleanship",
  legalName: "Cleanship Marine Services FZE",
  tagline: "Marine Cleaning You Can Trust",
  shortDescription:
    "Hold cleaning, tank cleaning, underwater hull cleaning, offshore support and NDT services for bulk carriers, tankers and container ships worldwide.",
  description:
    "Cleanship Marine Services FZE is a trusted hold and tank cleaning service provider delivering professional cargo hold cleaning, tank cleaning, underwater hull cleaning, offshore support and NDT & repair services to bulk carriers, tankers, container ships and offshore vessels. IMO and port-compliant procedures, eco-friendly methods, experienced riding crews.",
  url: "https://www.cleanship.co",
  licence: "B.C. 1302955",
  foundingYear: 2019,

  email: "ops@cleanship.co",
  phones: [
    { label: "UAE", number: "+971 55 402 9954", href: "tel:+971554029954" },
    { label: "India", number: "+91 92365 20609", href: "tel:+919236520609" },
  ],
  whatsapp: "971554029954",

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
  "Colombo",
] as const;

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
] as const;

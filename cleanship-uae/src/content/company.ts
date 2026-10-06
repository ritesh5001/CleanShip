/**
 * The company itself — identical on cleanship.ae and cleanship.gr, and kept
 * identical to cleanship.co. Name, address and phone consistency across every
 * domain is what local search matches on, so change these together with
 * frontend/src/lib/site.ts.
 */

export const company = {
  name: "Cleanship",
  legalName: "Cleanship Marine Services FZE",
  licence: "B.C. 1302955",
  foundingYear: 2019,
  email: "admin@cleanship.co",
  mainSite: "https://www.cleanship.co",
  phones: [
    { label: "India", number: "+91 92365 20609", href: "tel:+919236520609" },
    { label: "UAE", number: "+971 55 402 9954", href: "tel:+971554029954" },
  ],
  whatsappNumber: "919236520609",
  hours: {
    office: "Monday – Saturday, 10:00 – 18:00 (GST)",
    operations: "Operations desk manned 24/7, 365 days",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/cleanshipmarine",
    instagram: "https://www.instagram.com/cleanship_marine_services/",
    facebook: "https://www.facebook.com/Cleanshipmarineservices/",
    youtube: "https://www.youtube.com/@Cleanshipmarineservices",
  },
  registeredAddress: {
    street: "B.C. 1302955, Ajman Free Zone C1 Building",
    locality: "Ajman",
    region: "Ajman",
    country: "AE",
    full: "B.C. 1302955, Ajman Free Zone C1 Building, Ajman, UAE",
  },
} as const;

export function whatsappUrl(domain: string) {
  const text = `Hi, I found CleanShip Marine Services through ${domain}. I'd like to know more about your marine services.`;
  return `https://api.whatsapp.com/send?phone=${company.whatsappNumber}&text=${encodeURIComponent(text)}`;
}

export type Office = {
  slug: string;
  city: string;
  country: string;
  street?: string;
  locality?: string;
  state?: string;
  postalCode?: string;
  head?: boolean;
};

/** Every office, same addresses as cleanship.co. */
export const offices: Office[] = [
  { slug: "ajman", city: "Ajman", country: "United Arab Emirates", street: "B.C. 1302955, Ajman Free Zone C1 Building", head: true },
  { slug: "fujairah", city: "Fujairah", country: "United Arab Emirates", street: "Al Maha Trading, Al Hail" },
  { slug: "khor-fakkan", city: "Khor Fakkan", country: "United Arab Emirates" },
  { slug: "dammam", city: "Dammam", country: "Saudi Arabia", street: "Hamra Commercial Centre, 1st Floor, Office 106" },
  {
    slug: "kandla",
    city: "Kandla",
    country: "India",
    street: "Plot No. 77, Bhageshree Township 1, Nr. Airport Chowkdi",
    locality: "Gandhidham, Kachchh",
    state: "Gujarat",
    postalCode: "370210",
  },
  {
    slug: "mumbai",
    city: "Mumbai",
    country: "India",
    street: "1st Floor, Loha Bhavan, Room No. 3, P D'Mello Road, Carnac Road, Victoria Docks, Masjid Bandar East",
    state: "Maharashtra",
    postalCode: "400009",
  },
  {
    slug: "lucknow",
    city: "Lucknow",
    country: "India",
    street: "Top Floor, Ph 01, Vrindavan Road, near Allen House Public School, Sector 5E, Telibagh",
    state: "Uttar Pradesh",
    postalCode: "226029",
  },
  { slug: "visakhapatnam", city: "Visakhapatnam", country: "India", street: "Nad Kotha Road" },
  { slug: "colombo", city: "Colombo", country: "Sri Lanka", street: "Colombo Mercantile Logistics, No 23, Alfred Place" },
  { slug: "conakry", city: "Conakry", country: "Guinea", street: "CleanShip Marine SUCC, 8th Avenue, Sonoco Trade" },
];

export function officeTownLine(o: Office) {
  const state = [o.state, o.postalCode].filter(Boolean).join(" ");
  return [o.locality ?? o.city, state, o.country].filter(Boolean).join(", ");
}

export function officePostalAddress(o: Office) {
  return {
    "@type": "PostalAddress",
    ...(o.street ? { streetAddress: o.street } : {}),
    addressLocality: o.locality ?? o.city,
    ...(o.state ? { addressRegion: o.state } : {}),
    ...(o.postalCode ? { postalCode: o.postalCode } : {}),
    addressCountry: o.country,
  };
}

/** Offices grouped by country, in a given country order. */
export function officesByCountry(order: string[]) {
  const countries = [...new Set(offices.map((o) => o.country))].sort(
    (a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99),
  );
  return countries.map((country) => ({ country, items: offices.filter((o) => o.country === country) }));
}

export const certification = {
  issuer: "Blue Wave Classification Ltd. (BW Class)",
  issuerUrl: "https://bwclass.org",
  title: "Certificate of Approval of Service Supplier",
  number: "BW/096439",
  scope:
    "Survey using Remote Inspection Techniques (RIT) as an alternative means for close-up survey of the structure of ships and mobile offshore units.",
  issued: "2026-07-23",
  validUntil: "2029-07-23",
  issuedIn: "Dubai, UAE",
};

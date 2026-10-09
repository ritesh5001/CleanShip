import { certification, company } from "./company";

/**
 * Greek display text for facts that live in company.ts.
 *
 * company.ts stays word-for-word identical across cleanship.co, .ae and .gr
 * (local search matches on consistent names and addresses, and the schema
 * reads it), so it keeps its English. Anything a visitor reads on this site
 * goes through here instead. Postal addresses stay in Latin script, as they
 * are written on the envelope.
 */

const COUNTRY: Record<string, string> = {
  "United Arab Emirates": "Ηνωμένα Αραβικά Εμιράτα",
  "Saudi Arabia": "Σαουδική Αραβία",
  India: "Ινδία",
  "Sri Lanka": "Σρι Λάνκα",
  Guinea: "Γουινέα",
};

const COUNTRY_SHORT: Record<string, string> = { "United Arab Emirates": "ΗΑΕ" };

export const countryName = (english: string) => COUNTRY[english] ?? english;
export const countryShort = (english: string) => COUNTRY_SHORT[english] ?? countryName(english);

const PHONE_LABEL: Record<string, string> = { India: "Ινδία", UAE: "ΗΑΕ" };
export const phoneLabel = (english: string) => PHONE_LABEL[english] ?? english;

export const hours = {
  office: "Δευτέρα – Σάββατο, 10:00 – 18:00 (ώρα Εμιράτων, GST)",
  operations: "Τμήμα επιχειρήσεων 24 ώρες το 24ωρο, 365 ημέρες τον χρόνο",
};

/** The certificate's own wording is English; this is what the page shows. */
export const certificateText = {
  issuer: certification.issuer,
  title: "Πιστοποιητικό Έγκρισης Παρόχου Υπηρεσιών",
  originalTitle: certification.title,
  scope:
    "Επιθεώρηση με Remote Inspection Techniques (RIT) ως εναλλακτικό μέσο για το close-up survey της κατασκευής πλοίων και κινητών υπεράκτιων μονάδων.",
  issuedIn: "Ντουμπάι, ΗΑΕ",
};

export function whatsappUrl(domain: string) {
  const text = `Γεια σας, βρήκα την CleanShip Marine Services μέσω του ${domain}. Θα ήθελα περισσότερες πληροφορίες για τις υπηρεσίες σας.`;
  return `https://api.whatsapp.com/send?phone=${company.whatsappNumber}&text=${encodeURIComponent(text)}`;
}

/** Dates as Greek readers write them: "23 Ιουλίου 2029". */
export const greekDate = (iso: string) =>
  new Date(iso).toLocaleDateString("el-GR", { day: "numeric", month: "long", year: "numeric" });

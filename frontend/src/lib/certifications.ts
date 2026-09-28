/**
 * Approvals and certificates held by the company.
 *
 * Shown on /about, on the relevant service page and in the Organization
 * schema (hasCredential). Only list a certificate we hold a copy of, with the
 * exact wording, number and dates from the document.
 *
 * `documentUrl`: put the scan in public/certificates/ and set the path. The
 * "View certificate" link appears only when it is set.
 */
export type Certification = {
  slug: string;
  title: string;
  issuer: string;
  issuerUrl?: string;
  number: string;
  scope: string;
  issued: string;
  validUntil: string;
  issuedIn: string;
  /** Service page this approval covers: [categorySlug, serviceSlug]. */
  service?: [string, string];
  documentUrl?: string;
};

export const certifications: Certification[] = [
  {
    slug: "bw-class-rit",
    title: "Certificate of Approval of Service Supplier",
    issuer: "Blue Wave Classification Ltd. (BW Class)",
    issuerUrl: "https://bwclass.org",
    number: "BW/096439",
    scope:
      "Firms engaged in survey using Remote Inspection Techniques (RIT) as an alternative means for Close-up Survey of the structure of ships and mobile offshore units.",
    issued: "2026-07-23",
    validUntil: "2029-07-23",
    issuedIn: "Dubai, UAE",
    service: ["ndt-and-repair", "remote-inspection-technology"],
  },
];

export function isCurrent(cert: Certification, now = new Date()) {
  return new Date(cert.validUntil) >= now;
}

export function formatCertDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

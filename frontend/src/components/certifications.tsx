import { CertificateIcon } from "./icons";
import { certifications, formatCertDate, isCurrent, type Certification } from "@/lib/certifications";

function CertCard({ cert }: { cert: Certification }) {
  return (
    <article className="card flex h-full flex-col gap-4 p-6 sm:flex-row sm:gap-6 sm:p-8">
      <CertificateIcon className="size-10 shrink-0 text-blue-600" />
      <div className="min-w-0">
        <p className="label-caps text-[11px] text-blue-600">{cert.issuer}</p>
        <h3 className="mt-2 font-display text-[21px] font-bold uppercase leading-tight text-ink-900">
          {cert.title}
        </h3>
        <p className="mt-3 text-[15px] leading-[1.6] text-slate-600">{cert.scope}</p>
        <dl className="mt-5 grid gap-x-6 gap-y-3 text-[14px] sm:grid-cols-3">
          <div>
            <dt className="text-slate-500">Certificate no.</dt>
            <dd className="tabular font-semibold text-ink-900">{cert.number}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Issued</dt>
            <dd className="font-semibold text-ink-900">
              {formatCertDate(cert.issued)}, {cert.issuedIn}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Valid until</dt>
            <dd className="font-semibold text-ink-900">{formatCertDate(cert.validUntil)}</dd>
          </div>
        </dl>
        {cert.documentUrl && (
          <a
            href={cert.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-[14px] font-semibold text-blue-600 underline underline-offset-2"
          >
            View certificate ↗
          </a>
        )}
      </div>
    </article>
  );
}

/** Current certificates, optionally only those covering one service. */
export function Certifications({
  service,
  heading = false,
}: {
  service?: [string, string];
  /** Render with its own "Approvals" section heading (service pages). */
  heading?: boolean;
}) {
  const list = certifications.filter(
    (c) =>
      isCurrent(c) &&
      (!service || (c.service?.[0] === service[0] && c.service?.[1] === service[1])),
  );
  if (list.length === 0) return null;
  const cards = (
    <div className="grid gap-5">
      {list.map((c) => (
        <CertCard key={c.slug} cert={c} />
      ))}
    </div>
  );
  if (!heading) return cards;
  return (
    <section className="mt-14">
      <h2 className="font-display text-[28px] font-bold uppercase leading-tight text-ink-900 sm:text-[32px]">
        Class approval
      </h2>
      <div className="mt-6">{cards}</div>
    </section>
  );
}

/** schema.org EducationalOccupationalCredential entries for hasCredential. */
export function credentialSchemas() {
  return certifications.filter((c) => isCurrent(c)).map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: `${c.title} — ${c.number}`,
    credentialCategory: "Approval of Service Supplier",
    description: c.scope,
    recognizedBy: { "@type": "Organization", name: c.issuer, ...(c.issuerUrl ? { url: c.issuerUrl } : {}) },
    validFrom: c.issued,
    expires: c.validUntil,
    ...(c.documentUrl ? { url: c.documentUrl } : {}),
  }));
}

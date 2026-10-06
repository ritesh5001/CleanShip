import { certification } from "@/content/company";
import { CertificateIcon } from "./icons";

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function CertificateCard() {
  if (new Date(certification.validUntil) < new Date()) return null;
  return (
    <article className="card flex flex-col gap-5 p-6 sm:flex-row sm:p-8">
      <CertificateIcon className="size-10 shrink-0 text-blue-600" />
      <div>
        <p className="label-caps text-[11px] text-blue-600">{certification.issuer}</p>
        <h3 className="mt-2 font-display text-[22px] font-bold uppercase leading-tight text-ink-900">{certification.title}</h3>
        <p className="mt-3 text-[15px] leading-[1.6] text-slate-600">{certification.scope}</p>
        <dl className="mt-5 grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-3">
          <div>
            <dt className="text-slate-500">Certificate no.</dt>
            <dd className="tabular font-semibold text-ink-900">{certification.number}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Issued</dt>
            <dd className="font-semibold text-ink-900">{fmt(certification.issued)}, {certification.issuedIn}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Valid until</dt>
            <dd className="font-semibold text-ink-900">{fmt(certification.validUntil)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

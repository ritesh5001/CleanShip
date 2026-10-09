import { certification } from "@/content/company";
import { certificateText, greekDate as fmt } from "@/content/labels";
import { CertificateIcon } from "./icons";

export function CertificateCard() {
  if (new Date(certification.validUntil) < new Date()) return null;
  return (
    <article className="card flex flex-col gap-5 p-6 sm:flex-row sm:p-8">
      <CertificateIcon className="size-10 shrink-0 text-blue-600" />
      <div>
        <p className="label-caps text-[11px] text-blue-600">{certificateText.issuer}</p>
        <h3 className="mt-2 font-display text-[22px] font-bold uppercase leading-tight text-ink-900">{certificateText.title}</h3>
        <p className="mt-1 text-[13px] italic text-slate-500">{certificateText.originalTitle}</p>
        <p className="mt-3 text-[15px] leading-[1.6] text-slate-600">{certificateText.scope}</p>
        <dl className="mt-5 grid gap-x-8 gap-y-3 text-[14px] sm:grid-cols-3">
          <div>
            <dt className="text-slate-500">Αρ. πιστοποιητικού</dt>
            <dd className="tabular font-semibold text-ink-900">{certification.number}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Έκδοση</dt>
            <dd className="font-semibold text-ink-900">{fmt(certification.issued)}, {certificateText.issuedIn}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Ισχύει έως</dt>
            <dd className="font-semibold text-ink-900">{fmt(certification.validUntil)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

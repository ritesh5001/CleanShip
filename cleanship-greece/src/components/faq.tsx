import type { Faq } from "@/content/types";
import { ChevronIcon } from "./icons";

/* Native <details>: answers stay in the HTML for crawlers and work without JS. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="border-t border-line-200">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-line-200">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-5 text-[17px] font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronIcon className="mt-1 size-5 shrink-0 text-blue-600 transition-transform duration-[220ms] group-open:rotate-180" />
          </summary>
          <p className="pb-6 pr-10 text-[16px] leading-[1.65] text-slate-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

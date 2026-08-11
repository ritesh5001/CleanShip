import type { Faq } from "@/lib/services";
import { ChevronIcon } from "./icons";

/**
 * FAQ accordion on native <details>/<summary>.
 *
 * Deliberately not a JS accordion: the answers stay in the initial HTML, so
 * crawlers index them and they pair correctly with the FAQPage structured
 * data. It also works with zero JavaScript.
 */
export function FaqList({
  faqs,
  onNavy = false,
}: {
  faqs: Faq[];
  onNavy?: boolean;
}) {
  return (
    <div
      className={`border-t ${onNavy ? "border-white/16" : "border-line-200"}`}
    >
      {faqs.map((faq) => (
        <details
          key={faq.q}
          className={`group border-b ${
            onNavy ? "border-white/16" : "border-line-200"
          }`}
        >
          <summary
            className={`flex cursor-pointer list-none items-start justify-between gap-5 py-5 transition-colors duration-[140ms] ${
              onNavy
                ? "text-white hover:text-aqua-200"
                : "text-ink-900 hover:text-blue-600"
            }`}
          >
            <span className="font-display text-[19px] font-semibold uppercase leading-tight">
              {faq.q}
            </span>
            <ChevronIcon
              className={`mt-0.5 size-5 shrink-0 transition-transform duration-[220ms] group-open:rotate-180 ${
                onNavy ? "text-aqua-200" : "text-blue-600"
              }`}
            />
          </summary>
          <p
            className={`max-w-[70ch] pb-6 pr-10 text-[15px] leading-[1.62] ${
              onNavy ? "text-white/72" : "text-ink-700"
            }`}
          >
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}

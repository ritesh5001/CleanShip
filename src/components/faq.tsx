import type { Faq } from "@/lib/services";
import { ChevronIcon } from "./icons";

/**
 * FAQ accordion built on native <details>/<summary>.
 *
 * Deliberately not a JS accordion: the answers stay in the DOM and in the
 * initial HTML, so crawlers index them and they pair correctly with the
 * FAQPage structured data. It also works with zero JavaScript.
 */
export function FaqList({
  faqs,
  light = false,
}: {
  faqs: Faq[];
  light?: boolean;
}) {
  return (
    <div className="divide-y divide-white/10 border-y border-white/10 data-[light=true]:divide-abyss-950/10 data-[light=true]:border-abyss-950/10" data-light={light}>
      {faqs.map((faq) => (
        <details key={faq.q} className="group py-5">
          <summary
            className={`flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-medium transition ${
              light
                ? "text-abyss-950 hover:text-marine-700"
                : "text-white hover:text-marine-300"
            }`}
          >
            <span>{faq.q}</span>
            <ChevronIcon
              className={`mt-0.5 size-5 shrink-0 transition-transform duration-300 group-open:rotate-180 ${
                light ? "text-marine-700" : "text-marine-400"
              }`}
            />
          </summary>
          <p
            className={`mt-3 max-w-3xl pr-9 text-sm leading-relaxed ${
              light ? "text-abyss-700" : "text-abyss-300"
            }`}
          >
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}

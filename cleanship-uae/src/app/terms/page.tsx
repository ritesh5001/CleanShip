import type { Metadata } from "next";
import { company } from "@/content/company";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = buildMetadata({ title: "Terms of Use", description: `Terms of use for ${site.domain}.`, path: "/terms" });

export default function TermsPage() {
  const trail = [{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }];
  return (
    <>
      <PageHero title="Terms of Use" trail={trail} />
      <article className="container-page max-w-3xl space-y-6 py-16 text-[16px] leading-[1.7] text-ink-700 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:uppercase [&_h2]:text-ink-900">
        <p>{site.domain} is operated by {company.legalName}, licence {company.licence}, {company.registeredAddress.full}.</p>
        <h2>Information on this site</h2>
        <p>The information on this site describes our services in general terms. It is not a quotation or a contract. Scope, price, duration and conditions for any job are agreed in writing for that job.</p>
        <h2>Port and class requirements</h2>
        <p>Port authority approvals and class society acceptance are decided by those bodies. We apply for them and work to their requirements, but we cannot guarantee their decisions.</p>
        <h2>Intellectual property</h2>
        <p>The text, design and logo on this site belong to {company.legalName} and may not be copied without permission.</p>
        <h2>Contact</h2>
        <p>Questions about these terms: <a className="text-blue-600 underline" href={`mailto:${company.email}`}>{company.email}</a>.</p>
      </article>
    </>
  );
}

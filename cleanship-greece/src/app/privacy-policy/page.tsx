import type { Metadata } from "next";
import { company } from "@/content/company";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = buildMetadata({ title: "Privacy Policy", description: `How ${company.legalName} handles personal data submitted through ${site.domain}.`, path: "/privacy-policy" });

export default function PrivacyPage() {
  const trail = [{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }];
  return (
    <>
      <PageHero title="Privacy Policy" trail={trail} />
      <article className="container-page max-w-3xl space-y-6 py-16 text-[16px] leading-[1.7] text-ink-700 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:uppercase [&_h2]:text-ink-900">
        <p>This policy explains how {company.legalName} (&ldquo;Cleanship&rdquo;), {company.registeredAddress.full}, handles personal data submitted through {site.domain}.</p>
        <h2>What we collect</h2>
        <p>When you send an enquiry we receive the details you enter: name, email address, phone number, company, vessel name or IMO number, the service you are interested in and your message. Our server also records a hashed form of your IP address and your browser type to help detect spam.</p>
        <h2>How we use it</h2>
        <p>We use your details only to answer your enquiry, prepare a quote and carry out the work you ask for. We do not sell personal data or use it for unrelated marketing.</p>
        <h2>Who processes it</h2>
        <p>Enquiries are stored in our own enquiry system and delivered by email through our email provider. The security check on the form is provided by Cloudflare Turnstile. If analytics are enabled, Google Analytics receives anonymous usage data.</p>
        <h2>How long we keep it</h2>
        <p>Enquiry records are kept for as long as needed to respond and for our normal business records, after which they are deleted.</p>
        <h2>Your rights</h2>
        <p>You can ask to see, correct or delete the personal data we hold about you by emailing <a className="text-blue-600 underline" href={`mailto:${company.email}`}>{company.email}</a>.</p>
      </article>
    </>
  );
}

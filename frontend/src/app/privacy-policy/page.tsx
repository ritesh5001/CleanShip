import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy — CleanShip Marine",
  description:
    "CleanShip Marine privacy policy. Learn how we collect, use, and protect your personal information.",
  path: "/privacy-policy",
  keywords: ["privacy policy", "data protection", "personal information"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy-policy" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />

      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How CleanShip Marine collects and protects your personal information"
        trail={trail}
      />

      <section className="bg-white">
        <div className="container-page py-14 lg:py-20">
          <div className="prose prose-sm lg:prose-base max-w-3xl">
            <h2>Introduction</h2>
            <p>
              CleanShip Marine (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;Company&quot;) operates the cleanship.co website.
              This page informs you of our policies regarding the collection, use, and disclosure of
              personal data when you use our Service and the choices you have associated with that
              data.
            </p>

            <h2>Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes:</p>

            <h3>Personal Data</h3>
            <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, State, Province, ZIP/Postal code, City</li>
              <li>Cookies and Usage Data</li>
            </ul>

            <h3>Usage Data</h3>
            <p>
              We may also collect information on how the Service is accessed and used (&quot;Usage Data&quot;).
              This may include information such as your computer&apos;s Internet Protocol address (e.g. IP
              address), browser type, browser version, the pages you visit, the time and date of your
              visit, the time spent on those pages, and other diagnostic data.
            </p>

            {/* Added when Google Analytics 4 was installed. A privacy policy
                that does not name the analytics processor is inaccurate the
                moment the tag goes live, and "Cookies and Usage Data" in a
                list is not a disclosure. */}
            <h3>Cookies and analytics</h3>
            <p>
              We use Google Analytics 4, a web analytics service provided by
              Google LLC, to understand how visitors use this website. It sets
              cookies in your browser that record information such as the pages
              you view, how you arrived at the site and roughly where in the
              world you are. This data is processed by Google on our behalf and
              is used only in aggregate — we do not use it to identify
              individual visitors, and we do not sell it.
            </p>
            <p>
              You can prevent this collection by using your browser&apos;s
              cookie controls, by enabling &quot;Do Not Track&quot;, or by
              installing Google&apos;s official opt-out browser add-on at{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                rel="noopener noreferrer"
                target="_blank"
              >
                tools.google.com/dlpage/gaoptout
              </a>
              . Blocking analytics cookies does not affect any part of this
              website&apos;s functionality.
            </p>
            <p>
              Google&apos;s own handling of this data is governed by its
              privacy policy, which is published at{" "}
              <a
                href="https://policies.google.com/privacy"
                rel="noopener noreferrer"
                target="_blank"
              >
                policies.google.com/privacy
              </a>
              .
            </p>

            <h2>Use of Data</h2>
            <p>CleanShip Marine uses the collected data for various purposes:</p>
            <ul>
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve the Service</li>
              <li>To monitor the usage of the Service</li>
              <li>To detect, prevent and address technical and security issues</li>
            </ul>

            <h2>Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of
              transmission over the Internet or method of electronic storage is 100% secure. While we
              strive to use commercially acceptable means to protect your personal data, we cannot
              guarantee its absolute security.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the &quot;effective date&quot; at the
              top of this Privacy Policy.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

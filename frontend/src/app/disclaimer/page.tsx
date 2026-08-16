import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer — CleanShip Marine",
  description:
    "CleanShip Marine disclaimer. Important legal disclaimers regarding the use of our website and services.",
  path: "/disclaimer",
  keywords: ["disclaimer", "legal disclaimer", "liability"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Disclaimer", path: "/disclaimer" },
];

export default function DisclaimerPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />

      <PageHero
        eyebrow="Legal"
        title="Disclaimer"
        description="Important information about the use of CleanShip Marine website and services"
        trail={trail}
      />

      <section className="bg-white">
        <div className="container-page py-14 lg:py-20">
          <div className="prose prose-sm lg:prose-base max-w-3xl">
            <h2>Website Disclaimer</h2>
            <p>
              The information provided on this website is for general informational purposes only. While
              we strive to keep the information up to date and accurate, CleanShip Marine makes no
              representations or warranties of any kind, express or implied, about the completeness,
              accuracy, reliability, suitability, or availability with respect to the website or the
              information, products, services, or related graphics contained on the website for any
              purpose.
            </p>

            <h2>No Professional Advice</h2>
            <p>
              The content on this website should not be construed as professional advice. Any reliance
              you place on such information is strictly at your own risk. In no event will CleanShip
              Marine be liable for any loss or damage including without limitation, indirect or
              consequential loss or damage, or any loss or damage whatsoever arising from loss of data or
              profits arising out of, or in connection with, the use of this website.
            </p>

            <h2>Service Availability</h2>
            <p>
              Through this website you are able to link to other websites which are not under the
              control of CleanShip Marine. We have no control over the nature, content and availability
              of those sites. The inclusion of any links does not necessarily imply a recommendation or
              endorse the views expressed within them.
            </p>

            <h2>Third-Party Content</h2>
            <p>
              CleanShip Marine is not responsible for the content of external internet sites. You use
              these external sites at your own risk and subject to the terms and conditions of those
              sites. CleanShip Marine will not be liable for any damage or loss caused by inaccurate,
              misleading, or incomplete information or services provided through external sites.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              In no event shall CleanShip Marine be liable for any indirect, incidental, special,
              consequential, or punitive damages, including but not limited to, damages for loss of
              profits, goodwill, use, data, or other intangible losses (even if CleanShip Marine has
              been advised of the possibility of such damages), resulting from:
            </p>
            <ul>
              <li>The use or inability to use the website or services</li>
              <li>The cost of procurement of substitute goods or services</li>
              <li>Any unauthorized access to or alteration of your transmissions or data</li>
              <li>Any other matter relating to the website or services</li>
            </ul>

            <h2>Changes to This Disclaimer</h2>
            <p>
              CleanShip Marine reserves the right to modify this disclaimer at any time. Changes to
              this disclaimer are effective when posted to the website. Your continued use of the
              website following the posting of revised disclaimer means that you accept and agree to
              the changes.
            </p>

            <h2>Governing Law</h2>
            <p>
              This disclaimer is governed by and construed in accordance with the laws of the United
              Arab Emirates, and you irrevocably submit to the exclusive jurisdiction of the courts in
              that location.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Disclaimer, please contact us at{" "}
              <a href="mailto:info@cleanship.co">info@cleanship.co</a>.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

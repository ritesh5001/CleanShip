import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions — CleanShip Marine",
  description:
    "CleanShip Marine terms and conditions. Please read these terms carefully before using our services.",
  path: "/terms-and-conditions",
  keywords: ["terms and conditions", "terms of service", "legal terms"],
});

const trail = [
  { name: "Home", path: "/" },
  { name: "Terms & Conditions", path: "/terms-and-conditions" },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(trail)]} />

      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="The terms governing the use of CleanShip Marine services"
        trail={trail}
      />

      <section className="bg-white">
        <div className="container-page py-14 lg:py-20">
          <div className="prose prose-sm lg:prose-base max-w-3xl">
            <h2>1. Agreement to Terms</h2>
            <p>
              These Terms and Conditions constitute a legal agreement between you and CleanShip
              Marine. By accessing and using this website, you accept and agree to be bound by the
              terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or
              software) from CleanShip Marine website for personal, non-commercial transitory viewing
              only. This is the grant of a license, not a transfer of title, and under this license
              you may not:
            </p>
            <ul>
              <li>Modifying or copying the materials</li>
              <li>
                Using the materials for any commercial purpose or for any public display (commercial
                or non-commercial)
              </li>
              <li>Attempting to decompile or reverse engineer any software contained on the website</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>
                Transferring the materials to another person or "mirroring" the materials on any other
                server
              </li>
            </ul>

            <h2>3. Disclaimer</h2>
            <p>
              The materials on CleanShip Marine website are provided on an 'as is' basis. CleanShip
              Marine makes no warranties, expressed or implied, and hereby disclaims and negates all
              other warranties including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or non-infringement of intellectual
              property or other violation of rights.
            </p>

            <h2>4. Limitations</h2>
            <p>
              In no event shall CleanShip Marine or its suppliers be liable for any damages (including,
              without limitation, damages for loss of data or profit, or due to business interruption)
              arising out of the use or inability to use the materials on CleanShip Marine website, even
              if CleanShip Marine or an authorized representative has been notified orally or in writing
              of the possibility of such damage.
            </p>

            <h2>5. Accuracy of Materials</h2>
            <p>
              The materials appearing on CleanShip Marine website could include technical, typographical,
              or photographic errors. CleanShip Marine does not warrant that any of the materials on
              CleanShip Marine website are accurate, complete, or current. CleanShip Marine may make
              changes to the materials contained on its website at any time without notice.
            </p>

            <h2>6. Links</h2>
            <p>
              CleanShip Marine has not reviewed all of the sites linked to its website and is not
              responsible for the contents of any such linked site. The inclusion of any link does not
              imply endorsement by CleanShip Marine of the site. Use of any such linked website is at
              the user's own risk.
            </p>

            <h2>7. Modifications</h2>
            <p>
              CleanShip Marine may revise these terms and conditions for its website at any time
              without notice. By using this website, you are agreeing to be bound by the then current
              version of these terms and conditions.
            </p>

            <h2>8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of
              the United Arab Emirates, and you irrevocably submit to the exclusive jurisdiction of the
              courts in that location.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at{" "}
              <a href="mailto:info@cleanship.co">info@cleanship.co</a>.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

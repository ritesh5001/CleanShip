import type { Metadata } from "next";
import { company } from "@/content/company";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = buildMetadata({ title: "Όροι χρήσης", description: `Όροι χρήσης του ${site.domain}.`, path: "/terms" });

export default function TermsPage() {
  const trail = [{ name: "Αρχική", path: "/" }, { name: "Όροι χρήσης", path: "/terms" }];
  return (
    <>
      <PageHero title="Όροι χρήσης" trail={trail} />
      <article className="container-page max-w-3xl space-y-6 py-16 text-[16px] leading-[1.7] text-ink-700 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:uppercase [&_h2]:text-ink-900">
        <p>Τον ιστότοπο {site.domain} διαχειρίζεται η {company.legalName}, άδεια {company.licence}, {company.registeredAddress.full}.</p>
        <h2>Πληροφορίες του ιστότοπου</h2>
        <p>Οι πληροφορίες του ιστότοπου περιγράφουν τις υπηρεσίες μας σε γενικές γραμμές. Δεν αποτελούν προσφορά ούτε σύμβαση. Το εύρος, η τιμή, η διάρκεια και οι όροι κάθε εργασίας συμφωνούνται γραπτώς για τη συγκεκριμένη εργασία.</p>
        <h2>Απαιτήσεις λιμένων και νηογνωμόνων</h2>
        <p>Οι άδειες των λιμενικών αρχών και η αποδοχή από τους νηογνώμονες αποφασίζονται από τους ίδιους τους φορείς. Τις αιτούμαστε και εργαζόμαστε σύμφωνα με τις απαιτήσεις τους, αλλά δεν μπορούμε να εγγυηθούμε τις αποφάσεις τους.</p>
        <h2>Πνευματική ιδιοκτησία</h2>
        <p>Τα κείμενα, ο σχεδιασμός και το λογότυπο του ιστότοπου ανήκουν στην {company.legalName} και δεν επιτρέπεται η αντιγραφή τους χωρίς άδεια.</p>
        <h2>Επικοινωνία</h2>
        <p>Ερωτήσεις για τους παρόντες όρους: <a className="text-blue-600 underline" href={`mailto:${company.email}`}>{company.email}</a>.</p>
      </article>
    </>
  );
}

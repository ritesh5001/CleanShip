import type { Metadata } from "next";
import { company } from "@/content/company";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = buildMetadata({ title: "Πολιτική απορρήτου", description: `Πώς η ${company.legalName} χειρίζεται τα προσωπικά δεδομένα που υποβάλλονται μέσω του ${site.domain}.`, path: "/privacy-policy" });

export default function PrivacyPage() {
  const trail = [{ name: "Αρχική", path: "/" }, { name: "Πολιτική απορρήτου", path: "/privacy-policy" }];
  return (
    <>
      <PageHero title="Πολιτική απορρήτου" trail={trail} />
      <article className="container-page max-w-3xl space-y-6 py-16 text-[16px] leading-[1.7] text-ink-700 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:uppercase [&_h2]:text-ink-900">
        <p>Η παρούσα πολιτική εξηγεί πώς η {company.legalName} (&laquo;Cleanship&raquo;), {company.registeredAddress.full}, χειρίζεται τα προσωπικά δεδομένα που υποβάλλονται μέσω του {site.domain}.</p>
        <h2>Τι συλλέγουμε</h2>
        <p>Όταν μας στέλνετε αίτημα, λαμβάνουμε τα στοιχεία που συμπληρώνετε: ονοματεπώνυμο, διεύθυνση email, αριθμό τηλεφώνου, εταιρεία, όνομα πλοίου ή αριθμό IMO, την υπηρεσία που σας ενδιαφέρει και το μήνυμά σας.</p>
        <h2>Πώς τα χρησιμοποιούμε</h2>
        <p>Χρησιμοποιούμε τα στοιχεία σας μόνο για να απαντήσουμε στο αίτημά σας, να ετοιμάσουμε προσφορά και να εκτελέσουμε την εργασία που ζητάτε. Δεν πουλάμε προσωπικά δεδομένα και δεν τα χρησιμοποιούμε για άσχετη προώθηση.</p>
        <h2>Ποιος τα επεξεργάζεται</h2>
        <p>Ο ιστότοπος δεν διατηρεί βάση δεδομένων με αιτήματα. Το αίτημά σας αποστέλλεται με email στο γραφείο μας μέσω του παρόχου email μας, Resend, και λαμβάνετε επιβεβαίωση με email. Ο έλεγχος ασφαλείας της φόρμας παρέχεται από το Cloudflare Turnstile. Αν είναι ενεργοποιημένα τα στατιστικά επισκεψιμότητας, το Google Analytics λαμβάνει ανώνυμα δεδομένα χρήσης.</p>
        <h2>Πόσο καιρό τα διατηρούμε</h2>
        <p>Τα email των αιτημάτων διατηρούνται στο γραμματοκιβώτιό μας όσο χρειάζεται για να απαντήσουμε και για τα συνήθη επιχειρηματικά μας αρχεία, και στη συνέχεια διαγράφονται.</p>
        <h2>Τα δικαιώματά σας</h2>
        <p>Μπορείτε να ζητήσετε πρόσβαση, διόρθωση ή διαγραφή των προσωπικών δεδομένων που τηρούμε για εσάς στέλνοντας email στο <a className="text-blue-600 underline" href={`mailto:${company.email}`}>{company.email}</a>.</p>
      </article>
    </>
  );
}

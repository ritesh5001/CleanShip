import type { Metadata } from "next";
import { Button } from "@/components/ui";

export const metadata: Metadata = { title: "Η σελίδα δεν βρέθηκε", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="container-page py-28 text-center">
      <p className="eyebrow justify-center">404</p>
      <h1 className="text-h1 mt-5 text-ink-900">Η σελίδα δεν βρέθηκε</h1>
      <p className="text-lead mx-auto mt-5 max-w-xl text-slate-600">Η σελίδα που αναζητάτε έχει μετακινηθεί ή δεν υπάρχει.</p>
      <div className="mt-9 flex justify-center gap-3">
        <Button href="/">Αρχική</Button>
        <Button href="/contact" variant="outline">Επικοινωνία</Button>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { Button } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="container-page py-28 text-center">
      <p className="eyebrow justify-center">404</p>
      <h1 className="text-h1 mt-5 text-ink-900">Page not found</h1>
      <p className="text-lead mx-auto mt-5 max-w-xl text-slate-600">The page you were looking for has moved or does not exist.</p>
      <div className="mt-9 flex justify-center gap-3">
        <Button href="/">Home</Button>
        <Button href="/contact" variant="outline">Contact us</Button>
      </div>
    </section>
  );
}

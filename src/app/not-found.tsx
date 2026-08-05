import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui";
import { serviceCategories } from "@/lib/services";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden py-28 lg:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_0%,#123a6b_0%,#0a1e31_50%,#04121f_100%)]" />
        <div className="grid-lines mask-fade absolute inset-0 opacity-50" />
      </div>

      <div className="container-page text-center">
        <p className="font-display text-7xl text-marine-400/30 sm:text-8xl">404</p>
        <h1 className="mt-4 text-3xl text-white sm:text-4xl">
          This page has drifted off station
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-abyss-300">
          The page you were looking for does not exist, or has moved. Our
          services are all listed below.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="ghost">
            Contact us
          </Button>
        </div>

        <ul className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {serviceCategories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/services/${category.slug}`}
                className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-abyss-200 transition hover:border-marine-400/40 hover:text-marine-300"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

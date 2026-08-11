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
    <section className="on-navy bg-navy-900">
      <div className="container-page py-28 text-center lg:py-40">
        <p className="tabular text-[64px] leading-none text-aqua-500/40 sm:text-[80px]">
          404
        </p>
        <h1 className="mt-6 text-[clamp(30px,4.4vw,46px)] leading-[1.06] text-white">
          This page has drifted off station
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.62] text-white/72">
          The page you were looking for does not exist, or has moved. Our
          services are all listed below.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" variant="light">
            Back to home
          </Button>
          <Button href="/contact" variant="ghost-navy">
            Contact us
          </Button>
        </div>

        <ul className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {serviceCategories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/services/${category.slug}`}
                className="inline-block border border-white/16 px-4 py-2.5 text-[14px] text-white/72 transition-colors duration-[140ms] hover:border-aqua-500 hover:text-white"
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

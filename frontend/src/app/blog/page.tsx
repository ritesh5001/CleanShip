import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { BASE_URL, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { categorySlug, formatPostDate, getPublishedPosts, readingMinutes } from "@/lib/blog";
import { insights } from "@/lib/insights";

export const revalidate = 300;

type Props = { searchParams: Promise<{ category?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  const meta = buildMetadata({
    title: "Blog — Hull, Hold and Tank Cleaning Guides",
    description:
      "Practical guides on underwater hull cleaning, cargo hold preparation, tank cleaning and in-water survey from Cleanship's operations team.",
    path: "/blog",
  });
  /* A filtered view is the same list, narrowed: keep it out of the index and
     point it at the main page, so ?category= URLs never compete with /blog. */
  return category ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const posts = (await getPublishedPosts()).filter((p) => !p.noindex || category);
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))].sort();
  const shown = category ? posts.filter((p) => categorySlug(p.category) === category) : posts;
  const activeLabel = categories.find((c) => categorySlug(c) === category);

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${BASE_URL}/blog#blog`,
            url: `${BASE_URL}/blog`,
            name: "Cleanship Blog",
            publisher: { "@id": `${BASE_URL}/#organization` },
            blogPost: posts.slice(0, 20).map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `${BASE_URL}/blog/${p.slug}`,
              datePublished: p.publishedAt ?? undefined,
              dateModified: p.updatedAt,
            })),
          },
        ]}
      />

      <section className="bg-white">
        <div className="container-page py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="text-[14px] text-slate-500">
            <Link href="/" className="text-blue-600 underline underline-offset-2">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink-700">Blog</span>
          </nav>
          <h1 className="mt-4 font-display text-[36px] font-bold leading-tight text-ink-900 sm:text-[46px] normal-case">
            {activeLabel ? activeLabel : "Blog"}
          </h1>
          <p className="mt-3 max-w-[62ch] text-[17px] leading-[1.65] text-slate-600">
            Practical guides from the people who do the work — hull, hold and
            tank cleaning, in-water survey and the port conditions that decide
            how a job goes.
          </p>
          <p className="mt-3 text-[13px]">
            <a href="/blog/rss.xml" className="text-blue-600 underline underline-offset-2">RSS feed</a>
          </p>

          {categories.length > 1 && (
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Categories">
              <li>
                <Link
                  href="/blog"
                  className={`inline-block border px-3 py-1.5 text-[13px] font-medium ${
                    !category ? "border-ink-900 bg-ink-900 text-white" : "border-line-200 text-slate-700 hover:border-blue-400"
                  }`}
                >
                  All
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/blog?category=${categorySlug(c)}`}
                    className={`inline-block border px-3 py-1.5 text-[13px] font-medium ${
                      category === categorySlug(c)
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-line-200 text-slate-700 hover:border-blue-400"
                    }`}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {shown.length === 0 ? (
            <p className="mt-12 border border-line-200 p-10 text-center text-slate-500">
              No articles published yet.
            </p>
          ) : (
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col border border-line-200 transition-colors duration-[140ms] hover:border-blue-400"
                  >
                    {p.coverImageUrl && (
                      /* eslint-disable-next-line @next/next/no-img-element -- author-supplied URL */
                      <img
                        src={p.coverImageUrl}
                        alt={p.coverImageAlt ?? ""}
                        loading="lazy"
                        className="aspect-[16/9] w-full object-cover"
                      />
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      {p.category && (
                        <span className="text-[12px] font-semibold uppercase tracking-wide text-blue-600">
                          {p.category}
                        </span>
                      )}
                      <h2 className="mt-2 text-[20px] font-semibold normal-case leading-snug text-ink-900 group-hover:text-blue-600">
                        {p.title}
                      </h2>
                      {p.description && (
                        <p className="mt-3 line-clamp-3 text-[15px] leading-[1.6] text-slate-600">{p.description}</p>
                      )}
                      <p className="mt-auto pt-5 text-[13px] text-slate-500">
                        {formatPostDate(p.publishedAt)} · {readingMinutes(p.words)} min read
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* The two articles written before the blog existed live at
              /insights. Listed here so they stay one click from the blog
              until they are moved into the admin panel. */}
          {!category && insights.length > 0 && (
            <section className="mt-16 border-t border-line-200 pt-10">
              <h2 className="font-display text-[22px] font-bold text-ink-900 normal-case">Earlier articles</h2>
              <ul className="mt-5 grid gap-4 md:grid-cols-2">
                {insights.map((i) => (
                  <li key={i.slug}>
                    <Link
                      href={`/insights/${i.slug}`}
                      className="group block h-full border border-line-200 p-5 hover:border-blue-400"
                    >
                      <span className="text-[12px] font-semibold uppercase tracking-wide text-blue-600">{i.category}</span>
                      <span className="mt-1 block text-[17px] font-semibold leading-snug text-ink-900 group-hover:text-blue-600">
                        {i.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { FaqList } from "@/components/faq";
import { Markdown } from "./markdown";
import { Toc } from "./toc";
import {
  categorySlug,
  formatPostDate,
  readingMinutes,
  tocOf,
  wordCount,
  type Post,
  type PostSummary,
} from "@/lib/blog";

/**
 * The article layout — breadcrumbs, byline, title, lead, a sticky contents
 * rail built from the ## / ### headings, the body, sources, FAQs and related
 * posts. Modelled on a reference-wiki page: long, structured, skimmable.
 *
 * Shared by the public page and the admin preview so what an editor previews
 * is exactly what gets published. It renders no <JsonLd> itself: the public
 * page adds the structured data, the preview must not.
 */
export function PostArticle({
  post,
  related = [],
  preview = false,
}: {
  post: Post;
  related?: PostSummary[];
  preview?: boolean;
}) {
  const toc = tocOf(post.body);
  const words = wordCount(post);
  const published = formatPostDate(post.publishedAt);
  const updated = formatPostDate(post.updatedAt);
  const showUpdated = post.publishedAt && updated && updated !== published;

  return (
    <div className="bg-white">
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14 lg:py-14 xl:grid-cols-[280px_minmax(0,760px)]">
        <aside className="hidden lg:block">
          <div className="sticky top-[128px]">
            <Toc items={toc} variant="rail" />
          </div>
        </aside>

        <article className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-[14px] text-slate-500">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="text-blue-600 underline underline-offset-2">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="text-blue-600 underline underline-offset-2">Blog</Link>
              </li>
              {post.category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link
                      href={`/blog?category=${categorySlug(post.category)}`}
                      className="text-blue-600 underline underline-offset-2"
                    >
                      {post.category}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-ink-700">{post.title}</li>
            </ol>
          </nav>

          <p className="mt-4 text-[14px] text-slate-600">
            {post.authorName ? (
              <>
                By <span className="font-medium text-ink-900">{post.authorName}</span>
                {post.authorRole ? `, ${post.authorRole}` : ""}
              </>
            ) : (
              <>By <span className="font-medium text-ink-900">Cleanship Marine Services</span></>
            )}
            {published && (
              <>
                {" · "}Published <time dateTime={post.publishedAt!}>{published}</time>
              </>
            )}
            {showUpdated && (
              <>
                {" · "}last updated <time dateTime={post.updatedAt}>{updated}</time>
              </>
            )}
            {" · "}
            {readingMinutes(words)} min read
          </p>

          <h1 className="mt-4 font-display text-[34px] font-bold leading-[1.1] text-ink-900 sm:text-[44px] normal-case">
            {post.title}
          </h1>

          {post.coverImageUrl && (
            <figure className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element -- author-supplied URL of unknown size */}
              <img
                src={post.coverImageUrl}
                alt={post.coverImageAlt ?? ""}
                className="h-auto w-full border border-line-200"
                fetchPriority="high"
              />
              {post.coverImageAlt && (
                <figcaption className="mt-2 text-[13px] text-slate-500">{post.coverImageAlt}</figcaption>
              )}
            </figure>
          )}

          {post.lead && (
            <div className="mt-6 [&>p:first-child]:mt-0 [&>p]:text-[18px] [&>p]:leading-[1.7] [&>p]:text-ink-900">
              <Markdown source={post.lead} />
            </div>
          )}

          {toc.length > 0 && (
            <div className="mt-8">
              <Toc items={toc} variant="inline" />
            </div>
          )}

          <div className="mt-4">
            {post.body ? (
              <Markdown source={post.body} />
            ) : preview ? (
              <p className="mt-8 text-slate-400">The body is empty.</p>
            ) : null}
          </div>

          {post.sources.length > 0 && (
            <section
              aria-labelledby="sources"
              className="mt-14 border-l-4 border-slate-300 bg-[#f3f5f7] px-6 py-5"
            >
              <h2 id="sources" className="scroll-mt-[140px] text-[16px] font-semibold normal-case text-ink-900">
                Sources &amp; further reading
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-[1.6]">
                {post.sources.map((s) => (
                  <li key={s.url + s.label}>
                    <a
                      href={s.url}
                      target={/^https?:\/\//.test(s.url) ? "_blank" : undefined}
                      rel={/^https?:\/\//.test(s.url) ? "noopener noreferrer" : undefined}
                      className="text-blue-600 underline decoration-blue-600/40 underline-offset-2 hover:decoration-blue-600"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {post.faqs.length > 0 && (
            <section aria-labelledby="faq" className="mt-14 border-t border-line-200 pt-10">
              <h2
                id="faq"
                className="scroll-mt-[140px] border-b-2 border-blue-600 pb-3 font-display text-[22px] font-bold text-ink-900 normal-case"
              >
                Frequently asked questions
              </h2>
              <div className="mt-2">
                <FaqList faqs={post.faqs} />
              </div>
            </section>
          )}

          {post.keywords.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2" aria-label="Topics">
              {post.keywords.map((k) => (
                <li key={k} className="border border-line-200 px-2.5 py-1 text-[12.5px] text-slate-600">
                  {k}
                </li>
              ))}
            </ul>
          )}

          {related.length > 0 && (
            <section aria-labelledby="related" className="mt-14 border-t border-line-200 pt-10">
              <h2 id="related" className="font-display text-[22px] font-bold text-ink-900 normal-case">
                Related articles
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/blog/${r.slug}`}
                      className="group block h-full border border-line-200 p-5 transition-colors duration-[140ms] hover:border-blue-400"
                    >
                      {r.category && (
                        <span className="text-[12px] font-semibold uppercase tracking-wide text-blue-600">
                          {r.category}
                        </span>
                      )}
                      <span className="mt-1 block text-[17px] font-semibold leading-snug text-ink-900 group-hover:text-blue-600">
                        {r.title}
                      </span>
                      {r.description && (
                        <span className="mt-2 line-clamp-2 block text-[14px] text-slate-600">{r.description}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}

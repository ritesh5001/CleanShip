import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/**
 * Renders a post body.
 *
 * react-markdown builds React elements rather than injecting HTML, and raw
 * HTML in the Markdown is ignored, so an admin pasting a <script> into a post
 * cannot run it on the public site. GitHub-flavoured Markdown adds tables,
 * task lists and strikethrough. rehype-slug puts an id on every heading — the
 * same ids tocOf() in lib/blog.ts computes — which is what makes both the
 * table of contents and a shared link like /blog/post#sea-water-wash work.
 *
 * Works in server and client components alike, so the admin preview renders
 * with exactly the code the live page does.
 */

const external = (href?: string) => !!href && /^https?:\/\//.test(href) && !href.includes("cleanship.co");

const components: Components = {
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="group mt-14 scroll-mt-[140px] font-display text-[26px] font-bold leading-tight text-ink-900 sm:text-[30px] normal-case"
    >
      <a href={`#${id}`} className="no-underline hover:text-blue-600">
        {children}
      </a>
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="mt-10 scroll-mt-[140px] font-display text-[21px] font-bold leading-snug text-ink-900 normal-case"
    >
      <a href={`#${id}`} className="no-underline hover:text-blue-600">
        {children}
      </a>
    </h3>
  ),
  h4: ({ children, id }) => (
    <h4 id={id} className="mt-8 scroll-mt-[140px] text-[17px] font-bold normal-case text-ink-900">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="mt-5 text-[17px] leading-[1.75] text-ink-700">{children}</p>,
  a: ({ href, children }) =>
    external(href) ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline decoration-blue-600/40 underline-offset-2 hover:decoration-blue-600"
      >
        {children}
        <span aria-hidden="true" className="ml-0.5 text-[0.8em]">↗</span>
      </a>
    ) : (
      <a
        href={href}
        className="text-blue-600 underline decoration-blue-600/40 underline-offset-2 hover:decoration-blue-600"
      >
        {children}
      </a>
    ),
  ul: ({ children }) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-[17px] leading-[1.7] text-ink-700 marker:text-blue-600">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] text-ink-700 marker:font-semibold marker:text-ink-900">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-4 border-blue-600 bg-[#f3f6f9] px-5 py-1 text-ink-700 [&>p]:mt-3 [&>p:last-child]:mb-3">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-line-200" />,
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto border border-line-200">
      <table className="w-full border-collapse text-left text-[15px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[#f3f6f9] text-ink-900">{children}</thead>,
  th: ({ children }) => <th className="border-b border-line-200 px-4 py-3 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b border-line-100 px-4 py-3 align-top text-ink-700">{children}</td>,
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      <span className="mt-6 block">
        {/* eslint-disable-next-line @next/next/no-img-element -- author-supplied URLs of unknown size */}
        <img src={src} alt={alt ?? ""} loading="lazy" className="h-auto w-full border border-line-200" />
        {alt && <span className="mt-2 block text-[13px] text-slate-500">{alt}</span>}
      </span>
    ) : null,
  code: ({ children, className }) =>
    className ? (
      <code className={`${className} block`}>{children}</code>
    ) : (
      <code className="bg-[#f3f6f9] px-1.5 py-0.5 font-mono text-[0.9em] text-ink-900">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto bg-[#0b1f33] p-5 font-mono text-[14px] leading-relaxed text-white">
      {children}
    </pre>
  ),
  strong: ({ children }) => <strong className="font-semibold text-ink-900">{children}</strong>,
};

export function Markdown({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
      {source}
    </ReactMarkdown>
  );
}

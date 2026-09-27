/**
 * Renders one or more schema.org objects into a single JSON-LD script tag.
 * The payload is built entirely from our own typed constants in lib/seo.ts —
 * no user input reaches this string.
 */
export function JsonLd({ schema }: { schema: object | object[] }) {
  const payload = Array.isArray(schema) ? schema : [schema];
  return (
    <script
      type="application/ld+json"
      /* "<" escaped so text containing "</script>" — a blog post written in
         the admin panel, say — cannot close this tag early. */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }}
    />
  );
}

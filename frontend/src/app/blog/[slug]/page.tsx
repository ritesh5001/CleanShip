import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { CtaBand } from "@/components/cta-band";
import { PostArticle } from "@/components/blog/post-article";
import { BASE_URL, breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";
import {
  categorySlug,
  getPublishedPost,
  getPublishedPosts,
  wordCount,
} from "@/lib/blog";

type Params = { params: Promise<{ slug: string }> };

/* Posts are created in the admin panel after the build, so unknown slugs are
   rendered on demand and cached; saving a post revalidates the "posts" tag. */
export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Not found", robots: { index: false } };

  /* buildMetadata prefixes its image with the site origin, which is right
     for a /path on this site and wrong for a cover hosted elsewhere — so an
     absolute cover URL is passed through as-is instead. */
  const cover = post.coverImageUrl;
  const local = cover && !/^https?:\/\//.test(cover) ? cover : null;
  const meta = buildMetadata({
    title: post.seoTitle || post.title,
    description: post.description || post.lead.slice(0, 160),
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    noIndex: post.noindex,
    image: local ? { url: local, alt: post.coverImageAlt ?? post.title } : undefined,
  });
  const remote = cover && !local ? [{ url: cover, alt: post.coverImageAlt ?? post.title }] : null;

  return {
    ...meta,
    keywords: post.keywords,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      section: post.category || undefined,
      tags: post.keywords,
      ...(remote ? { images: remote } : {}),
    },
    ...(remote ? { twitter: { ...meta.twitter, images: [cover!] } } : {}),
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const all = await getPublishedPosts();
  const others = all.filter((p) => p.id !== post.id);
  const related = [
    ...others.filter((p) => p.category && p.category === post.category),
    ...others.filter((p) => !p.category || p.category !== post.category),
  ].slice(0, 4);

  const url = `${BASE_URL}/blog/${post.slug}`;
  const trail = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    ...(post.category
      ? [{ name: post.category, path: `/blog?category=${categorySlug(post.category)}` }]
      : []),
    { name: post.title, path: `/blog/${post.slug}` },
  ];
  const image = post.coverImageUrl
    ? post.coverImageUrl.startsWith("http")
      ? post.coverImageUrl
      : `${BASE_URL}${post.coverImageUrl}`
    : undefined;

  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(trail),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            headline: post.title,
            description: post.description || undefined,
            url,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            datePublished: post.publishedAt ?? undefined,
            dateModified: post.updatedAt,
            inLanguage: "en-GB",
            articleSection: post.category || undefined,
            keywords: post.keywords.length ? post.keywords : undefined,
            wordCount: wordCount(post),
            ...(image ? { image } : {}),
            author: post.authorName
              ? { "@type": "Person", name: post.authorName, ...(post.authorRole ? { jobTitle: post.authorRole } : {}) }
              : { "@id": `${BASE_URL}/#organization` },
            publisher: { "@id": `${BASE_URL}/#organization` },
            ...(post.sources.length ? { citation: post.sources.map((s) => s.url) } : {}),
          },
          ...(post.faqs.length ? [faqSchema(post.faqs)] : []),
        ]}
      />
      <PostArticle post={post} related={related} />
      <CtaBand />
    </>
  );
}

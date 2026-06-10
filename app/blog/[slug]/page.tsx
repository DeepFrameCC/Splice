import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/JsonLd";
import BlogAuthorRow from "@/components/blog/BlogAuthorRow";
import BlogRelatedPosts from "@/components/blog/BlogRelatedPosts";
import BlogTOC from "@/components/blog/BlogTOC";
import BlogAdminBar from "@/components/blog/BlogAdminBar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { CtaBlock } from "@/components/marketing/CtaBlock";
import { getPostBySlug, getRelatedPosts, getAllPublishedSlugs } from "@/lib/blog/queries";
import { buildBlogPostJsonLd, BASE_URL } from "@/lib/seo";
import { sanitizeRichHtml } from "@/lib/sanitize/html";
import { auth, isAdmin } from "@/lib/auth";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Article introuvable" };

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      ...(post.coverImageUrl ? { images: [{ url: post.coverImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(post.coverImageUrl ? { images: [post.coverImageUrl] } : {}),
    },
    alternates: { canonical: `${BASE_URL}/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") notFound();

  // Check if current user is admin for inline actions
  const session = await auth();
  const userRole = session?.user?.role;
  const showAdminBar = isAdmin(userRole);

  const relatedPosts = await getRelatedPosts(
    post.id,
    post.parentService?.slug,
  );

  const jsonLd = buildBlogPostJsonLd({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    coverImageUrl: post.coverImageUrl,
    author: post.author,
    parentService: post.parentService,
  });

  const crumbs = [
    { name: "Accueil", href: "/" },
    { name: "Blog", href: "/blog" },
    ...(post.categories.length > 0
      ? [{ name: post.categories[0]!.name, href: `/blog?cat=${post.categories[0]!.slug}` }]
      : []),
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <div className="df-site">
      <NavWrapper />

      <JsonLd data={jsonLd} />

      <article
        className="pb-16"
        style={{ paddingTop: "calc(80px + 2rem)" }}
      >
        {/* ─── Admin bar ──────────────────────────────── */}
        {showAdminBar && (
          <BlogAdminBar
            postId={post.id}
            status={post.status}
            editUrl={`/admin/blog/${post.id}/modifier`}
          />
        )}

        {/* ─── Header ─────────────────────────────────── */}
        <header className="mx-auto max-w-4xl px-6">
          {/* Breadcrumb */}
          <Breadcrumbs className="mb-6 text-sm text-white/50" items={crumbs} />

          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?cat=${cat.slug}`}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/20 hover:text-white"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl leading-tight">
            {post.title}
          </h1>

          {/* Excerpt / chapo */}
          <p className="mt-5 text-lg leading-relaxed text-white/70 md:text-xl">
            {post.excerpt}
          </p>

          {/* Author row */}
          <div className="mt-6">
            <BlogAuthorRow
              author={post.author}
              publishedAt={post.publishedAt}
              readingTimeMin={post.readingTimeMin}
            />
          </div>

          {/* Cover image */}
          {post.coverImageUrl && (
            <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl bg-white/5">
              <Image
                src={post.coverImageUrl}
                alt={post.coverImageAlt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
                priority
              />
            </div>
          )}
        </header>

        {/* ─── Content area with optional TOC ────────── */}
        <div className="mx-auto mt-10 max-w-6xl px-6">
          <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
            {/* Article body */}
            <div className="mx-auto max-w-[700px] lg:mx-0">
              {/* Mobile TOC */}
              {post.content && (
                <div className="mb-8 lg:hidden">
                  <BlogTOC html={post.content} />
                </div>
              )}

              {post.content ? (
                <div
                  className="prose prose-lg prose-splice max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight"
                  dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(post.content) }}
                />
              ) : (
                <div className="rounded-2xl bg-white/5 p-8 text-center">
                  <p className="text-white/60">
                    Le contenu complet de cet article sera bientôt disponible.
                  </p>
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop TOC sidebar */}
            {post.content && (
              <aside className="hidden lg:block">
                <BlogTOC html={post.content} />
              </aside>
            )}
          </div>
        </div>

        {/* ─── CTA ────────────────────────────────────── */}
        <div className="mx-auto mt-16 max-w-4xl px-6">
          <CtaBlock
            variant="primary"
            source="blog_article"
            title="Un projet en tête ?"
            subtitle="On vous accompagne de A à Z. Devis gratuit, sans engagement."
            primaryHref="/devis"
            primaryLabel="Demander un devis gratuit"
            secondaryHref="/galerie"
            secondaryLabel="Voir nos réalisations"
          />
        </div>

        {/* ─── Related posts ──────────────────────────── */}
        <div className="mx-auto max-w-6xl px-6">
          <BlogRelatedPosts posts={relatedPosts} />
        </div>
      </article>

      <Footer />
    </div>
  );
}

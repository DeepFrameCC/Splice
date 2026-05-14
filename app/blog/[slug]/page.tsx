import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await db.blogPost.findMany({ select: { slug: true } });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await db.blogPost.findUnique({
      where: { slug },
      select: { title: true, excerpt: true },
    });
    if (!post) return { title: "Article introuvable" };
    return {
      title: `${post.title} — Blog DeepFrame`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
      },
    };
  } catch {
    return { title: "Blog — DeepFrame" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: Date;
    parentService: { name: string; slug: string } | null;
  } | null = null;

  try {
    post = await db.blogPost.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        parentService: { select: { name: true, slug: true } },
      },
    });
  } catch (e) {
    console.error("[blog] DB error:", e);
  }

  if (!post) notFound();

  // Get related posts
  let relatedPosts: { slug: string; title: string; excerpt: string }[] = [];
  try {
    relatedPosts = await db.blogPost.findMany({
      where: {
        id: { not: post.id },
        parentServiceId: post.parentService ? undefined : undefined,
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, title: true, excerpt: true },
    });
  } catch {
    // Silently fail
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "DeepFrame",
    },
    publisher: {
      "@type": "Organization",
      name: "DeepFrame",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://deepframe.cc"}/logo.svg`,
      },
    },
  };

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 pb-20" style={{ paddingTop: "calc(80px + 3rem)" }}>
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-df-blue/50" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-df-blue">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-df-blue">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-df-blue/70">{post.title}</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-3 text-xs text-df-blue/50">
            <time dateTime={post.publishedAt.toISOString()}>
              {post.publishedAt.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {post.parentService && (
              <>
                <span>·</span>
                <Link
                  href={`/services/${post.parentService.slug}`}
                  className="rounded-full bg-df-blue/5 px-2 py-0.5 font-medium text-df-blue/70 hover:bg-df-blue/10"
                >
                  {post.parentService.name}
                </Link>
              </>
            )}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold italic text-df-blue md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-df-blue/70 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Placeholder for full content */}
        <div className="prose prose-lg max-w-none">
          <div className="rounded-2xl bg-df-cream/50 p-8 text-center">
            <p className="text-df-blue/60">
              Le contenu complet de cet article sera bientôt disponible.
            </p>
            <p className="mt-2 text-sm text-df-blue/40">
              En attendant, n&apos;hésitez pas à nous contacter pour toute question.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-df-blue p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold italic">Un projet en tête ?</h2>
          <p className="mt-2 text-white/70">
            On vous accompagne de A à Z. Devis gratuit, sans engagement.
          </p>
          <Link
            href="/devis"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-df-gold px-6 py-3 font-bold text-df-ink transition hover:bg-df-gold/90"
          >
            Demander un devis →
          </Link>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-df-blue">Articles similaires</h2>
            <div className="mt-4 grid gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group block rounded-xl bg-white p-4 shadow-sm ring-1 ring-df-blue/10 transition hover:shadow-md"
                >
                  <h3 className="font-bold text-df-blue group-hover:text-df-blue/80">
                    {rp.title}
                  </h3>
                  <p className="mt-1 text-sm text-df-blue/50 line-clamp-1">{rp.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
      <Footer />
    </>
  );
}

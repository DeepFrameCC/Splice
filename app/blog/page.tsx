import { db } from "@/lib/db";
import Link from "next/link";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — DeepFrame",
  description:
    "Conseils, guides et actualités sur la production audiovisuelle, le montage vidéo, les réseaux sociaux et la photographie professionnelle.",
  openGraph: {
    title: "Blog — DeepFrame",
    description:
      "Conseils, guides et actualités sur la production audiovisuelle.",
  },
};

export default async function BlogPage() {
  let posts: {
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: Date;
    parentService: { name: string; slug: string } | null;
  }[] = [];

  try {
    posts = await db.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
      select: {
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

  return (
    <>
      <Nav />
      <div className="mx-auto max-w-4xl px-6 pb-20" style={{ paddingTop: "calc(80px + 3rem)" }}>
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-df-blue/60">Blog</p>
          <h1 className="mt-2 font-display text-4xl font-bold italic text-df-blue md:text-5xl">
            Nos articles & conseils
          </h1>
          <p className="mt-3 max-w-2xl text-df-blue/70">
            Guides pratiques, retours d&apos;expérience et tendances du monde audiovisuel.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-2xl bg-df-cream/50 p-12 text-center">
            <p className="text-df-blue/50">Aucun article pour le moment. Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-df-blue/10 transition hover:shadow-md hover:ring-df-blue/20"
              >
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
                      <span className="rounded-full bg-df-blue/5 px-2 py-0.5 font-medium text-df-blue/70">
                        {post.parentService.name}
                      </span>
                    </>
                  )}
                </div>
                <h2 className="mt-2 font-display text-xl font-bold text-df-blue group-hover:text-df-blue/80">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-df-blue/60 line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-block text-sm font-bold text-df-gold group-hover:underline">
                  Lire l&apos;article →
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-df-blue/60">Un projet en tête ?</p>
          <Link
            href="/devis"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-df-blue px-6 py-3 font-bold text-white transition hover:bg-df-blue/90"
          >
            Demander un devis →
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

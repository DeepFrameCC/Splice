import { Suspense } from "react";
import Link from "next/link";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/JsonLd";
import BlogHero from "@/components/blog/BlogHero";
import BlogFeaturedCard from "@/components/blog/BlogFeaturedCard";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import BlogCategoryFilter from "@/components/blog/BlogCategoryFilter";
import BlogSearchBar from "@/components/blog/BlogSearchBar";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogNewsletterCTA from "@/components/blog/BlogNewsletterCTA";
import BlogAdminFAB from "@/components/blog/BlogAdminFAB";
import { CtaBlock } from "@/components/marketing/CtaBlock";
import { getPublishedPosts, getFeaturedPost, getAllCategories } from "@/lib/blog/queries";
import { auth, isAdmin } from "@/lib/auth";
import { buildBlogIndexJsonLd, BASE_URL } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog : conseils production vidéo à Orléans & Tours",
  description:
    "Conseils, guides et actualités sur la production audiovisuelle, le montage vidéo, les réseaux sociaux et la photographie professionnelle.",
  openGraph: {
    title: "Blog — Splice Studio",
    description:
      "Conseils, guides et actualités sur la production audiovisuelle.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${BASE_URL}/blog` },
};

const POSTS_PER_PAGE = 9;

interface Props {
  searchParams: Promise<{ cat?: string; q?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const categorySlug = sp.cat;
  const search = sp.q;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const isFiltered = !!(categorySlug || search);

  const session = await auth();
  const userRole = session?.user?.role;
  const showAdminFAB = isAdmin(userRole);

  const [{ posts, total }, featuredPost, categories] = await Promise.all([
    getPublishedPosts({
      categorySlug,
      search,
      page,
      limit: POSTS_PER_PAGE,
    }),
    isFiltered ? Promise.resolve(null) : getFeaturedPost(),
    getAllCategories(),
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  // Exclude featured post from grid when on first unfiltered page
  const gridPosts =
    !isFiltered && page === 1 && featuredPost
      ? posts.filter((p) => p.id !== featuredPost.id)
      : posts;

  return (
    <div className="df-site">
      <JsonLd data={buildBlogIndexJsonLd()} />
      <NavWrapper />
      <BlogHero
        articleCount={total}
        themeCount={categories.filter((c) => c._count.posts > 0).length}
      />

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Featured post — only on unfiltered first page */}
        {!isFiltered && page === 1 && featuredPost && (
          <section className="mb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-white/45">
              À la une
            </p>
            <BlogFeaturedCard post={featuredPost} />
          </section>
        )}

        {/* Filters bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Suspense>
            <BlogCategoryFilter categories={categories} activeSlug={categorySlug} />
          </Suspense>
          <div className="w-full md:w-72">
            <Suspense>
              <BlogSearchBar />
            </Suspense>
          </div>
        </div>

        {/* Search/filter feedback */}
        {isFiltered && (
          <p className="mb-6 text-sm text-white/50">
            {total} résultat{total !== 1 ? "s" : ""}
            {search && <> pour &ldquo;<span className="font-medium text-white">{search}</span>&rdquo;</>}
            {categorySlug && (
              <>
                {" "}dans la catégorie{" "}
                <span className="font-medium text-white">
                  {categories.find((c) => c.slug === categorySlug)?.name || categorySlug}
                </span>
              </>
            )}
          </p>
        )}

        {/* Article grid */}
        {gridPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <BlogArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white/[0.04] p-12 text-center">
            <p className="text-white/50">
              {isFiltered
                ? "Aucun article ne correspond à votre recherche."
                : "Aucun article pour le moment. Revenez bientôt !"}
            </p>
            {isFiltered && (
              <Link
                href="/blog"
                className="mt-3 inline-block text-sm font-bold text-white hover:text-df-gold transition"
              >
                Voir tous les articles →
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-10">
          <BlogPagination
            currentPage={page}
            totalPages={totalPages}
            searchParams={{ cat: categorySlug, q: search }}
          />
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16">
          <BlogNewsletterCTA />
        </div>

        {/* Devis CTA */}
        <div className="mt-12">
          <CtaBlock
            variant="soft"
            source="blog_index"
            title="Un projet en tête ?"
            subtitle="On vous accompagne de A à Z. Devis gratuit, sans engagement."
            primaryHref="/devis"
            primaryLabel="Demander un devis gratuit"
            secondaryHref="/galerie"
            secondaryLabel="Voir nos réalisations"
          />
        </div>
      </div>

      {showAdminFAB && <BlogAdminFAB />}
      <Footer />
    </div>
  );
}

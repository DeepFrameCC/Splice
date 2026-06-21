import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Newsreader, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/JsonLd";
import BlogTOC from "@/components/blog/BlogTOC";
import ArticleNewsletter from "@/components/blog/ArticleNewsletter";
import BlogAdminBar from "@/components/blog/BlogAdminBar";
import { getPostBySlug, getRelatedPosts, getAllPublishedSlugs } from "@/lib/blog/queries";
import { SERVICES_LOCAL_SLUGS } from "@/lib/services/local-seo";
import { buildBlogPostJsonLd, BASE_URL } from "@/lib/seo";
import { sanitizeRichHtml } from "@/lib/sanitize/html";
import { auth, isAdmin } from "@/lib/auth";
import type { Metadata } from "next";
import "./article-theme.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-news",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});
const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
  display: "swap",
});

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

  // FIX: certains metaTitle seedés finissent déjà par " | Splice Studio" ;
  // le template du layout racine (`%s | Splice Studio`) le rajoute, d'où des
  // doublons "... | Splice Studio | Splice Studio". On retire le suffixe ici.
  const rawTitle = post.metaTitle || post.title;
  const title = rawTitle.replace(/\s*\|\s*Splice Studio\s*$/i, "").trim();
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

function initials(name?: string | null): string {
  if (!name) return "SS";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const ini = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return ini || "SS";
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") notFound();

  const session = await auth();
  const userRole = session?.user?.role;
  const showAdminBar = isAdmin(userRole);

  const relatedPosts = await getRelatedPosts(post.id, post.parentService?.slug);

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

  const parentService = post.parentService;
  const parentServiceIsLocal =
    !!parentService &&
    (SERVICES_LOCAL_SLUGS as readonly string[]).includes(parentService.slug);

  const dateLabel = new Date(post.publishedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="df-site">
      <NavWrapper />
      <JsonLd data={jsonLd} />

      <div
        className={`article-mag ${newsreader.variable} ${hanken.variable} ${plex.variable}`}
        style={{ paddingTop: "80px" }}
      >
        {showAdminBar && (
          <BlogAdminBar
            postId={post.id}
            status={post.status}
            editUrl={`/admin/blog/${post.id}/modifier`}
          />
        )}

        <article>
          {/* ── HERO ── */}
          <section>
            <div className="am-hero">
              {/* Fil d'Ariane */}
              <nav aria-label="Fil d'Ariane" className="am-crumbs">
                <Link href="/">Accueil</Link>
                <span className="am-sep">›</span>
                <Link href="/blog">Blog</Link>
                {post.categories[0] && (
                  <>
                    <span className="am-sep">›</span>
                    <Link href={`/blog?cat=${post.categories[0].slug}`}>
                      {post.categories[0].name}
                    </Link>
                  </>
                )}
                <span className="am-sep">›</span>
                <span className="am-crumb-current">{post.title}</span>
              </nav>

              {post.categories[0] && (
                <Link href={`/blog?cat=${post.categories[0].slug}`} className="am-pill">
                  {post.categories[0].name}
                </Link>
              )}

              <h1 className="am-title">{post.title}</h1>
              <p className="am-chapo">{post.excerpt}</p>

              <div className="am-author">
                <div className="am-avatar">{initials(post.author?.pseudo)}</div>
                <div style={{ flex: 1 }}>
                  <div className="am-author-name">{post.author?.pseudo || "Splice Studio"}</div>
                  <div className="am-author-meta">{dateLabel}</div>
                </div>
                <span className="am-read-time">⏱ {post.readingTimeMin} min de lecture</span>
              </div>
            </div>

            {/* Couverture pleine largeur */}
            {post.coverImageUrl && (
              <figure className="am-cover">
                <Image
                  src={post.coverImageUrl}
                  alt={post.coverImageAlt || post.title}
                  fill
                  sizes="100vw"
                  priority
                />
              </figure>
            )}
          </section>

          {/* ── COLONNE DE LECTURE ── */}
          <div className="am-read">
            {post.content && <BlogTOC html={post.content} />}

            {post.content ? (
              <div
                className="am-body"
                dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(post.content) }}
              />
            ) : (
              <div className="am-toc" style={{ textAlign: "center" }}>
                <p style={{ margin: 0 }}>Le contenu complet de cet article sera bientôt disponible.</p>
              </div>
            )}

            {post.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 40,
                  paddingTop: 24,
                  borderTop: "1px solid var(--hair)",
                }}
              >
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      borderRadius: 100,
                      border: "1px solid var(--hair)",
                      padding: "4px 12px",
                      fontSize: 12,
                      color: "var(--muted)",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── NEWSLETTER ── */}
          <div className="am-read" style={{ paddingTop: 52, paddingBottom: 0 }}>
            <ArticleNewsletter />
          </div>

          {/* ── ALLER PLUS LOIN (maillage interne SEO) ── */}
          {parentService && (
            <nav aria-label="Aller plus loin" className="am-read" style={{ paddingTop: 32 }}>
              <div className="am-more">
                <h2>Aller plus loin</h2>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 24px",
                    fontSize: 15,
                  }}
                >
                  <li>
                    <Link href={`/services/${parentService.slug}`}>
                      {parentService.name} à Orléans et Tours
                    </Link>
                  </li>
                  {parentServiceIsLocal && (
                    <li>
                      <Link href={`/services/${parentService.slug}/orleans`}>
                        {parentService.name} à Orléans
                      </Link>
                    </li>
                  )}
                  <li><Link href="/tarifs">Nos tarifs</Link></li>
                  <li><Link href="/devis">Demander un devis gratuit</Link></li>
                </ul>
              </div>
            </nav>
          )}

          {/* ── À LIRE ENSUITE ── */}
          {relatedPosts.length > 0 && (
            <section className="am-related" style={{ marginTop: 68 }}>
              <div className="am-related__inner">
                <div className="am-related__label">À lire ensuite</div>
                <div className="am-related__grid">
                  {relatedPosts.slice(0, 3).map((rp) => (
                    <Link key={rp.id} href={`/blog/${rp.slug}`}>
                      <div className="am-rcard__img">
                        {rp.coverImageUrl && (
                          <Image
                            src={rp.coverImageUrl}
                            alt={rp.coverImageAlt || rp.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 280px"
                          />
                        )}
                      </div>
                      {rp.categories[0] && (
                        <div className="am-rcard__cat">{rp.categories[0].name}</div>
                      )}
                      <div className="am-rcard__title">{rp.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </article>
      </div>

      <Footer />
    </div>
  );
}

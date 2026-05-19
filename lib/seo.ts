/**
 * SEO utilities for DeepFrame
 * Centralized structured data and metadata helpers
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://deepframe.cc";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DeepFrame",
    alternateName: "Deepframe",
    url: BASE_URL,
    logo: `${BASE_URL}/LogoNoir.svg`,
    description:
      "Boîte de production audiovisuelle basée à Orléans et Tours. Pubs réseaux sociaux, shootings automobile, films de marque, aftermovies.",
    email: "contact@deepframe.cc",
    areaServed: {
      "@type": "Place",
      name: "Centre-Val de Loire, France",
    },
    sameAs: [
      "https://www.instagram.com/deepframe.cc/",
      "https://www.facebook.com/profile.php?id=61589292522120",
    ],
    knowsAbout: [
      "Production audiovisuelle",
      "Vidéo publicitaire",
      "Shooting automobile",
      "Film de marque",
      "Aftermovie",
      "Réseaux sociaux",
      "Montage vidéo",
    ],
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DeepFrame",
    url: BASE_URL,
    logo: `${BASE_URL}/LogoNoir.svg`,
    description:
      "Boîte de production audiovisuelle basée à Orléans et Tours.",
    email: "contact@deepframe.cc",
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Orléans",
        postalCode: "45000",
        addressRegion: "Centre-Val de Loire",
        addressCountry: "FR",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Tours",
        postalCode: "37000",
        addressRegion: "Centre-Val de Loire",
        addressCountry: "FR",
      },
    ],
    priceRange: "€€",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export function buildServiceJsonLd(service: {
  name: string;
  slug: string;
  description: string;
  coverUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${BASE_URL}/services/${service.slug}`,
    provider: {
      "@type": "Organization",
      name: "DeepFrame",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "Place",
      name: "Centre-Val de Loire, France",
    },
    ...(service.coverUrl ? { image: service.coverUrl } : {}),
  };
}

export function buildBlogPostJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  coverImageUrl?: string | null;
  author?: { pseudo: string } | null;
  parentService?: { name: string } | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
    ...(post.parentService ? { articleSection: post.parentService.name } : {}),
    author: post.author
      ? { "@type": "Person", name: post.author.pseudo }
      : { "@type": "Organization", name: "DeepFrame" },
    publisher: {
      "@type": "Organization",
      name: "DeepFrame",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/LogoNoir.svg`,
      },
    },
  };
}

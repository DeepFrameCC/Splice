/**
 * SEO utilities for Splice
 * Centralized structured data and metadata helpers
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://splice.cc";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Splice",
    alternateName: "Splice",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-1.svg`,
    description:
      "Boîte de production audiovisuelle basée à Orléans et Tours. Pubs réseaux sociaux, shootings automobile, films de marque, aftermovies.",
    email: "contact@splice.cc",
    areaServed: {
      "@type": "Place",
      name: "Centre-Val de Loire, France",
    },
    sameAs: [
      "https://www.instagram.com/splice.cc/",
      "https://www.facebook.com/Splicecc/",
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
    name: "Splice",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-1.svg`,
    description:
      "Boîte de production audiovisuelle basée à Orléans et Tours.",
    email: "contact@splice.cc",
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
      name: "Splice",
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
      : { "@type": "Organization", name: "Splice" },
    publisher: {
      "@type": "Organization",
      name: "Splice",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo-1.svg`,
      },
    },
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Splice",
    url: BASE_URL,
    description:
      "Boîte de production audiovisuelle basée à Orléans et Tours.",
    publisher: {
      "@type": "Organization",
      name: "Splice",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildContactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contactez Splice",
    url: `${BASE_URL}/contact`,
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Splice",
      email: "contact@splice.cc",
      telephone: "+33651109202",
      url: BASE_URL,
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
    },
  };
}

export function buildGalleryJsonLd(mediaCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Portfolio — Splice",
    url: `${BASE_URL}/galerie`,
    description:
      "Réalisations vidéo et photo : automobile, films de marque, réseaux sociaux, événementiel.",
    publisher: {
      "@type": "Organization",
      name: "Splice",
    },
    numberOfItems: mediaCount,
  };
}

export function buildTeamJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "L'équipe Splice",
    url: `${BASE_URL}/equipe`,
    mainEntity: {
      "@type": "Organization",
      name: "Splice",
      member: [
        {
          "@type": "Person",
          name: "Fayad",
          jobTitle: "Vidéaste / Réalisateur",
          sameAs: "https://instagram.com/papiforcex",
        },
        {
          "@type": "Person",
          name: "Louisia",
          jobTitle: "Photographe",
          sameAs: "https://instagram.com/by.louisia",
        },
        {
          "@type": "Person",
          name: "Tracy",
          jobTitle: "Monteur / Motion Designer",
          sameAs: "https://instagram.com/t.y97one",
        },
      ],
    },
  };
}

export function buildBlogIndexJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog — Splice",
    url: `${BASE_URL}/blog`,
    description:
      "Conseils, guides et actualités sur la production audiovisuelle.",
    publisher: {
      "@type": "Organization",
      name: "Splice",
    },
  };
}

export function buildAvisJsonLd(averageRating: number | null, reviewCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Splice",
    url: BASE_URL,
    ...(averageRating && reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            bestRating: 5,
            worstRating: 1,
            reviewCount,
          },
        }
      : {}),
  };
}

export function buildPricingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Tarifs — Splice",
    url: `${BASE_URL}/tarifs`,
    description:
      "Tarifs transparents pour la production audiovisuelle. Abonnements vidéo, packs photo, options à la carte.",
    mainEntity: {
      "@type": "OfferCatalog",
      name: "Tarifs Splice",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Abonnement Vidéo",
          priceCurrency: "EUR",
          description: "Abonnement mensuel vidéo pour les professionnels",
        },
        {
          "@type": "Offer",
          name: "Pack Particulier",
          priceCurrency: "EUR",
          description: "Pack photo/vidéo à la carte pour les particuliers",
        },
      ],
    },
  };
}

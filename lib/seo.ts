/**
 * SEO utilities for Splice
 * Centralized structured data and metadata helpers
 */

export const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://splicestudio.fr").trim();
export const absoluteUrl = (path = ""): string => new URL(path, BASE_URL).toString();

const ORG_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;
const LOCALBUSINESS_ID = `${BASE_URL}/#localbusiness`;

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Splice",
    alternateName: "Splice Studio",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-1.svg`,
    description:
      "Boîte de production audiovisuelle basée à Orléans et Tours. Pubs réseaux sociaux, shootings automobile, films de marque, aftermovies.",
    email: "contact.splicestudio@gmail.com",
    areaServed: {
      "@type": "Place",
      name: "Centre-Val de Loire, France",
    },
    sameAs: [
      "https://www.instagram.com/splice.cc/",
      "https://www.facebook.com/Splicecc/",
      "https://share.google/xs14h7WtSrIkYlfjS",
    ],
    knowsAbout: [
      "Production audiovisuelle",
      "Vidéo publicitaire",
      "Shooting automobile",
      "Film de marque",
      "Aftermovie",
      "Réseaux sociaux",
      "Montage vidéo",
      "Production vidéo Orléans",
      "Vidéaste Orléans",
      "Podcast Orléans",
      "Production audiovisuelle Loiret",
      "Studio vidéo Centre-Val de Loire",
    ],
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": LOCALBUSINESS_ID,
    parentOrganization: { "@id": ORG_ID },
    name: "Splice",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-1.svg`,
    image: `${BASE_URL}/og-image.jpg`,
    telephone: "+33651109202",
    geo: { "@type": "GeoCoordinates", latitude: 47.9029, longitude: 1.9093 },
    description:
      "Studio et boîte de production audiovisuelle à Orléans (Loiret) et Tours (Indre-et-Loire). Spécialiste en tournage, montage vidéo, motion design et création de podcast en Centre-Val de Loire.",
    email: "contact.splicestudio@gmail.com",
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
    sameAs: ["https://share.google/xs14h7WtSrIkYlfjS"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
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
    provider: { "@id": ORG_ID },
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
    "@id": WEBSITE_ID,
    name: "Splice",
    url: BASE_URL,
    description:
      "Boîte de production audiovisuelle basée à Orléans et Tours.",
    publisher: { "@id": ORG_ID },
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
      email: "contact.splicestudio@gmail.com",
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

interface GalleryMediaForJsonLd {
  type: string;
  title: string;
  description?: string | null;
  url: string;
  thumbnailUrl?: string | null;
  createdAt?: string;
}

export function buildGalleryJsonLd(
  mediaCount: number,
  medias?: GalleryMediaForJsonLd[],
) {
  const base = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Galerie Splice",
    url: `${BASE_URL}/galerie`,
    description:
      "Portfolio photo et vidéo de Splice — Orléans / Tours.",
    publisher: {
      "@type": "Organization",
      name: "Splice",
    },
    numberOfItems: mediaCount,
  };

  if (!medias || medias.length === 0) return base;

  return {
    ...base,
    hasPart: medias.slice(0, 20).map((m) => {
      const isVideo = m.type === "VIDEO";
      const thumb = m.thumbnailUrl || (isVideo ? `${BASE_URL}/og-image.jpg` : undefined);
      const desc = m.description || (isVideo ? `Vidéo de la galerie Splice - ${m.title}` : undefined);

      return {
        "@type": isVideo ? "VideoObject" : "ImageObject",
        name: m.title,
        ...(desc ? { description: desc } : {}),
        contentUrl: m.url,
        ...(thumb ? { thumbnailUrl: thumb } : {}),
        ...(isVideo ? { uploadDate: m.createdAt || new Date().toISOString() } : {}),
      };
    }),
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
      "Découvrez nos actualités, guides pratiques et conseils sur le montage vidéo, la production corporate et le podcast à Orléans, Tours et Centre-Val de Loire.",
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
      "Tarifs transparents de production vidéo et photographie à Orléans, Tours et Centre-Val de Loire. Abonnements vidéo pro, packs photo à la carte et création de podcast.",
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

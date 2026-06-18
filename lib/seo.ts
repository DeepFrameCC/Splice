/**
 * SEO utilities for Splice Studio
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
    name: "Splice Studio",
    alternateName: "Splice Studio Orléans",
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
      "https://www.instagram.com/splice.studio.cc/",
      "https://www.facebook.com/Splicecc/",
      "https://share.google/xs14h7WtSrIkYlfjS",
    ],
    founder: { "@id": `${BASE_URL}/equipe#louisia` },
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

export function buildLocalBusinessJsonLd(
  rating?: { ratingValue: number; reviewCount: number } | null,
) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService", "VideoProductionCompany"],
    "@id": LOCALBUSINESS_ID,
    parentOrganization: { "@id": ORG_ID },
    name: "Splice Studio",
    alternateName: "Splice Studio Orléans",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-1.svg`,
    image: [`${BASE_URL}/og-image.jpg`],
    hasMap: "https://share.google/xs14h7WtSrIkYlfjS",
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
    areaServed: [
      { "@type": "City", name: "Orléans" },
      { "@type": "City", name: "Tours" },
      { "@type": "AdministrativeArea", name: "Loiret" },
      { "@type": "AdministrativeArea", name: "Indre-et-Loire" },
      { "@type": "AdministrativeArea", name: "Centre-Val de Loire" },
    ],
    sameAs: [
      "https://www.instagram.com/splice.studio.cc/",
      "https://www.facebook.com/Splicecc/",
      "https://share.google/xs14h7WtSrIkYlfjS",
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "11:00",
      closes: "20:00",
    },
    ...(rating && rating.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.ratingValue,
            bestRating: 5,
            worstRating: 1,
            reviewCount: rating.reviewCount,
          },
        }
      : {}),
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
  const url = `${BASE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "fr-FR",
    datePublished: post.publishedAt,
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
    ...(post.parentService ? { articleSection: post.parentService.name } : {}),
    author: post.author
      ? { "@type": "Person", name: post.author.pseudo, worksFor: { "@id": ORG_ID } }
      : { "@type": "Organization", "@id": ORG_ID, name: "Splice Studio" },
    publisher: {
      "@type": "Organization",
      name: "Splice Studio",
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
    name: "Splice Studio",
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
    name: "Contactez Splice Studio",
    url: `${BASE_URL}/contact`,
    mainEntity: {
      "@type": "LocalBusiness",
      name: "Splice Studio",
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
  duration?: string | null;
}

/**
 * Convertit une durée stockée en base ("MM:SS" ou "HH:MM:SS") vers la durée
 * ISO 8601 (PT#H#M#S) attendue par Schema.org `VideoObject`. Renvoie undefined
 * si la chaîne est vide ou mal formée — critère clé pour le Video SERP Google.
 */
function toIso8601Duration(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  const parts = raw.split(":").map((p) => Number.parseInt(p, 10));
  if (parts.length < 1 || parts.length > 3 || parts.some((n) => Number.isNaN(n))) {
    return undefined;
  }
  // Lecture depuis la droite : [secondes, minutes, heures]. Les valeurs par
  // défaut garantissent un type `number` sous noUncheckedIndexedAccess.
  const [s = 0, m = 0, h = 0] = [...parts].reverse();
  const out = `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s ? `${s}S` : ""}`;
  return out === "PT" ? undefined : out;
}

export function buildGalleryJsonLd(
  mediaCount: number,
  medias?: GalleryMediaForJsonLd[],
) {
  const base = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Galerie Splice Studio",
    url: `${BASE_URL}/galerie`,
    description:
      "Portfolio photo et vidéo de Splice Studio — Orléans / Tours.",
    publisher: {
      "@type": "Organization",
      name: "Splice Studio",
    },
    numberOfItems: mediaCount,
  };

  if (!medias || medias.length === 0) return base;

  return {
    ...base,
    hasPart: medias.slice(0, 20).map((m) => {
      const isVideo = m.type === "VIDEO";
      const thumb = m.thumbnailUrl || (isVideo ? `${BASE_URL}/og-image.jpg` : undefined);
      const desc = m.description || (isVideo ? `Vidéo de la galerie Splice Studio - ${m.title}` : undefined);
      const iso = isVideo ? toIso8601Duration(m.duration) : undefined;

      return {
        "@type": isVideo ? "VideoObject" : "ImageObject",
        name: m.title,
        ...(desc ? { description: desc } : {}),
        contentUrl: m.url,
        ...(thumb ? { thumbnailUrl: thumb } : {}),
        // uploadDate dérivé de createdAt (déterministe) — pas de new Date() au
        // rendu, qui changerait à chaque revalidation ISR.
        ...(isVideo && m.createdAt ? { uploadDate: m.createdAt } : {}),
        ...(iso ? { duration: iso } : {}),
      };
    }),
  };
}

/**
 * VideoObject complet pour une page réalisation `/realisations/[slug]`.
 * Émet name, description, thumbnailUrl, contentUrl, uploadDate et duration
 * (ISO 8601) — les champs attendus par Google pour le Video SERP.
 */
export function buildRealisationJsonLd(r: {
  slug: string;
  title: string;
  description?: string | null;
  url: string;
  thumbnailUrl?: string | null;
  createdAt?: string;
  duration?: string | null;
  category?: string | null;
}) {
  const pageUrl = `${BASE_URL}/realisations/${r.slug}`;
  const iso = toIso8601Duration(r.duration);
  const thumb = r.thumbnailUrl || `${BASE_URL}/og-image.jpg`;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: r.title,
    description: r.description || `Réalisation vidéo Splice Studio — ${r.title}.`,
    thumbnailUrl: thumb,
    contentUrl: r.url,
    url: pageUrl,
    ...(r.createdAt ? { uploadDate: r.createdAt } : {}),
    ...(iso ? { duration: iso } : {}),
    ...(r.category ? { genre: r.category } : {}),
    publisher: {
      "@type": "Organization",
      name: "Splice Studio",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo-1.svg` },
    },
  };
}

export function buildTeamJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "L'équipe Splice Studio",
    url: `${BASE_URL}/equipe`,
    mainEntity: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Splice Studio",
      member: [
        {
          "@type": "Person",
          "@id": `${BASE_URL}/equipe#louisia`,
          name: "Louisia",
          jobTitle: "Photographe",
          worksFor: { "@id": ORG_ID },
          knowsAbout: ["Photographie", "Retouche photo", "Direction artistique", "Voix-off"],
          sameAs: "https://instagram.com/by.louisia",
        },
        {
          "@type": "Person",
          "@id": `${BASE_URL}/equipe#tracy`,
          name: "Tracy",
          jobTitle: "Monteur & motion designer",
          worksFor: { "@id": ORG_ID },
          knowsAbout: ["Montage vidéo", "Motion design", "Étalonnage", "Sound design", "DaVinci Resolve"],
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
    name: "Blog — Splice Studio",
    url: `${BASE_URL}/blog`,
    description:
      "Découvrez nos actualités, guides pratiques et conseils sur le montage vidéo, la production corporate et le podcast à Orléans, Tours et Centre-Val de Loire.",
    publisher: {
      "@type": "Organization",
      name: "Splice Studio",
    },
  };
}

export function buildAvisJsonLd(averageRating: number | null, reviewCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Splice Studio",
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

const PRICING_AREA_SERVED = [
  { "@type": "City", name: "Orléans" },
  { "@type": "City", name: "Tours" },
  { "@type": "AdministrativeArea", name: "Centre-Val de Loire" },
];

export function buildPricingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Tarifs — Splice Studio",
    url: `${BASE_URL}/tarifs`,
    description:
      "Tarifs transparents de production vidéo et photographie à Orléans, Tours et Centre-Val de Loire. Abonnements vidéo pro, packs photo à la carte et création de podcast.",
    mainEntity: {
      "@type": "OfferCatalog",
      name: "Tarifs Splice Studio",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Abonnement Vidéo",
          priceCurrency: "EUR",
          description: "Abonnement mensuel vidéo pour les professionnels (formule Standard dès 45 €/mois, Pro 99 €/mois, Premium 189 €/mois)",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "45",
            priceCurrency: "EUR",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: 1,
              unitCode: "MON",
            },
          },
          areaServed: PRICING_AREA_SERVED,
        },
        {
          "@type": "Offer",
          name: "Pack Particulier",
          priceCurrency: "EUR",
          description: "Pack photo/vidéo à la carte pour les particuliers (dès 29 € la vidéo, 15 € le pack photo)",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "29",
            priceCurrency: "EUR",
            minPrice: "15",
          },
          areaServed: PRICING_AREA_SERVED,
        },
      ],
    },
  };
}

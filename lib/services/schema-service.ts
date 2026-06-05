import type { Service } from "@prisma/client";
import type { FAQItem } from "./types";
import type { Ville } from "./local-seo";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://splicestudio.fr").trim();
const ORG_ID = `${SITE_URL}/#organization`;

export function buildServiceJsonLd(service: Service) {
  const url = `${SITE_URL}/services/${service.slug}`;
  const faqItems = (service.faq as unknown as FAQItem[]) ?? [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: "Splice Studio",
        description: "Agence de production audiovisuelle à Orléans et Tours — vidéo corporate, photographie, motion design, pub réseaux sociaux.",
        image: `${SITE_URL}/logo-1.svg`,
        url: SITE_URL,
        priceRange: service.priceRange,
        address: {
          "@type": "PostalAddress",
          postalCode: "45000",
          addressRegion: "Centre-Val de Loire",
          addressCountry: "FR",
        },
      },
      {
        "@type": "Service",
        "@id": `${url}/#service`,
        name: service.name,
        serviceType: service.serviceType,
        description: service.metaDescription,
        provider: { "@id": ORG_ID },
        areaServed: [
          { "@type": "City", name: "Orléans" },
          { "@type": "City", name: "Tours" },
          { "@type": "AdministrativeArea", name: "Centre-Val de Loire" },
          { "@type": "Country", name: "France" },
        ],
        url,
      },
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url,
        name: service.metaTitle,
        isPartOf: { "@id": ORG_ID },
        inLanguage: "fr-FR",
        primaryImageOfPage: { "@type": "ImageObject", url: service.coverImageUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 3, name: service.shortName, item: url },
        ],
      },
      ...(faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqItems.map((q) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: { "@type": "Answer", text: q.answer },
              })),
            },
          ]
        : []),
    ],
  };
}

/**
 * JSON-LD for the /services hub page.
 * Includes LocalBusiness (2 addresses) + OfferCatalog listing published services.
 */
export function buildServicesHubJsonLd(
  services: Pick<Service, "slug" | "name" | "metaDescription" | "serviceType" | "priceRange">[]
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": ORG_ID,
        name: "Splice Studio",
        description:
          "Agence de production audiovisuelle à Orléans et Tours. Vidéo corporate, montage, motion design, photographie professionnelle.",
        image: `${SITE_URL}/logo-1.svg`,
        url: SITE_URL,
        telephone: "+33651109202",
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
        areaServed: [
          { "@type": "City", name: "Orléans" },
          { "@type": "City", name: "Tours" },
          { "@type": "AdministrativeArea", name: "Centre-Val de Loire" },
          { "@type": "Country", name: "France" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services audiovisuels Splice Studio",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.name,
              description: s.metaDescription,
              serviceType: s.serviceType,
              url: `${SITE_URL}/services/${s.slug}`,
            },
          })),
        },
      },
    ],
  };
}

/**
 * JSON-LD for a bespoke top-level landing/pillar page (e.g. /agence-communication-orleans).
 * Emits @graph: ProfessionalService (@id org) + WebPage + BreadcrumbList + Service + optional FAQPage.
 */
export function buildLandingJsonLd(opts: {
  path: string;
  name: string;
  pageTitle: string;
  description: string;
  breadcrumbName: string;
  serviceType: string;
  faq?: FAQItem[];
}) {
  const url = `${SITE_URL}${opts.path}`;
  const faqItems = opts.faq ?? [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: "Splice Studio",
        description:
          "Studio de production audiovisuelle et agence de communication à Orléans et Tours — vidéo corporate, photographie, motion design, social media.",
        image: `${SITE_URL}/logo-1.svg`,
        url: SITE_URL,
        telephone: "+33651109202",
        areaServed: [
          { "@type": "City", name: "Orléans" },
          { "@type": "City", name: "Tours" },
          { "@type": "AdministrativeArea", name: "Centre-Val de Loire" },
          { "@type": "Country", name: "France" },
        ],
        address: {
          "@type": "PostalAddress",
          postalCode: "45000",
          addressRegion: "Centre-Val de Loire",
          addressCountry: "FR",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url,
        name: opts.pageTitle,
        isPartOf: { "@id": ORG_ID },
        inLanguage: "fr-FR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: opts.breadcrumbName, item: url },
        ],
      },
      {
        "@type": "Service",
        "@id": `${url}/#service`,
        name: opts.name,
        serviceType: opts.serviceType,
        description: opts.description,
        provider: { "@id": ORG_ID },
        areaServed: [
          { "@type": "City", name: "Orléans" },
          { "@type": "City", name: "Tours" },
        ],
        url,
      },
      ...(faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqItems.map((q) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: { "@type": "Answer", text: q.answer },
              })),
            },
          ]
        : []),
    ],
  };
}

/**
 * JSON-LD for a geo-local service page (/services/[slug]/[ville]).
 */
export function buildLocalServiceJsonLd(opts: {
  serviceName: string;
  serviceSlug: string;
  ville: Ville;
  description: string;
  priceRange: string;
  parentServiceSlug: string;
  faq?: FAQItem[];
}) {
  const url = `${SITE_URL}/services/${opts.serviceSlug}/${opts.ville.slug}`;
  const parentUrl = `${SITE_URL}/services/${opts.parentServiceSlug}`;
  const faqItems = opts.faq ?? [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 3, name: opts.serviceName, item: parentUrl },
          { "@type": "ListItem", position: 4, name: opts.ville.name, item: url },
        ],
      },
      {
        "@type": "Service",
        name: opts.serviceName,
        description: opts.description,
        url,
        provider: {
          "@type": "LocalBusiness",
          "@id": ORG_ID,
          name: "Splice Studio",
          url: SITE_URL,
        },
        areaServed: {
          "@type": opts.ville.departmentCode ? "City" : "AdministrativeArea",
          name: opts.ville.name,
        },
        offers: {
          "@type": "Offer",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "EUR",
          },
          description: opts.priceRange,
        },
      },
      ...(faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqItems.map((q) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: { "@type": "Answer", text: q.answer },
              })),
            },
          ]
        : []),
    ],
  };
}

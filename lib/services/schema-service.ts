import type { Service } from "@prisma/client";
import type { FAQItem } from "./types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://deepframe.cc";
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
        name: "DeepFrame",
        description: "Agence de production audiovisuelle haut de gamme.",
        image: `${SITE_URL}/logo.svg`,
        url: SITE_URL,
        priceRange: service.priceRange,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Orleans",
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
        areaServed: { "@type": "Country", name: "France" },
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

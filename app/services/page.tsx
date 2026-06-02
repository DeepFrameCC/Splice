import type { Metadata } from "next";
import { getAllServices } from "@/lib/services/queries";
import { buildServicesHubJsonLd } from "@/lib/services/schema-service";
import { absoluteUrl } from "@/lib/seo";
import ServicesClient from "@/components/services/ServicesClient";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Services audiovisuels Orléans Tours | Splice",
  description:
    "Production vidéo, photographie professionnelle, motion design, pub réseaux sociaux à Orléans et Tours. Splice couvre toute la chaîne de production audiovisuelle en Centre-Val de Loire.",
  alternates: { canonical: absoluteUrl("/services") },
  openGraph: {
    title: "Nos services audiovisuels — Orléans · Tours | Splice",
    description:
      "Montage vidéo, production corporate, motion design, shooting automobile, photographie professionnelle et plus. Splice couvre toute la chaîne audiovisuelle à Orléans et Tours.",
    url: absoluteUrl("/services"),
    siteName: "Splice",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nos services audiovisuels — Orléans · Tours | Splice",
    description:
      "Montage vidéo, production corporate, motion design, shooting automobile, photographie professionnelle et plus.",
  },
};

export const revalidate = 3600;

export default async function ServicesHubPage() {
  const services = await getAllServices();
  const jsonLd = buildServicesHubJsonLd(services);

  return (
    <>
      <JsonLd data={jsonLd} />
      <ServicesClient services={services} />
    </>
  );
}

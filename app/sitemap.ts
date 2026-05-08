import { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://deepframe.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base,                  lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/videos`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/photos`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/avis`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${base}/devis`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.8 },
  ];
}

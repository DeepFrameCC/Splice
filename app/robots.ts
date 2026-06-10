import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

/**
 * Routes privées ou transactionnelles, exclues du crawl.
 * (Les pages elles-mêmes portent aussi un meta robots noindex.)
 */
const PRIVATE_PATHS = [
  "/cdn-cgi/",
  "/api/",
  "/admin/",
  "/profil/",
  "/devis/confirmation",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // GEO (Generative Engine Optimization) : autoriser explicitement les
      // crawlers IA à lire le contenu public pour être cité par ChatGPT,
      // Claude, Perplexity et les AI Overviews de Google.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
        ],
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

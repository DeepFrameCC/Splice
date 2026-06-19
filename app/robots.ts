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

// GEO (Generative Engine Optimization) : crawlers IA + Googlebot autorisés
// explicitement sur le contenu public. Un user-agent par bloc — certains
// parsers (SEMrush) signalent comme invalide un seul bloc `rules` portant un
// tableau de user-agents. Tous ont la même politique : allow "/" sauf privé.
const ALLOWED_AGENTS = [
  "*",
  "Googlebot",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: ALLOWED_AGENTS.map((userAgent) => ({
      userAgent,
      allow: "/",
      disallow: PRIVATE_PATHS,
    })),
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

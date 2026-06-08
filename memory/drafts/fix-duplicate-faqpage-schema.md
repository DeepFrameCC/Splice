---
id: fix-duplicate-faqpage-schema
title: "Correction du schéma FAQPage en double sur les pages de services"
summary: "Résolution de l'erreur 'FAQPage en double' sur les pages services de splicestudio.fr en supprimant le bloc JsonLd de FAQ redondant."
type: fix
coreprimary: fixes
importance: 0.5
status: draft
schemaversion: "3.5"
created: 2026-06-08
updated: 2026-06-08
links: []
---

# Correction du schéma FAQPage en double sur les pages de services

## Problématique
Google Rich Results / Search Console signalait un problème critique : "Champ 'FAQPage' en double" sur les pages de détail des services (ex: `/services/photographie-google-business`).

## Cause racine
Dans [app/services/[slug]/page.tsx](file:///c:/Users/Windows/Splice/app/services/[slug]/page.tsx), deux blocs JSON-LD étaient rendus :
1. Le bloc principal généré par `buildServiceJsonLd` qui inclut déjà un objet de type `FAQPage` dans son tableau `@graph`.
2. Un second bloc `<JsonLd data={{ "@type": "FAQPage", ... }}` rendu manuellement et de manière redondante.

Cette duplication provoquait des erreurs d'analyse chez les robots d'indexation de Google.

## Résolution
Suppression du bloc JSON-LD FAQPage redondant de [app/services/[slug]/page.tsx](file:///c:/Users/Windows/Splice/app/services/[slug]/page.tsx). Désormais, seul le schéma unifié de `buildServiceJsonLd` est injecté, résolvant proprement le problème SEO tout en conservant les données structurées de la FAQ.


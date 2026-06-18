---
id: blog-topics-seo-2026-06
title: "Sujets de blog SEO prioritaires — People Also Ask (juin 2026)"
summary: "Suggestions d'articles de blog à créer (par l'admin) pour capter les 25 mots-clés déclencheurs de People Also Ask non captés. Chaque sujet cible un mot-clé, un angle PAA et respecte la règle de maillage interne (≥2 liens contextuels)."
type: feature
coreprimary: product
importance: 0.6
status: draft
schemaversion: "3.5"
created: 2026-06-18
updated: 2026-06-18
links: [audit-seo-semrush-2026-06-18, seo-sprint-results-2026-06-18]
---

# Sujets de blog SEO prioritaires — People Also Ask

**Ne pas générer ces articles automatiquement.** Suggestions à valider et rédiger par l'admin (ton authentique, exemples réels de projets Splice Studio). Chaque article doit respecter la règle de maillage interne du projet : **≥ 2 liens internes contextuels** (1 vers la page service générique, 1 vers la page service×ville locale).

Objectif : capter les **25 mots-clés déclencheurs de People Also Ask** identifiés par SEMrush (0 capté actuellement). Un `BlogPost` doit être en `status: PUBLISHED` pour entrer dans `app/sitemap.ts`.

## Articles prioritaires

### 1. « Combien coûte une vidéo d'entreprise à Orléans ? »
- **Mot-clé cible** : prix vidéo entreprise / vidéo promotionnelle entreprise (vol 90)
- **Angle PAA** : fourchettes de prix réelles, ce qui fait varier le devis (durée tournage, montage, motion design), exemples de formules.
- **Liens internes** : [/services/production-corporate](/services/production-corporate) + [/services/production-corporate/orleans](/services/production-corporate/orleans) + [/tarifs](/tarifs) + [/devis](/devis).
- **Service parent** : production-corporate.

### 2. « Vidéaste ou agence vidéo : quelle différence ? »
- **Mot-clé cible** : vidéaste orléans (vol 150, pos 10 — quick win)
- **Angle PAA** : freelance vs studio, avantages d'un interlocuteur unique avec chaîne de production complète.
- **Liens internes** : [/videaste-orleans](/videaste-orleans) + [/production-video-orleans](/production-video-orleans) + [/services/montage-video/orleans](/services/montage-video/orleans).

### 3. « Motion design pour les réseaux sociaux : guide complet »
- **Mot-clé cible** : motion design orléans (différenciant)
- **Angle PAA** : qu'est-ce que le motion design, cas d'usage réseaux sociaux, 2D vs 3D, exemples.
- **Liens internes** : [/services/motion-design](/services/motion-design) + [/services/motion-design/orleans](/services/motion-design/orleans) + [/services/pub-reseaux-sociaux](/services/pub-reseaux-sociaux).

### 4. « Photographe corporate vs photographe événementiel : que choisir ? »
- **Mot-clé cible** : photographe orléans (vol 260)
- **Angle PAA** : différences de besoin, portraits/corporate vs couverture d'événement.
- **Liens internes** : [/photographe-orleans](/photographe-orleans) + [/services/photographie-professionnelle/orleans](/services/photographie-professionnelle/orleans) + [/photographe-evenementiel](/photographe-evenementiel).

### 5. « Quel format vidéo pour Instagram Reels, TikTok et YouTube Shorts ? »
- **Mot-clé cible** : vidéo réseaux sociaux entreprise (vol 70, pos 6 — à consolider)
- **Angle PAA** : 9:16, durées optimales, hook, sous-titres, specs par plateforme.
- **Liens internes** : [/services/pub-reseaux-sociaux](/services/pub-reseaux-sociaux) + [/services/pub-reseaux-sociaux/orleans](/services/pub-reseaux-sociaux/orleans) + [/galerie](/galerie).

### 6. « Combien coûte un shooting photo professionnel ? »
- **Mot-clé cible** : shooting photo orléans (vol 90, pos 7) / photographe orléans
- **Angle PAA** : fourchettes, ce qui est inclus (retouche, livraison, droits).
- **Liens internes** : [/photographe-orleans](/photographe-orleans) + [/services/photographie-professionnelle/orleans](/services/photographie-professionnelle/orleans) + [/tarifs](/tarifs).

## Rappels techniques
- FAQ d'article → un seul `FAQPage` par page (cf. [[fix-duplicate-faqpage-schema]]).
- Chaque article = `BlogPosting` JSON-LD via `buildBlogPostJsonLd` (déjà en place dans `lib/seo.ts`), rattaché à son `parentService` pour le silo SEO.
- Ancres descriptives, pas de « cliquez ici ».

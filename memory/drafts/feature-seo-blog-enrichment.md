---
id: feature-seo-blog-enrichment
title: "Enrichissement SEO du blog de Splice Studio"
type: asset
coreprimary: product
importance: 0.5
status: draft
schemaversion: "3.5"
created: 2026-06-21
updated: 2026-06-21
links: []
---

# Enrichissement SEO du blog de Splice Studio

## Contexte
Intégration d'un audit SEO complet du blog de Splice Studio. L'objectif est de booster la visibilité de Splice Studio (Orléans/Tours/Centre-Val de Loire) en capturant des requêtes locales longue traîne.

## Actions Réalisées
1. **Enrichissement de 5 articles existants :**
   - Intégration de données et statistiques d'études de référence (HubSpot, Wyzowl, Meltwater, Brightcove, KabochArts 2026).
   - Ajout d'un tableau comparatif et d'estimations budgétaires pour la comparaison Motion Design / Prise de vue réelle.
   - Restructuration des titres (H2/H3) et incorporation de mots-clés géolocalisés (Orléans, Tours, Loiret, Centre-Val de Loire).
   - Intégration systématique de liens internes contextuels sémantiques entre articles et vers les pages de services.
   - Uniformisation des appels à l'action (CTA) : utilisation unique de "Demander un devis" vers la page `/devis`.
2. **Création et intégration de 12 nouveaux articles locaux :**
   - Écriture complète des contenus des 12 nouveaux sujets locaux ciblant des expressions longue traîne à faible concurrence dans le fichier `prisma/blog-content.ts`.
   - Ajout des métadonnées correspondantes dans la constante `blogMetaTitles` (titres courts de moins de 60 caractères).
   - Enregistrement des 12 nouveaux articles dans `prisma/seed.ts` pour automatiser le seeding.
3. **Mise à jour et Seeding de la base de données :**
   - Exécution réussie de `npm run db:seed` pour créer les nouveaux articles en base de données.
   - Synchronisation complémentaire via `npm run sync:blog`.

## Impact SEO attendu
- Amélioration de l'autorité thématique du site via une architecture en clusters (silos thématiques : corporate, événementiel, réseaux sociaux).
- Capture de trafic hautement qualifié en phase d'achat (intention transactionnelle) sur les requêtes locales (ex. `prix vidéo corporate Orléans 2026`, `aftermovie séminaire Orléans`).

## Fichiers modifiés / créés
- [blog-content.ts](file:///c:/Users/Windows/Splice/prisma/blog-content.ts) [MODIFY]
- [seed.ts](file:///c:/Users/Windows/Splice/prisma/seed.ts) [MODIFY]
- [feature-seo-blog-enrichment.md](file:///C:/Users/Windows/Splice/memory/drafts/feature-seo-blog-enrichment.md) [NEW]

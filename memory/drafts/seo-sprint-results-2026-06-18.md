---
id: seo-sprint-results-2026-06-18
title: "Sprint SEO SEMrush — résultats passe 1 (schema-only)"
summary: "Passe schema-only du sprint SEO : fix duration VideoObject (Video SERP), enrichissement LocalBusiness (VideoProductionCompany + hasMap + image[] + aggregateRating optionnel), prix réels OfferCatalog, 4 questions PAA /faq, title homepage transac. Lint + build + 68 tests OK. Pages géo neuves non faites (en attente validation)."
type: feature
coreprimary: tech
importance: 0.7
status: draft
schemaversion: "3.5"
created: 2026-06-18
updated: 2026-06-18
links: [audit-seo-semrush-2026-06-18, fix-duplicate-faqpage-schema]
---

# Sprint SEO SEMrush — résultats passe 1 (schema-only)

## Périmètre de cette passe

Suite à l'[[audit-seo-semrush-2026-06-18]], passe « schema-only » : edits chirurgicaux à faible risque, 100 % vérifiables par build. **Pas de nouvelle page** (les landings `vidéaste orléans` / `photographe orléans` et la route `/realisations/[slug]` restent à faire, sous validation).

## Fichiers modifiés

- `lib/seo.ts` [MODIFY]
- `app/faq/page.tsx` [MODIFY]
- `app/layout.tsx` [MODIFY]

## Changements détaillés

### 1. Video SERP — `VideoObject.duration` (cause racine corrigée)
`lib/seo.ts` / `buildGalleryJsonLd` :
- Ajout du champ `duration` à l'interface `GalleryMediaForJsonLd` (il était sélectionné en DB et passé par `app/galerie/page.tsx` mais **ignoré** par le helper).
- Nouvelle fonction `toIso8601Duration()` : convertit le format DB `"MM:SS"` / `"HH:MM:SS"` (ex. `"02:30"`, `"42:18"`) en ISO 8601 `PT#H#M#S` attendu par Schema.org. Robuste aux formats invalides (renvoie `undefined`). Compatible Workers (pas d'API Node).
- `uploadDate` : dérivé de `createdAt` uniquement, suppression du fallback `new Date().toISOString()` qui changeait à chaque revalidation ISR (signal instable).

### 2. Local Pack + Reviews — `buildLocalBusinessJsonLd`
- `@type` étendu à `["LocalBusiness", "ProfessionalService", "VideoProductionCompany"]`.
- `hasMap` ajouté (lien Google Maps `share.google/...`).
- `image` passé en array (était une string unique) — `og-image.jpg` (seul visuel garanti existant, pas de 404).
- **`aggregateRating` ajouté en paramètre optionnel** `rating?: { ratingValue, reviewCount }`. Émis seulement si fourni. **Non câblé en sitewide** : le root `layout.tsx` ne fait aucun appel DB aujourd'hui ; en ajouter un toucherait le piège Neon scale-to-zero → 504. Le câblage sitewide (fetch agrégat avis caché) est une décision perf à part.

### 3. Rich result tarifs — `buildPricingJsonLd`
- `OfferCatalog` : prix réels ajoutés via `priceSpecification` (Abonnement Vidéo dès 45 €/mois `UnitPriceSpecification` unitCode MON ; Pack Particulier `PriceSpecification` price 29 € / minPrice 15 €).
- `areaServed` (Orléans, Tours, Centre-Val de Loire) ajouté sur chaque Offer.

### 4. People Also Ask — `app/faq/page.tsx`
4 questions PAA ajoutées (alimentent automatiquement le `FAQPage` existant, **un seul par page** — pas de doublon, cf. [[fix-duplicate-faqpage-schema]]) :
- « Combien coûte un shooting photo professionnel à Orléans ? »
- « Quel format vidéo pour des Reels Instagram ? »
- « Qu'est-ce que le motion design ? »
- « Quelle est la différence entre un aftermovie et un film d'entreprise ? »
Chaque réponse avec maillage interne (liens vers /services/*, /devis).

### 5. Homepage — `app/layout.tsx`
- `title.default` : `"Splice Studio — Production audiovisuelle · Orléans & Tours"` → `"Agence Vidéo & Photographe à Orléans — Splice Studio"` (52 car., cible « agence vidéo orléans » + « photographe orléans »).
- `description` enrichie : vidéaste, motion design, reels, devis gratuit.

## Vérification

- `npm run lint` : OK (seul warning pré-existant `TwoFactorSection.tsx`, fichier non touché).
- `npm run build` : OK, 71 pages générées. Warnings pré-existants uniquement (prisma/sentry critical dependency, classes Tailwind ambiguës dans `equipe`).
- `npm run test` : 68/68 tests passent.
- Première correction de build : TS strict `noUncheckedIndexedAccess` rejetait le destructuring `[h,m,s] = parts` (→ `number | undefined`). Résolu via reverse-destructure avec valeurs par défaut `const [s = 0, m = 0, h = 0] = [...parts].reverse()`.

## Mots-clés ciblés (passe 1)

| Page | Avant | Après (signaux ajoutés) |
|---|---|---|
| `/` (home) | title générique | « agence vidéo orléans », « photographe orléans » dans title/description |
| `/galerie` | VideoObject sans duration | VideoObject avec duration ISO + uploadDate stable → Video SERP |
| `/tarifs` | OfferCatalog sans prix | prix réels + areaServed |
| `/faq` | ~22 Q | +4 Q PAA (motion design, reels, shooting photo, aftermovie) |
| sitewide | LocalBusiness basique | +VideoProductionCompany +hasMap +image[] (+aggregateRating prêt) |

## Reste à faire (sous validation)

1. **`aggregateRating` sitewide** : décision perf — fetch agrégat avis (`db.avis.aggregate`) caché dans `layout.tsx` avec try/catch, vs garder sur `/avis` seulement. Risque Neon 504 à arbitrer.
2. **Landings géo** `/videaste-orleans` (pos 10, vol 150) + `/photographe-orleans` (vol 260) en standalone via `buildLandingJsonLd` (PAS dans `SERVICES_LOCAL_SLUGS`).
3. **Route dynamique `/realisations/[slug]`** : VideoObject complet + description longue + breadcrumb + maillage. Vérifier CSP si embeds YouTube/Vimeo (R2 déjà couvert).
4. **Sujets blog PAA** : note de suggestions pour l'admin.
5. **Off-page** : Google Business Profile, netlinking local 45/37.

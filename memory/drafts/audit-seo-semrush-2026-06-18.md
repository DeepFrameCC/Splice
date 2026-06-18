---
id: audit-seo-semrush-2026-06-18
title: "Audit SEO post-rapports SEMrush — 18 juin 2026"
summary: "Diagnostic complet des manques SEO identifiés via SEMrush : visibilité 3.33%, 0 Video SERP capturé, 0 Local Pack lié. Code existant solide sur les bases, trois leviers majeurs sous-exploités (VideoObject, aggregateRating sitewide, pages géo nouvelles cibles)."
type: decision
coreprimary: decisions
importance: 0.9
status: draft
schemaversion: "3.5"
created: 2026-06-18
updated: 2026-06-18
links: [fix-duplicate-faqpage-schema, fix-csp-gtm-ga4]
---

# Audit SEO post-rapports SEMrush — 18 juin 2026

## Contexte

Rapports SEMrush (Desktop, Google France, Organic) exportés le 18/06/2026. État de départ : visibilité organique 3.33 %, position moyenne 87.53, trafic estimé 0.01. Objectif 90 jours : visibilité > 15 %, position moyenne < 40.

Cet audit cartographie l'existant **sans rien modifier** (Mission 1). Il sert de base aux missions 2 à 9.

## Méthode

Lecture intégrale de : `lib/seo.ts`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `lib/services/local-seo.ts`, `lib/services/schema-service.ts`, `middleware.ts`, `app/faq/page.tsx`, `app/galerie/page.tsx`, `app/tarifs/page.tsx`, `app/page.tsx`. Greps : `export const metadata` (33 pages), `FAQPage`, `VideoObject`, usages des helpers `buildXxxJsonLd`.

---

## 1. Inventaire JSON-LD existant (`lib/seo.ts`)

Helpers présents et fonctionnels :

| Fonction | Type Schema.org | Consommée par |
|---|---|---|
| `buildOrganizationJsonLd` | Organization | `app/layout.tsx` (@graph global) |
| `buildWebSiteJsonLd` | WebSite + SearchAction | `app/layout.tsx` (@graph global) |
| `buildLocalBusinessJsonLd` | `["LocalBusiness","ProfessionalService"]` | `app/layout.tsx` (@graph global) |
| `buildBreadcrumbJsonLd` | BreadcrumbList | helper (usage à confirmer) |
| `buildServiceJsonLd` | Service | helper (doublon avec `schema-service.ts`) |
| `buildBlogPostJsonLd` | BlogPosting | pages blog |
| `buildContactPageJsonLd` | ContactPage | `app/contact/page.tsx` |
| `buildGalleryJsonLd` | CollectionPage + VideoObject/ImageObject | `app/galerie/page.tsx` |
| `buildTeamJsonLd` | AboutPage + Person×2 | `app/equipe/page.tsx` |
| `buildBlogIndexJsonLd` | CollectionPage | `app/blog/page.tsx` |
| `buildAvisJsonLd` | LocalBusiness + AggregateRating | `app/avis/page.tsx` uniquement |
| `buildPricingJsonLd` | WebPage + OfferCatalog | `app/tarifs/page.tsx` |

Helpers Schema.org pour services dans `lib/services/schema-service.ts` (distinct de `lib/seo.ts`) : `buildServiceJsonLd(Service)`, `buildServicesHubJsonLd`, `buildLandingJsonLd`, `buildLocalServiceJsonLd`. Les pages `/services/[slug]`, `/services/[slug]/[ville]` et les landings géo (`/agence-communication-orleans`, etc.) utilisent ce module.

**Note architecture importante** : deux fonctions `buildServiceJsonLd` coexistent (une dans `lib/seo.ts`, une dans `schema-service.ts`). Ne pas confondre lors des modifications.

---

## 2. Constat par fonctionnalité SERP non capturée

### 2.1 Video SERP — 38 mots-clés, 0 capturé 🔥 PRIORITÉ MAX

Cause racine identifiée dans `buildGalleryJsonLd` (`lib/seo.ts:224-270`) :

- L'interface `GalleryMediaForJsonLd` **n'inclut pas `duration`**. Or `app/galerie/page.tsx` sélectionne bien `duration` depuis la DB (`getPublishedMedias`, ligne 28) et le passe à la fonction — mais le helper l'ignore. Résultat : **aucun `VideoObject` n'émet `duration`** (ISO 8601 `PT#M#S`), critère important pour le Video SERP Google.
- `thumbnailUrl` : si null, fallback sur `${BASE_URL}/og-image.jpg` (générique) au lieu d'une vraie miniature vidéo.
- Pas de `embedUrl` (aucun lien YouTube/Vimeo associé en DB pour l'instant).
- `uploadDate` : fallback `new Date().toISOString()` → date non déterministe au build, change à chaque rendu (mauvais signal).
- `hasPart` limité aux 20 premiers médias (`slice(0, 20)`).

Autre limite : **une seule page liste les vidéos** (`/galerie`, CollectionPage). Aucune page dédiée par réalisation. Il existe un unique `/realisations/ck-clean-auto` (statique, hardcodé, contient un `VideoObject` manuel ligne 76) mais **pas de route dynamique `/realisations/[slug]`**. Google favorise une page = une vidéo avec description longue + VideoObject complet.

### 2.2 Local Pack — 13 mots-clés, 0 capturé 🔥

`buildLocalBusinessJsonLd` (`lib/seo.ts:52-104`) — déjà solide (2 adresses Orléans/Tours, geo, areaServed, openingHours, sameAs). Manques :

- `@type` = `["LocalBusiness","ProfessionalService"]` → **`VideoProductionCompany` absent** (type Schema.org plus précis pour le métier).
- `hasMap` absent (lien Google Maps : `https://share.google/xs14h7WtSrIkYlfjS` présent dans `sameAs` mais pas en `hasMap`).
- `image` = string unique (`og-image.jpg`) → devrait être un array (plusieurs visuels rassurent l'algo local).
- Pas d'`aggregateRating` sur ce LocalBusiness global. Il n'existe que sur `/avis` via `buildAvisJsonLd`.

### 2.3 Reviews — 23 mots-clés, 0 capturé 📈

`buildAvisJsonLd` (note moyenne + reviewCount) n'est appelé **que sur `/avis`**. Le LocalBusiness du `@graph` racine (présent sur toutes les pages via `layout.tsx`) ne porte aucun `aggregateRating` → pas d'étoiles dans les SERP sitewide. Page `/avis` bien crawlable (absente de `PRIVATE_PATHS` dans `robots.ts`).

### 2.4 People Also Ask — 25 mots-clés, 0 capturé 📈

`/faq` possède déjà un `FAQPage` riche (`app/faq/page.tsx:180-193`, ~22 questions). Couverture partielle des PAA cibles. Manquent notamment : « Qu'est-ce que le motion design ? », « Combien coûte un shooting photo professionnel ? », « Quelle différence entre aftermovie et film d'entreprise ? », « Quel format vidéo pour Instagram Reels ? ». Levier blog quasi inexploité pour les PAA.

### 2.5 Knowledge Panel — 12 mots-clés, 0 capturé 📈

Dépend surtout de signaux off-page (Google Business Profile vérifié, Wikidata, cohérence NAP, `sameAs`). Côté code, `Organization` + `sameAs` sont en place. Action principalement off-page (hors périmètre code).

---

## 3. Audit on-page des pages prioritaires

### 3.1 Homepage (`/`)

- `app/page.tsx` ne définit que `alternates.canonical: "/"`. Le `title`/`description` viennent du `layout.tsx` `metadata.title.default` = « Splice Studio — Production audiovisuelle · Orléans & Tours ».
- **Manque les mots-clés transactionnels forts** dans le title par défaut : « agence vidéo Orléans », « photographe Orléans », « vidéaste Orléans ». Cible Mission 2a (modifier `layout.tsx`, pas `page.tsx`).
- ISR `revalidate = 3600` OK. Preload poster hero (LCP) OK.

### 3.2 `/faq`

- Metadata OK (title, description, canonical, OG). Un seul `FAQPage` (pas de doublon). Maillage interne riche (liens vers /services/*, /devis, /galerie, /contact).
- Améliorable : ajouter 3-4 questions PAA cibles non couvertes.

### 3.3 `/galerie`

- Metadata OK (canonical présent). `buildGalleryJsonLd` appelé avec les vrais médias.
- **Bug structurel** : `duration` non émis (cf. 2.1). Faute de frappe dans la description meta : « Decouvrez » / « cinematiques » (sans accents). Title correct.

### 3.4 `/tarifs`

- Metadata OK. `buildPricingJsonLd` appelé.
- `OfferCatalog` **sans prix réels** : les 2 Offers (« Abonnement Vidéo », « Pack Particulier ») n'ont ni `price` ni `priceSpecification` ni `lowPrice`. Or les vrais prix sont connus (abonnement dès 45 €/mois, pack dès 29 €). Ajouter `priceSpecification` + `areaServed` enrichirait le rich result.

---

## 4. Sitemap & robots

### `app/sitemap.ts`
- Pages statiques : 21 entrées, dont landings géo (`production-video-orleans`, `production-video-tours`, `photographe-evenementiel`, `agence-communication-orleans`, `realisations/ck-clean-auto`).
- Pages géo dynamiques : `SERVICES_LOCAL_SLUGS` (7 slugs) × `VILLES` (2) = **14 pages** `/services/[slug]/[ville]`. (Le commentaire du fichier dit « 12 » — obsolète, 7 slugs désormais.)
- Pages DB : services publiés + blog `PUBLISHED`. Try/catch si DB indisponible au build.
- **Manques** : aucune entrée pour les nouvelles cibles `vidéaste orléans` / `photographe orléans` (pages à créer). Pas de sitemap vidéo dédié.

### `app/robots.ts`
- Correct. `PRIVATE_PATHS` bloque api/admin/profil/auth. Bloc GEO explicite (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) → bon pour citations IA. `/avis` et `/services/*` bien crawlables.

---

## 5. CSP (`middleware.ts`)

Directives actuelles :
- `img-src` : self, data, blob, `*.r2.dev`, `cdn.splicestudio.fr`, `media.splicestudio.fr`, google-analytics, googletagmanager.
- `media-src` : self, `media.splicestudio.fr`.
- `script-src` : self, stripe, cloudflare, plausible, googletagmanager, sentry (+ nonce sur routes dynamiques, `unsafe-inline` sur routes statiques).
- `frame-src` : stripe, hooks.stripe, cloudflare.
- `connect-src` : resend, stripe, cloudflare, plausible, GA, sentry.

**Implication missions** : les vidéos R2 (`media.splicestudio.fr`) sont déjà autorisées (img-src + media-src). **Si** Mission 3 introduit des embeds YouTube/Vimeo → ajouter `https://www.youtube-nocookie.com` / `https://player.vimeo.com` à `frame-src` (sinon blocage silencieux en prod). Tant qu'on reste sur R2, aucune modif CSP nécessaire.

---

## 6. Synthèse des actions (priorité décroissante)

| # | Action | Fichier(s) | Impact SERP | Risque |
|---|---|---|---|---|
| 1 | Émettre `duration` (ISO 8601) + vraie `thumbnailUrl` + `uploadDate` stable dans `VideoObject` | `lib/seo.ts` (`GalleryMediaForJsonLd` + `buildGalleryJsonLd`) | Video SERP 🔥 | Faible |
| 2 | Page dynamique `/realisations/[slug]` (VideoObject complet + description longue + breadcrumb + maillage) | nouveau `app/realisations/[slug]/page.tsx` | Video SERP 🔥 | Moyen (nouvelle route) |
| 3 | `aggregateRating` sur le LocalBusiness racine + `VideoProductionCompany` + `hasMap` + `image[]` | `lib/seo.ts` (`buildLocalBusinessJsonLd`) + `layout.tsx` | Local Pack + Reviews 🔥 | Faible |
| 4 | Pages cibles `vidéaste orléans` (pos 10, vol 150) & `photographe orléans` (vol 260) — **en landings standalone** (`buildLandingJsonLd`), pas dans la matrice `SERVICES_LOCAL_SLUGS` | nouveaux `app/videaste-orleans/`, `app/photographe-orleans/` + sitemap | Quick Win | Moyen |
| 5 | Prix réels dans `OfferCatalog` (priceSpecification + areaServed) | `lib/seo.ts` (`buildPricingJsonLd`) | Rich result tarifs | Faible |
| 6 | 3-4 questions PAA dans `/faq` | `app/faq/page.tsx` | PAA | Faible |
| 7 | Title homepage enrichi mots-clés transac | `app/layout.tsx` (title.default + description) | Pos. moyenne `/` | Faible (vérifier longueur ≤ 60 car.) |
| 8 | Suggestions sujets blog (PAA) — ne pas créer, suggérer admin | `memory/drafts/blog-topics-seo-2026-06.md` | PAA / contenu | Nul |

---

## 7. Pièges à respecter pendant l'exécution

1. **Un seul `FAQPage` par page** — la faq et chaque service en ont déjà un. Ne pas en ajouter un 2e (cf. [[fix-duplicate-faqpage-schema]]).
2. **CSP first** — toute origine externe (embed vidéo, pixel) = update `middleware.ts` (cf. [[fix-csp-gtm-ga4]]). R2 déjà couvert.
3. **Workers compatible** — pas de `fs`/`path`/`crypto` Node. WebCrypto uniquement.
4. **`uploadDate` déterministe** — ne pas utiliser `new Date()` au rendu (instable ISR). Dériver de `createdAt` DB.
5. **Mission 4a mal routée dans le prompt** : « videaste-orleons » est une faute (orleans) ET ces cibles sont des landings géo standalone, pas des couples service×ville. Trancher en faveur de l'architecture existante (`buildLandingJsonLd` + page top-level), pas `SERVICES_LOCAL_SLUGS`.
6. **`buildServiceJsonLd` existe en double** (`lib/seo.ts` vs `schema-service.ts`) — cibler le bon fichier.

## 8. Prochaines actions (off-page, hors code)

- Google Business Profile : vérifier/optimiser la fiche (photos, catégorie « Service de production vidéo », posts réguliers) → débloque Local Pack + Knowledge Panel + Reviews.
- Netlinking local (annuaires Loiret 45 / Indre-et-Loire 37, presse régionale) pour rattraper denux-productions (1567 kw) et stephanehussein (1076 kw).
- Backlinks clients (« Réalisation : Splice Studio »).

---

**Fin Mission 1.** Aucun fichier de code modifié. Missions 2-9 = écriture, sous validation.

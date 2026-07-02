---
id: feature-refonte-outfit-2026-07
title: "Refonte design Outfit — accueil, services, galerie"
summary: "Migration typographique Anton/Poppins → Outfit variable (100-900) et refonte visuelle des 3 pages publiques principales d'après les maquettes handoff, sans perte de contenu/SEO/logique."
type: feature
coreprimary: design
importance: 0.7
status: draft
schemaversion: "3.5"
created: 2026-07-02
updated: 2026-07-02
links: []
---

# Refonte design Outfit — accueil, services, galerie

## Problématique
Handoff de maquettes HTML (`accueil.html`, `services.html`, `galerie.html` + README) demandant : remplacer Anton (display) et Poppins (body) par **Outfit** partout, et refondre le design des 3 pages publiques principales en conservant intégralement contenu, médias, SEO et fonctionnalités.

## Décisions clés
1. **Une seule fonte variable** : `public/fonts/Outfit-Variable.woff2` (latin, 32 Ko, wght 100-900) chargée deux fois via `next/font/local` dans `app/layout.tsx` pour `--font-display` ET `--font-sans`. La hiérarchie se fait par graisse/casse/tracking, plus par famille.
2. **Piège Anton → Outfit** : Anton est mono-graisse et visuellement lourde en `font-weight: 400` ; Outfit 400 est maigre. Parade globale : `globals.css` définit `.font-display { font-weight: 800 }` en couche `components` (un utilitaire `font-*` explicite garde la priorité car la couche `utilities` vient après). Les styles inline `fontFamily: var(--font-display)` contournent ce défaut → vérifier qu'ils portent une graisse explicite.
3. **Convention accent** : le mot accentué d'un titre est orange `#F36B1F` **sans italique** (`not-italic` / `font-style: normal`). L'ancienne convention italique Poppins 700 est supprimée partout (globals.css, prototype-styles.css ×14, pages login/register/contact/equipe).
4. **prototype-styles.css est partagé** : les classes `df-*` sont consommées par home, services ET gallery → un seul agent (accueil) a le droit d'y écrire, les autres stylent en Tailwind ; Grep obligatoire avant suppression/renommage d'une classe `df-*`.
5. **Exception blog** : le thème éditorial des articles (`app/blog/[slug]`, Newsreader/Hanken Grotesk/IBM Plex Mono) est volontairement conservé — il n'utilisait pas Anton/Poppins. Les PDF (lib/pdf.ts) non touchés (périmètre paiement).
6. Glassmorphism recadré dans DESIGN.md : autorisé pour badges/pills posés sur un média + nav sticky, jamais en fond de section.

## Fichiers modifiés / créés
- public/fonts/Outfit-Variable.woff2 [NEW]
- app/layout.tsx, app/globals.css, DESIGN.md [MODIFY] (fondations + doc)
- app/prototype-styles.css, components/home/v2/* (FrameRoomEntry, SceneSelector, CrewStack, ProcessSection, TestimonialsSlider, LastFrame), components/home/HomeContent.tsx, components/layout/Nav.tsx [MODIFY] (accueil)
- components/services/ServicesClient.tsx [MODIFY] (hub bento)
- app/galerie/projets.css, components/gallery/* (ProjetsClient, MediaCarousel, Lightbox, data.ts) [MODIFY] (galerie)
- app/{login,register,contact,equipe}/page.tsx + 6 pages SEO locales [MODIFY] (cohérence em/graisses)

## Reste à faire (handoff agents)
- `MonitorStage.tsx` n'est plus consommé (composant + CSS `df-monitor-*` laissés en place) — candidat au nettoyage.
- `app/services/[slug]` rend encore `df-lf-corners` (masqués en CSS) — à retirer du markup.
- Audit LCP post-déploiement (hero vidéo plein écran) + contrôle rich results du JSON-LD hub services.
- 3 tests `__tests__/pricing.test.ts` échouent AVANT et APRÈS la refonte (options abonnement voixOff non comptées, 147 vs 159) — bug préexistant hors périmètre design, à traiter séparément.

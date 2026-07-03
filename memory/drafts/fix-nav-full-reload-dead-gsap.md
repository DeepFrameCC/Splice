---
id: fix-nav-full-reload-dead-gsap
title: "Nav en <a> = full reload + GSAP orphelins après refonte Outfit"
summary: "Navigation perçue comme infinie en dev : les liens de Nav.tsx étaient des <a> natifs (full reload + recompile dev à chaque clic) et LandingAnimations ciblait 11 blocs de sélecteurs .df-* supprimés par la refonte. Liens convertis en <Link>, LandingAnimations réduit au bloc témoignages."
type: fix
coreprimary: fixes
importance: 0.6
status: draft
schemaversion: "3.5"
created: 2026-07-02
updated: 2026-07-02
links: []
---

# Nav en `<a>` = full reload + GSAP orphelins après refonte Outfit

## Problématique
Après la refonte Outfit (bc8b4a2), la navigation entre pages « tourne à l'infini » en dev
et le site semble « plus optimisé ». Console : dizaines de warnings
`GSAP target .df-hero-* not found` à chaque chargement.

## Cause racine
1. `components/layout/Nav.tsx` utilisait des `<a href>` natifs (depuis le commit initial)
   au lieu de `next/link` : chaque clic = rechargement complet de la page. En dev,
   cela déclenche la compilation à froid de la route (15-25 s) → impression de spin infini.
   En prod, cela annule le routeur client Next (pas de prefetch, re-téléchargement du bundle).
2. `components/home/LandingAnimations.tsx` créait 11 timelines/ScrollTriggers sur des
   sélecteurs `.df-hero`, `.df-vr`, `.df-about-grid`, `.df-stats`, `.df-service`,
   `.df-project`, `.df-plan`, `.df-quote-card`… tous supprimés par la refonte.
   Seuls `.df-testimonial` / `.df-testimonials-grid` existaient encore.

## Solution implémentée
1. `Nav.tsx` : les deux maps de `NAV_LINKS` (desktop + drawer mobile) rendent des `<Link>`.
2. `LandingAnimations.tsx` : réduit au seul bloc témoignages (+ fallback reduced-motion
   sur les mêmes sélecteurs, l'ancien fallback ciblait aussi des `.df-hero-*` morts).

## Notes annexes
- La vidéo hero (`FrameRoomEntry`) se met **volontairement** en pause si
  `prefers-reduced-motion: reduce` (Windows : Paramètres → Accessibilité → Effets
  d'animation désactivés). Comportement voulu, pas un bug.
- Tests `__tests__/pricing.test.ts` : 3 échecs pré-existants depuis 8b3fae1
  (tarifs Pro 4 vidéos/mo, Premium 6 vidéos/mo changés sans mise à jour des tests).

## Fichiers modifiés / créés
- components/layout/Nav.tsx [MODIFY]
- components/home/LandingAnimations.tsx [MODIFY]

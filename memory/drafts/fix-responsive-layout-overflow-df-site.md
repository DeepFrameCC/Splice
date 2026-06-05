---
id: fix-responsive-layout-overflow-df-site
title: "Correction de l'overflow horizontal sur les pages publiques via df-site"
summary: "Correction de l'overflow horizontal et du décalage de layout mobile provoqués par le composant hors-écran df-drawer. Enrobage systématique des pages publiques dans la classe .df-site."
type: fix
coreprimary: fixes
importance: 0.5
status: draft
schemaversion: "3.5"
created: 2026-06-05
updated: 2026-06-05
links: []
---

# Correction de l'overflow horizontal sur les pages publiques via df-site

## Contexte
Le tiroir de navigation mobile (`.df-drawer`) est positionné hors-écran via `transform: translateX(100%)`. Sur les navigateurs mobiles et tablettes, cet élément étirait la largeur du corps (`body`), provoquant un décalage de la mise en page vers la gauche (page coupée en deux) et un défilement horizontal indésirable.

## Solution
Nous avons appliqué la classe `.df-site` (`overflow-x: hidden; min-height: 100vh;`) de manière systématique comme conteneur parent sur les pages et structures utilisant le tiroir de navigation :
1. `app/blog/page.tsx`
2. `app/blog/[slug]/page.tsx`
3. `app/galerie/page.tsx`
4. `app/services/layout.tsx` (englobant toutes les pages de services)
5. `app/tarifs/page.tsx` (déjà corrigé précédemment)

De plus, la section de tarification (`components/tarifs/PricingSection.tsx`) a été optimisée pour le responsive (ajout de `grid-cols-1` par défaut sur mobile, ajustement de la taille des titres pour éviter le clipping, et réglage de la largeur minimale du tableau comparatif à `min-w-[640px]` avec `overflow-x-auto` pour préserver la lisibilité sans écrasement).

## Impact
- Fin de tout défilement horizontal parasite sur mobile et tablette.
- Les pages ne sont plus découpées en deux lors de l'ouverture ou du chargement de la navigation.
- Lisibilité accrue du tableau comparatif de tarifs.

---
id: mobile-footer-cutoff-fix
title: "Mobile Footer Cutoff Fix"
summary: "Correction de la troncature des liens du pied de page sur mobile en forçant l'empilement vertical à une seule colonne sous 600px."
type: fix
coreprimary: fixes
importance: 0.6
status: draft
schemaversion: "3.5"
created: 2026-06-08
updated: 2026-06-08
tags:
  - css
  - responsive
  - mobile-fix
  - footer
links: []
---

# Mobile Footer Cutoff Fix

## Problématique
Sur les écrans mobiles d'une largeur inférieure à `600px` (ou dans des conteneurs étroits), les colonnes du pied de page (`.df-footer-top`) étaient disposées en grille à deux colonnes (`repeat(2, 1fr)`). De plus, le sous-menu de navigation (`.df-footer-nav-grid`) était lui-même divisé en deux colonnes horizontales. 

Cela ne laissait que très peu de place par colonne (environ 150px de large totale pour le bloc Navigation), forçant les liens longs comme "Agence communication" et "Photo événementiel" à s'enrouler de manière très inesthétique ("Agenc", "comm") ou à déborder/être tronqués sur le bord droit de l'écran.

## Solution implémentée
1. **Empilement vertical de la structure globale** : Ajout d'une règle `@media (max-width: 600px)` sur `.df-footer-top` pour forcer l'affichage sur une seule colonne (`grid-template-columns: 1fr`) avec un espacement vertical de `36px`.
2. **Empilement vertical des liens de navigation** : Sur les mêmes résolutions mobiles, passage de la grille de liens `.df-footer-nav-grid` de `repeat(2, 1fr)` à une seule colonne verticale (`1fr`).
3. **Résultat** : Tous les liens de navigation s'affichent proprement les uns sous les autres, avec une marge confortable et aucun phénomène d'overflow horizontal ou de troncature de texte.

## Fichiers modifiés
- [prototype-styles.css](file:///c:/Users/Windows/Splice/app/prototype-styles.css) : Ajustement des media-queries `@media (max-width: 820px)` et ajout de `@media (max-width: 600px)`.

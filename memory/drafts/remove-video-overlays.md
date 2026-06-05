---
id: remove-video-overlays
title: "Retrait des overlays Timecode (TC) et Durée sur les vidéos"
summary: "Retrait des badges superposés de Timecode (pj-tc) et de Durée (pj-dur) sur les éléments vidéos de la galerie (MediaCarousel et Lightbox)."
type: fix
coreprimary: fixes
importance: 0.6
status: draft
schemaversion: "3.5"
created: 2026-06-05
updated: 2026-06-05
tags:
  - design
  - gallery
  - video
  - carousel
  - lightbox
links: []
---

# Retrait des overlays Timecode (TC) et Durée sur les vidéos

## Problème
Les vidéos de la galerie affichaient en surimpression un timecode à gauche (`TC 00:00:00:00`) et une durée à droite (`00:00`). Ces éléments d'overlay nuisaient à la lisibilité et n'étaient pas désirés sur l'interface publique finale.

## Solution appliquée
- Retrait des éléments d'overlay `<div className="pj-tc">` et `<div className="pj-dur">` dans [MediaCarousel.tsx](file:///c:/Users/Windows/Splice/components/gallery/MediaCarousel.tsx).
- Retrait des mêmes éléments dans la visionneuse [Lightbox.tsx](file:///c:/Users/Windows/Splice/components/gallery/Lightbox.tsx).

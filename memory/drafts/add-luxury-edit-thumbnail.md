---
id: add-luxury-edit-thumbnail
title: "Configuration de la miniature pour Luxury Edit"
summary: "Ajout de la miniature thumb_porsche_orléans.png pour le projet vidéo Luxury Edit dans seed-galerie.ts et mise à jour de la base de données."
type: fact
coreprimary: tech
importance: 0.5
status: draft
schemaversion: "3.5"
created: 2026-06-05
updated: 2026-06-05
tags:
  - database
  - seed
  - gallery
  - thumbnail
  - luxury-edit
links: []
---

# Configuration de la miniature pour Luxury Edit

## Description
La vidéo `Luxury Edit` ne possédait pas de miniature (`thumbnailFilename`) configurée dans le fichier de peuplement de la galerie, entraînant une absence d'image d'illustration.

## Changements appliqués
- Ajout de `thumbnailFilename: "thumb_porsche_orléans.png"` pour l'élément `Luxury Edit` dans [seed-galerie.ts](file:///c:/Users/Windows/Splice/prisma/seed-galerie.ts).
- Exécution du script de seed (`npm run seed:galerie`) pour mettre à jour l'entrée correspondante en base de données.

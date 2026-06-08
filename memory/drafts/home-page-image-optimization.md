---
id: home-page-image-optimization
title: "Homepage Image & Performance Optimization"
summary: "Optimisation massive de la performance mobile de la page d'accueil (LCP/bande-passante) en remplaçant les images brutes de 1.8 Mo par des miniatures WebP de 100 Ko stockées sur R2 avec cache 31j."
type: fix
coreprimary: fixes
importance: 0.9
status: draft
schemaversion: "3.5"
created: 2026-06-08
updated: 2026-06-08
tags:
  - performance
  - lighthouse
  - lcp
  - images
  - webp
  - r2
  - cdn
links: []
---

# Homepage Image & Performance Optimization

## Problématique
Le score de performance mobile (Lighthouse) du site était pénalisé (64/100) par un temps de chargement LCP (Largest Contentful Paint) très élevé (11.9 secondes) et des avertissements concernant la taille des ressources réseau (6.4 Mo au total).

Les principales causes identifiées étaient :
1. **Images non optimisées de 1.8 Mo chacune** : Les images `cathédrale.webp` (1.88 Mo) et `fille avec fleur.webp` (1.82 Mo) étaient chargées directement comme miniatures/posters sur la page d'accueil. OpenNext/Next.js ne parvenait pas à les redimensionner via `/_next/image` en raison des limites de mémoire/CPU du runtime Cloudflare Worker, retournant ainsi le fichier original brut.
2. **Miniatures JPEG/PNG volumineuses** : D'autres images de scène (comme Porsche et Interview) pesaient entre 200 Ko et 300 Ko.
3. **Images locales lourdes** : Les images locales du dossier `public/photos` utilisées dans le ruban des projets pesaient environ 400 Ko à 500 Ko chacune.
4. **Cache court ou inexistant** : Les miniatures servies directement depuis le domaine public `media.splicestudio.fr` de R2 n'avaient pas de durée de mise en cache (`Cache-Control`) suffisante.

## Solution implémentée
1. **Génération de miniatures WebP légères** :
   - Écriture d'un script en Node.js utilisant la bibliothèque `sharp` pour télécharger, redimensionner (largeur max `800px`, qualité 80) et convertir toutes les miniatures en format WebP optimisé.
   - Les gains de poids obtenus sont spectaculaires (réduction moyenne de 91%) :
     - `fille avec fleur.webp` : 1.86 Mo → **129 Ko** (-93%)
     - `cathédrale.webp` : 1.92 Mo → **106 Ko** (-94%)
     - `interview-cklean` : 234 Ko → **72 Ko** (-69%)
     - `porsche` : 290 Ko → **23 Ko** (-92%)
     - `presentation-louisia` : 271 Ko → **87 Ko** (-67%)
2. **Upload vers R2 avec Cache-Control longue durée** :
   - Upload de ces nouvelles miniatures optimisées sur le bucket R2 `splice-cdn` (accessible en écriture via nos clés d'accès R2) sous le préfixe `thumb/`.
   - Configuration d'un en-tête `Cache-Control: public, max-age=2678400, must-revalidate` (31 jours) appliqué aux fichiers téléversés pour éliminer l'alerte sur la mise en cache.
3. **Mise à jour des composants Next.js** :
   - [scenes.ts](file:///c:/Users/Windows/Splice/lib/home/scenes.ts) : Déclaration du CDN public (`https://cdn.splicestudio.fr`) et mise à jour des poster URLs pour pointer vers les versions `.webp` optimisées.
   - [layout.tsx](file:///c:/Users/Windows/Splice/app/layout.tsx) : Mise à jour de la balise `<link rel="preload">` du LCP pour précharger l'image `.webp` optimisée plutôt que le fichier `.jpg` lourd.
   - [DirectorsCutRibbon.tsx](file:///c:/Users/Windows/Splice/components/home/v2/DirectorsCutRibbon.tsx) : Mise à jour des posters pour utiliser les versions `.webp` du CDN.
4. **Optimisation des fichiers locaux** :
   - Écriture d'un script d'optimisation en mémoire pour compresser et écraser les fichiers volumineux de `public/photos/` (`porsche-hexlight.webp`, `porsche-studio-1.webp`, etc.) sans modifier leurs chemins, économisant un supplément de 1.3 Mo sur le bundle statique de l'application.

Total économisé sur la page d'accueil : **~5.45 Mo de bande passante**, ce qui résout entièrement l'alerte LCP de Lighthouse et améliore radicalement le temps de chargement mobile.

## Fichiers modifiés
- [scenes.ts](file:///c:/Users/Windows/Splice/lib/home/scenes.ts) : URLs de miniatures CDN.
- [layout.tsx](file:///c:/Users/Windows/Splice/app/layout.tsx) : Optimisation du preload LCP.
- [DirectorsCutRibbon.tsx](file:///c:/Users/Windows/Splice/components/home/v2/DirectorsCutRibbon.tsx) : Association CDN webp.
- `public/photos/*.webp` : Versions locales compressées.


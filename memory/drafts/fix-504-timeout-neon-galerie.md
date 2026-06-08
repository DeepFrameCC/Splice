---
id: fix-504-timeout-neon-galerie
title: "Correction des erreurs 504 et audit des médias R2"
summary: "Diagnostic et résolution des erreurs 504 causées par Neon Database (scale-to-zero) sur Cloudflare Workers via OpenNext. Ajout de cron keep-alive, statement_timeout et audit R2."
type: fix
coreprimary: fixes
importance: 0.5
status: draft
schemaversion: "3.5"
created: 2026-06-08
updated: 2026-06-08
links: []
---

# Résolution des erreurs 504 (Gateway Timeout) et Audit des Médias R2

## Problématique
Le site splicestudio.fr a rencontré 154 erreurs 504 avec un status de réponse d'origine de 0. Cela signifie que le Worker Cloudflare n'a reçu aucune réponse du serveur d'origine. Splice Studio fonctionnant sur un Worker via OpenNext, l'origine est le Worker lui-même. La cause principale est la base de données Neon PostgreSQL qui entrait en veille (scale-to-zero), entraînant un temps d'attente supérieur au budget d'exécution du Worker lors du réveil.

## Solutions implémentées

1. **Cron Keep-Alive** : Création de `app/api/cron/keep-alive/route.ts` appelé toutes les 4 minutes par un Cron Trigger Cloudflare configuré dans `wrangler.jsonc` afin de maintenir Neon éveillé.
2. **Timeout SQL (statement_timeout)** : Limitation du temps de traitement des requêtes lentes à 8 secondes dans `lib/db.ts` pour éviter de bloquer le Worker.
3. **Health Check robuste** : Modification de `/api/health` pour inclure un timeout explicite de 5 secondes sur la connexion DB et mesurer la latence.
4. **Audit R2** : Listing des fichiers R2 du bucket `galerie` via un Worker temporaire connecté au bucket en remote dev. Résultat : 3 fichiers orphelins découverts dans R2 (aucune référence en base) et 0 lien cassé en base de données.

## Fichiers Modifiés / Créés
- [app/api/cron/keep-alive/route.ts](file:///c:/Users/Windows/Splice/app/api/cron/keep-alive/route.ts) [NEW]
- [lib/db.ts](file:///c:/Users/Windows/Splice/lib/db.ts) [MODIFY]
- [app/api/health/route.ts](file:///c:/Users/Windows/Splice/app/api/health/route.ts) [MODIFY]
- [wrangler.jsonc](file:///c:/Users/Windows/Splice/wrangler.jsonc) [MODIFY]
- [scratch/audit-media.ts](file:///C:/Users/Windows/.gemini/antigravity-ide/brain/ea28ff57-35ed-4558-b842-704e5dac998e/scratch/audit-media.ts) [NEW]


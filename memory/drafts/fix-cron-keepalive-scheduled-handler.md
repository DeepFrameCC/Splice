---
id: fix-cron-keepalive-scheduled-handler
title: "Cron keep-alive Neon inopérant : handler scheduled() manquant dans le worker OpenNext"
summary: "Le Cron Trigger wrangler (toutes les 4 min) ne faisait rien car le worker généré par OpenNext n'exporte que fetch, pas scheduled(). Neon scale-to-zero non mitigé → 504 au réveil → crawl Google ralenti. Fix : patch post-build qui injecte scheduled() (ping Neon SELECT 1) dans .open-next/worker.js."
type: fix
coreprimary: fixes
importance: 0.7
status: draft
schemaversion: "3.5"
created: 2026-06-12
updated: 2026-06-12
links: [fix-504-timeout-neon-galerie]
---

# Cron keep-alive Neon inopérant : handler scheduled() manquant

## Problématique
GSC remonte 37 pages « Détectée, actuellement non indexée » (jamais explorées,
`Dernière exploration: 1970-01-01`), apparues le 2026-06-02 après le déploiement
du batch SEO local. Audit déclenché pour confirmer le risque 504 (piège connu
`fix-504-timeout-neon-galerie`) sur le crawl Googlebot.

Découverte : le cron keep-alive censé maintenir Neon éveillé **ne tourne pas**.
`wrangler.jsonc` déclare bien `"triggers": { "crons": ["*/4 * * * *"] }` et la
route `app/api/cron/keep-alive/route.ts` existe, mais rien ne les relie.

## Cause racine
Un Cloudflare Cron Trigger invoque le handler **`scheduled()`** exporté par le
Worker — il ne fait **pas** de requête HTTP vers une route Next. Or le worker
généré par `@opennextjs/cloudflare` (v1.19.11), `.open-next/worker.js`, n'exporte
que `{ async fetch }`. Aucun `scheduled()` → le cron se déclenche dans le vide →
la route `/api/cron/keep-alive` n'est jamais appelée → Neon scale-to-zero non
mitigé → 504 au cold start → Googlebot recule et laisse les pages non explorées.

(NB : les pages locales `services/[slug]/[ville]` sont 100% statiques — pas de DB.
Le 504 impacte surtout les routes dynamiques : service détail, blog, galerie.)

## Solution implémentée
Approche alignée sur l'idiome du repo (post-traitement de `.open-next` via scripts
patch). On garde `main: .open-next/worker.js` (pipeline OpenNext, patch wasm,
clean-assets intacts) et on **injecte** le handler manquant après le build.

1. `scripts/patch-opennext-cron.mjs` : prepend `import { neon }` + insère un
   `scheduled()` comme première propriété de `export default {`. Le handler fait
   un `SELECT 1` via le driver Neon HTTP (stateless, compatible Workers), sans
   dépendre de `CRON_SECRET`. Idempotent (skip si marqueur `[scheduled:keep-alive]`
   déjà présent).
2. Câblé dans `preview` / `deploy` / `deploy:hotfix` après `patch-opennext-wasm`.

Approche écartée : repointer `main` vers un wrapper `worker.ts` — non vérifiable
sans déploiement réel et risque de sortir du pipeline OpenNext (wasm/polyfills).

Vérifié localement : patch appliqué sur le `.open-next/worker.js` courant →
idempotence OK → `node --check` OK. **Reste à prouver en prod** : `npm run deploy`
puis confirmer l'exécution du cron dans les logs Workers (observability activée),
ligne `[scheduled:keep-alive] ok in <n>ms` toutes les 4 min. Prérequis :
`DATABASE_URL` présent dans l'env du Worker (déjà le cas en prod). Rollback :
retirer `&& node scripts/patch-opennext-cron.mjs` des scripts.

## Fichiers modifiés / créés
- scripts/patch-opennext-cron.mjs [NEW]
- package.json [MODIFY] — preview/deploy/deploy:hotfix chaînent le patch

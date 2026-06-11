---
id: task-blog-precision-pass
title: "Passe de précision éditoriale article par article (blog)"
summary: "Tâche en attente : améliorer la prose des 11 articles de blog (précision, stop-slop) sans dégrader le SEO. Em dashes et maillage déjà faits. Prompt prêt à coller + commandes / à utiliser."
type: feature
coreprimary: product
importance: 0.4
status: draft
schemaversion: "3.5"
created: 2026-06-11
updated: 2026-06-11
links: []
---

# Passe de précision éditoriale blog (à exécuter plus tard)

Tâche optionnelle en attente. Prompt autosuffisant ci-dessous, prêt à coller.

## Prompt

```
Passe de précision éditoriale article par article sur la prose du blog.

CONTEXTE
- Source de vérité : prisma/blog-content.ts (HTML par slug, 11 articles).
- Le contenu live vient de la DB Neon → les changements ne s'appliquent qu'après
  `npm run db:seed` (idempotent, branché sur .env). Ne PAS reseed sans mon "go".
- Déjà fait, NE PAS refaire : em dashes corrigés (0 restant), maillage interne
  (chaque article a déjà 1 lien service générique + 1 lien service-ville /orleans),
  auteur = Louisia. Ne touche pas aux liens ni aux balises <a>.

COMMANDES / À UTILISER (maximiser la performance)
- /ia-seo  → charger AVANT d'éditer : garder en tête les critères GEO/LLM SEO
  (réponses extractibles, phrases déclaratives, ancrage géo, citation-worthiness).
- /copy-editing  → moteur principal de la passe : revue + amélioration de copy
  existante (resserrer, clarifier, supprimer le flou) sans réécriture totale.
- /stop-slop  → passe finale OBLIGATOIRE sur chaque article édité : tuer les tells
  IA (béquilles, contrastes binaires, voix passive, em dashes, vague declaratives).
- (optionnel) /seo-audit  → si doute sur la préservation des mots-clés/structure Hn.
- Sous-agent : déléguer chaque article à `copywriting`/`copy-editing` n'est PAS requis
  (édition single-file) ; rester inline. Cap 3 agents si jamais parallélisation.

OBJECTIF
Améliorer la PRÉCISION et la qualité d'écriture, sans réécriture totale et sans
dégrader le SEO.

À TRAITER (par article, un commit atomique par article)
1. Tournures vagues / béquilles : « que vous soyez… » (≥3 occurrences),
   « au-delà de », « véritable », « il est important de », « n'est pas seulement…
   mais ». Remplacer par une formulation spécifique et active.
2. Voix passive → sujet humain actif quand c'est lourd.
3. Phrases creuses / quotables → reformuler en fait concret.
4. Rythme : casser les séries de phrases de même longueur.

RÈGLES DURES
- Français : aucun em dash (—). Virgules, deux-points, parenthèses.
- Ne JAMAIS inventer ni modifier un chiffre/stat/source (factuels, on les garde).
- Conserver structure Hn, mots-clés SEO, longueur globale (±10 %), tous les liens.
- Idiome existant du fichier (HTML inline, <strong>/<em>).

MÉTHODE
- Traiter les 11 articles un par un (ordre du fichier). Pour chacun : lire le bloc,
  montrer le diff, l'appliquer, commit `content(blog): precision <slug>`.
- À la fin : récap par article + demander le "go" pour `npm run db:seed`, puis
  push main pour relancer le build Cloudflare.

VÉRIF
- `npx tsc --noEmit` après édition ; grep de contrôle : 0 em dash, liens intacts,
  chiffres inchangés. Rapporter fidèlement.
```

## Fichiers concernés
- prisma/blog-content.ts [MODIFY]
- (application live) `npm run db:seed` puis `git push origin main`

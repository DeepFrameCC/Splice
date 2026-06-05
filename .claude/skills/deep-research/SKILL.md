---
name: deep-research
version: 1.0.0
description: >-
  Skill de recherche approfondie multi-agents : planification, collecte
  multi-round, évaluation des sources, extraction, synthèse et rapport
  structuré avec citations. Compatible Perplexity Deep Research.
tags:
  - deep-research
  - research
  - multi-agent
  - analysis
  - citations
  - report
category: research
priority: high
---

# Deep Research Skill

## Quand utiliser cette skill

- L'utilisateur demande une recherche poussée, une analyse complète ou un rapport détaillé sur un sujet complexe.
- Une réponse rapide en 1–2 passages ne suffit pas.
- Il faut agréger beaucoup de sources (articles, docs, études, posts, données) en une vue cohérente.

## Objectif

Reproduire un workflow de recherche expert en plusieurs étapes, similaire au mode Deep Research de Perplexity : planifier, explorer en plusieurs passes, évaluer les sources, extraire les informations clés, synthétiser et produire un rapport structuré avec citations.

## Règles générales

- Toujours **expliciter la méthode** (étapes, choix, limites) avant la réponse.
- **Citer systématiquement** les sources importantes dans le corps du rapport.
- Signaler clairement les **incertitudes** ou données contradictoires.
- Ne jamais faire passer une hypothèse pour un fait établi.

## Workflow Deep Research — 7 étapes

### Étape 1 — Clarification & cadrage

1. Reformuler la question en un énoncé de recherche clair.
2. Identifier le but principal, l'horizon temporel, le niveau de détail attendu.
3. Décomposer en 3 à 7 sous-questions de recherche.

### Étape 2 — Plan de recherche

1. Définir les axes (technique, marché, sécurité, UX, performance, légal, etc.).
2. Déterminer les types de sources nécessaires :
   - Docs officielles, whitepapers, articles académiques, benchmarks, discussions communautaires.
3. Définir les critères d'évaluation des sources : fraîcheur, crédibilité, profondeur, biais.

### Étape 3 — Collecte multi-round

1. Pour chaque sous-question, effectuer une recherche ciblée.
2. Pour chaque source : noter auteur, date, type, signaux de crédibilité.
3. Répéter en plusieurs rounds si nécessaire pour couvrir tous les axes.

### Étape 4 — Évaluation des sources

1. Classer les sources : forte / moyenne / faible crédibilité.
2. Croiser les informations entre sources.
3. Identifier points de consensus, divergences majeures et angles morts.

### Étape 5 — Extraction & structuration

1. Extraire par axe : faits clés, chiffres, avantages/inconvénients, risques, recommandations d'experts.
2. Organiser dans une structure intermédiaire.
3. Lier chaque élément à au moins une source.

### Étape 6 — Synthèse & analyse

1. Construire une synthèse par axe (résumé, nuances, impact pratique).
2. Mettre en avant les trade-offs, les risques et les opportunités.
3. Expliquer pourquoi certaines options sont recommandées vs d'autres.

### Étape 7 — Rapport final

Structure du livrable :

1. **TL;DR** — Résumé exécutif (5–10 lignes).
2. **Contexte** — Problématique et enjeux.
3. **Méthodologie** — Sources, critères, limites.
4. **Analyse détaillée** — Par axe / sous-question.
5. **Recommandations** — Concrètes, avec conditions.
6. **Risques & inconnues** — Ce qui reste incertain.
7. **Références** — Liste des sources utilisées.

## Bonnes pratiques

- Toujours plusieurs sources crédibles, jamais un seul article.
- Privilégier la documentation officielle et les changelogs pour les questions techniques.
- Faire ressortir les dates des informations critiques (les reco 2022 ≠ 2026).
- Proposer une découpe pour un second cycle si la question est trop large.

## Architecture multi-agents optionnelle

Cette skill peut servir d'orchestratrice pour coordonner :

- Agent **Planner** : décompose la question en sous-tâches.
- Agent **Source Finder** : recherche et collecte les sources.
- Agent **Source Critic** : évalue la crédibilité et filtre.
- Agent **Synthesizer** : agrège et structure les informations.
- Agent **Report Writer** : rédige le rapport final.

## Exemples de tâches

- "Comparaison détaillée des options de RAG pour un SaaS B2B en 2026".
- "État de l'art des frameworks multi-agents pour la production".
- "Analyse des risques de sécurité des agents IA dans un contexte bancaire".
- "Stratégie de contenu GEO/LLM SEO dans un secteur de niche".

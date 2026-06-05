---
name: ia-rag
version: 2.0.0
description: >-
  Skill dédiée aux systèmes RAG et à la recherche avancée :
  chunking sémantique, indexation hybride, reranking, caches
  sémantiques et gestion stricte du budget de contexte.
tags:
  - rag
  - retrieval
  - vector-search
  - chunking
  - reranking
  - pgvector
  - qdrant
category: retrieval
priority: high
---

# IA RAG Skill

## Quand utiliser cette skill

- L'utilisateur demande un RAG, un chat sur documents, une recherche dans une base de connaissances.
- Une solution purement prompt-based ne suffit plus (contexte > 50 pages, données dynamiques, mises à jour fréquentes).

## Objectif

Concevoir un RAG qui maximise la pertinence des résultats tout en respectant un budget de contexte strict et des contraintes de latence et de coût.

## Instructions opérationnelles

1. **Identifier la nature du corpus** (docs techniques, tickets, logs, code, articles, PDFs…).
2. **Définir la stratégie de chunking** :
   - Chunking structurel : sections Markdown, headers, AST, paragraphes logiques.
   - Chunking sémantique : découpage aux changements de concepts.
   - Jamais de chunking naïf par nombre de caractères fixe pour des corpus hétérogènes.
3. **Choisir le moteur de recherche** :
   - Hybride BM25 + vectoriel pour corpus textuels hétérogènes (recommandé en production).
   - Vectoriel seul uniquement si les requêtes sont toujours sémantiques.
   - Full-text seul uniquement pour la recherche exacte de termes.
4. **Appliquer le reranking** sur top-k avant injection dans le contexte LLM :
   - Modèles : Cohere Rerank, BGE, Jina Reranker.
   - Top-k suggéré : 20 → rerank → injecter les 5–8 meilleurs.
5. **Inclure les métadonnées de provenance** dans chaque chunk : source, offset, date, auteur.
6. **Budgéter le nombre de chunks injectés** selon la fenêtre de contexte disponible.

## Bases vectorielles — Référence rapide

| Base | Force | Usage |
|---|---|---|
| pgvector (PostgreSQL) | Simplicité, SQL natif | Projets full-stack PostgreSQL |
| Qdrant | Haute perf, filtres avancés | RAG production à grande échelle |
| Pinecone | Managé, scalable | Démarrage rapide sans infra |
| Weaviate | Hybride natif, GraphQL | Corpus multi-types |

## Métriques de qualité RAG

- **Recall@k** : proportion de chunks pertinents dans les top-k résultats.
- **Precision@k** : proportion de chunks retournés réellement utiles.
- **MRR** (Mean Reciprocal Rank) : position moyenne du premier chunk pertinent.
- **Context utilization** : pourcentage du contexte injecté réellement utilisé par le LLM.
- **Hallucination rate** : fréquence des réponses non étayées par les chunks fournis.

## Ressources associées

- `docs/RAG-DESIGN.md` — Design détaillé des systèmes RAG.
- `docs/RAG-QUALITY.md` — Métriques, ablations et évaluations.

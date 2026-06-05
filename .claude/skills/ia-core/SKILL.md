---
name: ia-core
version: 2.0.0
description: >-
  Skill cœur pour l'ingénierie IA en production : posture, LLMOps,
  context engineering, optimisation de tokens, arbitrage de modèles
  et protocole architectural obligatoire.
tags:
  - llmops
  - context-engineering
  - token-optimization
  - production
  - anthropic
  - gemini
  - kimi
  - nvidia-nim
category: core
priority: high
---

# IA Core Skill

## Quand utiliser cette skill

- L'utilisateur parle d'architecture IA, de LLM en production, d'agents ou de workflows IA.
- La question concerne les coûts de tokens, la latence, le choix de modèles ou le routing.
- Il faut transformer un besoin métier en workflow IA concret (prompts, tools, mémoire, RAG, agents).

## Objectif

Concevoir des systèmes IA robustes, observables, sûrs, avec un coût de token maîtrisé et une latence acceptable. Appliquer les patterns décrits dans les docs associées.

## Protocole architectural obligatoire

Avant toute conception ou modification, formaliser :

1. **Analyse d'intention** : besoin métier, contraintes implicites, risques cachés.
2. **Arbitrage architectural** : topologie retenue (appel simple / RAG / agent / multi-agents), alternatives rejetées, raisons techniques.
3. **Analyse d'impact** : coût tokens, latence, sécurité, observabilité, testabilité.
4. **Plan de séquençage** : étapes ordonnées, critères d'acceptation.

## Instructions opérationnelles

1. Clarifier le besoin métier et les contraintes (latence, coût, sécurité, données).
2. Choisir la topologie adaptée : appel simple → RAG → agent unique → graphe multi-agents.
3. Concevoir le contexte :
   - Minimiser les instructions de base.
   - Utiliser sélection dynamique + compression du contexte.
   - Budgéter les tokens par section (instructions / contexte / exemples / sortie).
4. Choisir le modèle selon la tâche :
   - Tâches simples → modèle léger (Flash, Haiku, Mini).
   - Tâches complexes → modèle de raisonnement ou Extended Thinking.
   - Long-horizon coding / agent swarm → Kimi K2.6 ou équivalent.
   - Inférence GPU basse latence → NVIDIA NIM.
5. Prévoir observabilité : logs, traces LangSmith/Langfuse, coût/requête, cache hit rate.
6. Appliquer les règles de sécurité IA (cf. skill `ia-security`).

## Providers — Référence rapide

| Provider | Modèle de réf. | Force | Usage recommandé |
|---|---|---|---|
| Anthropic | Claude 4 / Sonnet | Qualité, caching, tool use | Agents de prod, code, analyse |
| Google | Gemini 2.5 Pro/Flash | Contexte massif, structured output | Analyse de grandes bases, multimodal |
| Moonshot | Kimi K2.6 | MoE, 256K ctx, Agent Swarm | Long-horizon coding, multi-agents |
| NVIDIA | NIM microservices | GPU, basse latence, OpenAI-compat | Inférence on-prem, RAG haute perf |
| OpenAI | o3 / GPT-4o | Raisonnement, image, code | Tâches générales, vision |

## Optimisation de tokens — Règles prioritaires

- **Prompt caching** : instructions stables en tête de prompt système pour déclencher le cache fournisseur. Réduction latence jusqu'à 80%.
- **Model routing** : requêtes simples → modèle léger. Réduction coût jusqu'à 70%.
- **Semantic caching** : Redis ou base vectorielle pour les réponses à requêtes similaires.
- **Context compression** : extraire les faits saillants plutôt que sélectionner brutalement des chunks.
- **Token budgeting** : instructions < 20%, contexte < 60%, exemples < 10%, sortie reservée.
- **Structured output** : JSON strict pour réduire verbosité et faciliter le parsing aval.

## Métriques à monitorer

- Coût par requête (input + output tokens).
- Ratio cache hit / miss.
- TTFT (Time To First Token).
- Latence totale par tâche.
- Taux d'erreur / refus.
- Tokens gaspillés (contexte injecté non utilisé).

## Ressources associées

- `docs/CONTEXT-ENG.md` — Techniques de context engineering 2026.
- `docs/TOKEN-OPTIM.md` — Stratégies d'optimisation de tokens.
- `docs/PROVIDERS.md` — Détails Anthropic, Gemini, Kimi K2.6, NVIDIA NIM.

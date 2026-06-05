---
name: ia-cursor
version: 2.0.0
description: >-
  Skill pour intégrer ce pack de skills IA avec Cursor, .cursorrules
  et les workflows de développement assistés par IA en 2026.
tags:
  - cursor
  - cursorrules
  - mdc
  - context-engineering
  - dev-environment
category: tooling
priority: medium
---

# IA Cursor Skill

## Quand utiliser cette skill

- L'utilisateur travaille dans Cursor et souhaite aligner ce pack de skills avec ses règles Cursor.
- Il faut concevoir ou mettre à jour des `.cursorrules` / fichiers `.mdc` pour un projet.

## Objectif

Garantir la cohérence entre les skills IA de ce pack et les règles de comportement Cursor du projet, sans duplication.

## Différence Skills vs Rules

| | Skills (SKILL.md) | Rules (.cursorrules / .mdc) |
|---|---|---|
| Rôle | Capacités réutilisables déclenchées dynamiquement | Contraintes projet toujours actives |
| Portée | Multi-projets, multi-agents | Projet unique |
| Contenu | Workflows, protocoles, procédures | Conventions de code, patterns interdits, style |
| Format | Frontmatter YAML + Markdown | Markdown (rules) ou MDC (composant) |

## Structure recommandée pour les .cursorrules

```
.cursor/
  rules/
    base.mdc         # Stack, conventions, structure de dossiers
    frontend.mdc     # React, Next.js, Tailwind, composants
    backend.mdc      # API, DB, ORM, validation
    security.mdc     # Patterns de sécurité obligatoires
    tests.mdc        # Stratégie de test, couverture
    ia.mdc           # Règles spécifiques à l'usage de l'IA dans le projet
```

## Instructions opérationnelles

1. Créer un fichier `.cursor/rules/ia.mdc` dans le projet qui pointe vers ce pack de skills.
2. Dans les rules, ne pas redéfinir ce qui est déjà dans les SKILL.md — référencer uniquement.
3. Utiliser les skills `ia-core`, `ia-rag`, `ia-security` et `ia-seo` pour les tâches complexes.
4. Dans les rules, documenter :
   - les patterns de code interdits dans ce projet,
   - la structure de dossiers attendue,
   - les conventions de nommage.
5. Versionner les rules avec le code source du projet.

## Ressources associées

- `docs/CURSOR-RULES-2026.md` — Bonnes pratiques .cursorrules 2026.

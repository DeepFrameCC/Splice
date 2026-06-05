---
name: ia-seo
version: 2.0.0
description: >-
  Skill pour la structuration de contenu optimisée pour le SEO classique,
  le GEO (Generative Engine Optimization) et le LLM SEO : être cité
  dans les réponses générées par les IA.
tags:
  - seo
  - geo
  - llm-seo
  - ai-overviews
  - structured-data
  - content
category: content
priority: medium
---

# IA SEO Skill

## Quand utiliser cette skill

- L'utilisateur veut que son contenu soit visible dans les moteurs de recherche ET dans les réponses IA (AI Overviews Google, Perplexity, ChatGPT Search, Bing Copilot).
- Il faut structurer ou auditer une page, un article ou un site pour la visibilité organique et IA.

## Objectif

Produire du contenu structuré qui : (1) se positionne bien en SEO classique, (2) est facilement exploitable par les LLM pour être cité dans leurs réponses.

## Instructions opérationnelles

### SEO Classique 2026

1. Core Web Vitals non négociables : INP < 200ms, LCP < 2.5s, CLS = 0.
2. Structure hiérarchique stricte : H1 unique → H2 thématiques → H3 de détail.
3. Structured data JSON-LD selon le contexte : Article, FAQ, Product, Organization, BreadcrumbList.
4. Mobile-first absolu.
5. Indexation maîtrisée : robots.txt, sitemap.xml, canonical, hreflang.
6. Contenu exhaustif sur les entités clés du domaine.

### GEO — Generative Engine Optimization

1. Formuler chaque réponse clé en **une phrase courte, précise et autonome** (citable sans contexte).
2. Inclure des données chiffrées, des dates et des sources vérifiables dans les passages clés.
3. Privilégier les formats facilement extractibles : tableaux, listes, définitions, Q&A.
4. Éviter l'ambiguïté, le contenu flou et les formulations passives qui résistent à la synthèse IA.
5. Structurer les pages autour de questions réelles ("Comment...", "Pourquoi...", "Qu'est-ce que...").

### LLM SEO — Être cité par les IA

1. Viser les requêtes informationnelles avec des réponses directes en début de page.
2. S'assurer que le contenu est accessible sans JS bloquant (les crawlers IA préfèrent le HTML statique).
3. Bâtir une autorité thématique : couvrir en profondeur toutes les entités liées au domaine.
4. Utiliser Markdown bien structuré ou HTML sémantique — les deux sont bien extraits par les crawlers IA.
5. Éviter la sur-optimisation : les LLM préfèrent la clarté à la répétition de mots-clés.

## Checklist rapide

- [ ] H1 unique et explicite
- [ ] Réponse directe dans les 100 premiers mots
- [ ] JSON-LD adapté au type de contenu
- [ ] Données chiffrées et sources citées
- [ ] Mobile et performance OK (Lighthouse ≥ 90)
- [ ] Pas de JS bloquant pour le contenu principal
- [ ] Maillage interne vers les pages d'autorité du domaine

## Ressources associées

- `docs/GEO-PATTERNS.md` — Patterns GEO / LLM SEO détaillés.
- `docs/SEO-CHECKLIST.md` — Checklist SEO 2026 complète.

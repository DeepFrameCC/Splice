---
id: fix-pagination-blog-search
title: "Fix — Blog pagination navigation reset by search bar debouncer"
summary: "Correction du bug de pagination du blog : le debounce de la barre de recherche écrasait le paramètre de page lors du changement de searchParams. Ajout d'une condition pour comparer la valeur du champ avec l'URL."
type: fix
coreprimary: fixes
importance: 0.5
status: draft
schemaversion: "3.5"
created: 2026-06-06
updated: 2026-06-06
links: []
---

# Correction de la pagination du blog

## Problème
Lors de la navigation vers la deuxième page du blog via le composant de pagination (`/blog?page=2`), l'URL était immédiatement redirigée vers `/blog` après 400ms. Cela empêchait d'accéder aux pages suivantes.
La cause était le `useEffect` de débouclage (debounce) dans `BlogSearchBar.tsx` qui se déclenchait à chaque changement de `searchParams` (puisque `searchParams` faisait partie de ses dépendances). Comme le champ textuel de recherche était vide, le débouclage recréait les paramètres de l'URL sans le paramètre `page` et effectuait un `router.push`.

## Solution
1. **Ajout d'une synchronisation de l'état local avec l'URL** :
   Un premier `useEffect` met à jour la valeur de l'input local `query` dès que le paramètre `q` change dans l'URL.
2. **Filtrage dans le `useEffect` de débouclage** :
   Le `useEffect` de débouclage compare la valeur actuelle de `query` avec le paramètre `q` de l'URL (`currentQ`). S'ils sont identiques, le traitement est interrompu immédiatement (`return`). Cela évite de déclencher un `router.push` non désiré lorsque d'autres paramètres (comme `page`) changent dans l'URL.

## Fichiers modifiés
- [BlogSearchBar.tsx](file:///c:/Users/Windows/Splice/components/blog/BlogSearchBar.tsx) : Réécriture des hooks `useEffect` pour gérer correctement la synchronisation et le debounce.


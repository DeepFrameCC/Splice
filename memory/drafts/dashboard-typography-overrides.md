---
id: dashboard-typography-overrides
title: "Overriding display font in dashboards for readability"
summary: "Centralized font family override in Next.js layouts using CSS variables to swap display font with Poppins inside user and admin dashboards for improved readability."
type: decision
coreprimary: design
importance: 0.5
status: draft
schemaversion: "3.5"
created: 2026-06-10
updated: 2026-06-10
links: []
---

# Overriding display font in dashboards for readability

## Context
The application uses a bold, condensed display font (Anton) for headlines (`font-display`). However, in user (`/profil`) and admin (`/admin`) dashboards, this bold font reduced text readability significantly, especially for small numbers, stats, settings, and tables.

## Solution
Instead of removing or replacing all `font-display` utility classes from pages and components, we used CSS variable inheritance:
1. Added `.dashboard-root` to the main wrapper in `app/profil/layout.tsx`.
2. Added `.admin-root` to the main wrapper in `app/admin/layout.tsx`.
3. Overrode the `--font-display` CSS custom property within those root elements in `app/globals.css` to map to `var(--font-sans)` (which is Poppins).

This successfully changes all display headings inside the client and admin dashboards to Poppins Bold, resolving the readability issue while preserving the branding (Anton) on the public marketing site.

## Files Affected
- `app/globals.css`
- `app/profil/layout.tsx`
- `app/admin/layout.tsx`

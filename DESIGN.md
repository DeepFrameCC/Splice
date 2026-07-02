# DESIGN.md — Splice Studio Cinéma Studio

> Source de vérité pour `impeccable` et les sub-agents design. Référence concrète des tokens, typographies, motion et composants. Compatible avec les laws `impeccable` (OKLCH, jamais `#000`/`#fff`, hiérarchie ≥1.25, etc.).

## Color strategy

**Niveau commitment :** **Committed** — `#0E0E22` (bg-night) couvre 60-70% des surfaces. C'est l'identité, pas un fond neutre. Orange `#F36B1F` est l'accent ≤10% (CTA, em, eyebrows).

**Theme :** Dark natif (pas de toggle). Scene sentence : *"Un dirigeant PME consulte le site sur son MacBook depuis son bureau lumineux, mais le site assume un dark cinéma — comme regarder un teaser pro plein écran."*

## Palette

Tous les neutrals sont **tintés vers l'orange brûlé** (chroma 0.005-0.015). Jamais `#000` ni `#fff` purs.

### Background

| Token | HEX | OKLCH approx | Usage |
|-------|-----|--------------|-------|
| `--bg-night` | `#0E0E22` | `oklch(13.7% 0.029 277)` | Fond principal de toutes les pages |
| `--bg-deep` | `#0A0A1C` | `oklch(11.2% 0.031 280)` | Sections services, contraste sur night |
| `--surface-glauque` | `#2E4239` | `oklch(33% 0.038 165)` | Cartes services, hero frame |
| `--surface-glauque-mid` | `#6B8779` | `oklch(57.5% 0.044 162)` | Hero frame inner, verso |

### Texte

| Token | HEX | Usage |
|-------|-----|-------|
| `#FFFFFF` *(évité pur)* | — | *NE PAS UTILISER* — préférer `#F4F4F5` ou `--glauque-300` |
| `--glauque-300` | `#C4D2C5` | Texte description sur surface glauque |
| `--glauque-500` | `#9DB5A6` | Bordures, compteurs, méta |
| `rgba(255,255,255,.7)` | — | Body text sur night (équivalent tinté) |
| `rgba(255,255,255,.4)` | — | Captions, secondaire |

### Accent

| Token | HEX | OKLCH | Usage |
|-------|-----|-------|-------|
| `--df-accent` / `--brand-orange` / `df-gold` | `#F36B1F` | `oklch(67% 0.18 47)` | CTA primary, em, eyebrows, badges |
| Orange dark hover | `#C4550A` | `oklch(55% 0.16 47)` | CTA hover state |
| Orange soft | `#F9A06A` | `oklch(75% 0.14 47)` | Disabled CTA, ghosts |

### Legacy (en transition, ne pas utiliser en nouveaux composants)

`#1901AD` (df-blue) — couleur signature historique, conservée dans certains imports anciens (`df-blue` dans tailwind.config maps to orange désormais, le bleu n'est plus utilisé visuellement).

## Typography

**Une seule famille : Outfit** (Google Fonts OFL, fonte **variable 100-900**, locale dans `public/fonts/Outfit-Variable.woff2`, chargée via `next/font/local` pour `--font-display` ET `--font-sans`). Anton et Poppins sont retirés. La hiérarchie se fait par **graisse, casse et letter-spacing**, plus par famille.

`globals.css` définit `.font-display { font-weight: 800 }` par défaut (couche components — un utilitaire `font-*` explicite garde la priorité) : Outfit 400 est maigre là où Anton 400 était visuellement lourd.

**Pas de mono** — Outfit en `font-feature-settings: "tnum"` couvre les timecodes / chiffres tabulaires. (Exception : le thème éditorial des articles de blog, qui garde Newsreader/Hanken Grotesk/IBM Plex Mono.)

### Hierarchy (ratio ≥1.25)

| Niveau | Size | Weight | Tracking | Transform |
|--------|------|--------|----------|-----------|
| Hero h1 | `clamp(44px, 9vw, 110px)` — 92-110px desktop | 900 | `-0.03em`, line-height 0.95 | `uppercase` |
| h2 section | `46-52px` | 800 | `-0.025em` | `uppercase` |
| Titres de cartes | `19-21px` | 700-800 | `-0.01em` | `uppercase` (contexte) |
| Body | `13.5-17px` | 400-500 | normal | none |
| Caption / méta | `13px` | 400-600 | normal | none |
| Eyebrow | `11.5-12px` | 700 | `0.16-0.2em` | `uppercase` |
| Button | `13-16px` | 700 | `-0.005em` | none |
| Chiffres / timecodes | — | 600-800 | — | `font-feature-settings: "tnum"` |

### Convention mot accentué (signature)

Le mot accentué d'un titre (`<em>` ou `<span>`) est simplement **orange `#F36B1F`, sans italique** (`font-style: normal`). L'ancienne convention italique Poppins 700 disparaît avec Poppins. À utiliser avec parcimonie : 1-2 accents par section maximum.

### Line length

Body text capé à `max-width: 46-65ch`. Titres à `text-wrap: balance`. Pas de paragraphes >3 lignes sans break visuel.

## Spacing & rhythm

Variées intentionnellement — **pas de padding uniforme**. Système hybride Tailwind + tokens `df-*`.

| Token | Valeur | Usage |
|-------|--------|-------|
| Section vertical | `clamp(64px, 8vw, 120px)` | Entre sections majeures |
| Section padding-x | `clamp(24px, 4vw, 80px)` | Marges horizontales |
| Card padding | `32px` | Cards services, plans |
| Tight gap | `12-16px` | Listes, badges |
| Wide gap | `40-56px` | Hero CTA cluster, grid services |

Container max-width : `1320px` (legacy) / `max-w-5xl` (1024px) / `max-w-6xl` (1152px) selon contexte.

## Radii

- `rounded-full` (999px) → boutons, badges, pills
- `rounded-2xl` (18px = `--df-radius`) → cards, surfaces glauque, hero frame
- `rounded-xl` (12px) → cards secondaires, list items
- `rounded-lg` (8px) → inputs, form controls
- `border-radius: 0` → **jamais sur les composants visibles** (sauf bandes plein écran)

## Borders & lines

- Bordures principales : `var(--df-line)` = `rgba(255,255,255,0.08)`
- Bordure accentuée : `rgba(243,107,31,0.25)` (df-gold/25)
- **JAMAIS** de border-left/right >1px en accent coloré (interdit par impeccable bans)
- Toujours border complète ou tinted background

## Elevation (shadows)

Très restreint — Splice Studio est dark, les shadows soft sur dark sont peu visibles.

- `--df-shadow-sm` : `0 1px 0 rgba(10,10,35,.04), 0 8px 24px -12px rgba(10,10,35,.10)`
- `--df-shadow-md` : `0 1px 0 rgba(10,10,35,.06), 0 24px 60px -28px rgba(10,10,35,.18)`
- CTA primary glow : `0 8px 22px -8px rgba(243,107,31,0.6)` (orange diffuse)
- **Glassmorphism cadré** : réservé aux badges/pills « glass » posés SUR un média (badge Orléans du hero, play button, compteur carrousel, durée, cartouche de carte au survol) et à la Nav sticky. Recette : `background: rgba(14,14,34,0.32-0.6)` + `backdrop-filter: blur(10-16px) saturate(150-160%)` + bordure `rgba(255,255,255,0.14-0.25)`. Jamais en fond de section ou de carte entière.

## Motion

**Toujours sur properties compositor :** `transform`, `opacity`, `clip-path`, `filter` (sparingly). **JAMAIS** sur `width`, `height`, `top`, `left`, `margin`, `padding`.

### Easings

- Default : `cubic-bezier(.22,.61,.36,1)` (ease-out-quart proche)
- Hero/dramatic : `cubic-bezier(.16,1,.3,1)` (ease-out-expo)
- Quick UI : `cubic-bezier(.4,0,.2,1)` (ease-out)
- **PAS de bounce, PAS d'elastic** (interdit par impeccable bans + ne sied pas à l'identité)

### Durations

- Micro (hover, focus) : `150-200ms`
- Standard (page transition, card lift) : `300-350ms`
- Cinematic (hero reveal, scroll-linked) : `600-900ms`
- GSAP timelines : variables, mais `useGSAP()` obligatoire (jamais `useEffect`)

### Reduced motion

`prefers-reduced-motion: reduce` toujours géré via `gsap.matchMedia()` ou `@media`. Fallback explicite ou animations désactivées — pas de no-op silencieux.

## Components

### Buttons

- **Primary :** `.df-btn-primary` — fond orange `#F36B1F`, texte `#1A1408`, rounded-full, padding `14-18px × 22-28px`, glow shadow. Hover : `translateY(-1px)`.
- **Ghost :** `.df-btn-ghost` — transparent, border `var(--df-line)`, texte clair. Hover : background `rgba(255,255,255,.04)`.
- **Outline :** `.df-btn-outline` — transparent, border orange. Hover : fill orange + texte sombre.
- **CTA libellé unique :** "Demander un devis" (jamais "Demandez votre devis").

### Cards

- Background `--bg-card` ou `--surface-glauque` selon contexte
- Border `1px solid var(--df-line)` toujours
- Hover : `translateY(-2px to -4px)` + shadow-md
- **JAMAIS de nested cards** (interdit par impeccable bans + signal AI slop)
- **JAMAIS de grilles identiques** — varier tailles, breaker rythme (bento approche)

### Forms

- Inputs `bg-white/[0.06]` + border `rgba(255,255,255,.12)` + radius `10px`
- Focus : border `--df-accent` + bg `rgba(255,255,255,.10)` (pas de ring blue par défaut)
- Labels eyebrow style (uppercase tracking-wide Poppins 700)
- Validation inline (pas en alerte modal)

### Nav

- Sticky top, `bg color-mix(in oklab, var(--bg-night) 88%, transparent)`
- Backdrop-blur 14px (exception au ban glassmorphism — purposeful pour ne pas masquer le hero)
- Border-bottom `var(--df-line)`
- Logo Outfit 900 « SPL{ICE orange} STUDIO », liens uppercase 12.5px 600, link CTA `df-btn-primary df-btn-sm`

### Showreel / VideoReel

- Aspect ratios variés (16/9, 4/3, 9/16) — pas de grilles uniformes
- Corners décoratifs (4 `<i>`) — signature frame cinéma
- TC overlay format `HH:MM:SS:FF` ou `MM:SS`
- Hover : video play (muted, loop)
- Mouseleave : reset à frame 0

## SEO/Accessibility constraints

- `<html lang="fr">` obligatoire
- Skip link `<a href="#main-content">`
- Tous les éléments interactifs ont focus visible
- Boutons icônes ont `aria-label`
- Images décoratives `alt=""`, contenu `alt` descriptif
- Contraste min 4.5:1 (Anton blanc sur `#0E0E22` ≈ 14:1 ✓)

## Files de référence

- `app/prototype-styles.css` — système tokens legacy + classes `df-*`
- `app/globals.css` — Tailwind base + tokens globaux
- `tailwind.config.ts` — tokens `df-*` namespace + `fontFamily.display/sans`
- `app/layout.tsx` — chargement next/font/local (Outfit variable, display + sans)
- `public/fonts/Outfit-Variable.woff2` — fonte unique du site (les woff2 Anton/Poppins restent en legacy)
- `components/home/HomeContent.tsx` — référence visuelle landing
- `components/layout/Nav.tsx` — nav pattern
- `components/devis/Wizard.tsx` — pattern formulaire multi-step

## Bans absolus (impeccable laws + Splice Studio)

1. `#000` / `#fff` purs — tint vers orange
2. `border-left` / `border-right` >1px coloré en accent
3. `background-clip: text` + gradient text
4. Glassmorphism par défaut (sauf Nav sticky)
5. Hero-metric template (gros chiffre + label, gradient accent)
6. Grilles de cards identiques (icon + heading + text répété)
7. Modal-first reflex
8. Em dashes `—` en copy française (utiliser `,` `:` `;` `.` `()`)
9. Italique sur les titres et les mots accentués — Outfit n'a pas d'italique ; l'accent est orange `font-style: normal`
10. Animations sur layout properties (width/height/top/left/margin/padding)
11. Bounce / elastic easings
12. `useEffect` pour animations GSAP (toujours `useGSAP()`)

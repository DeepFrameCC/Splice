# Splice — Direction artistique 03 · Cinéma Studio

> Brief à transmettre à un développeur / Claude Code pour implémenter la direction
> visuelle "Cinéma Studio" sur le site **Splice** (studio image & son) et sur
> la carte de présentation des services.

---

## 1. Concept directeur

**L'écho de la salle obscure, en plus chaud.**

Bleu nuit profond dominant, comme une salle de projection. Le **vert glauque
(sourd)** devient une surface secondaire qui réchauffe le noir sans entrer en
concurrence avec l'orange. Sérif léger pour les titres, monospace pour les
méta techniques (timecodes, libellés, codes services).

Cette direction est l'évolution naturelle du site actuel — elle conserve la
profondeur cinéma déjà installée, mais introduit une **troisième couleur de
respiration** qui adoucit le contraste brutal noir/orange et apporte une
sensation de matière (textile, mur de studio, gélatine de projecteur).

---

## 2. Palette · tokens

| Rôle              | Token CSS                | Hex       | OKLCH                |
|-------------------|--------------------------|-----------|----------------------|
| Fond nuit         | `--bg-night`             | `#0E0E22` | 14% 0.03 280         |
| Fond plus sombre  | `--bg-deep`              | `#0A0A1C` | 11% 0.03 280         |
| Surface 1 (cards) | `--surface-glauque`      | `#2E4239` | 30% 0.03 165         |
| Surface 2 (verso) | `--surface-glauque-mid`  | `#6B8779` | 56% 0.04 160         |
| Glauque clair     | `--glauque-300`          | `#C4D2C5` | 82% 0.025 155        |
| Glauque vif       | `--glauque-500`          | `#9DB5A6` | 73% 0.035 155        |
| Bleu signature    | `--brand-blue`           | `#1901AD` | 30% 0.27 275         |
| Orange spot       | `--brand-orange`         | `#F36B1F` | 67% 0.19 45          |
| Texte principal   | `--text`                 | `#FFFFFF` | —                    |
| Texte secondaire  | `--text-muted`           | `rgba(255,255,255,.55)` | — |
| Bordure faible    | `--line`                 | `rgba(255,255,255,.08)` | — |
| Bordure glauque   | `--line-glauque`         | `rgba(157,181,166,.18)` | — |

### Hiérarchie d'usage

- **Fond** : `--bg-night` partout, `--bg-deep` pour la section services
  (légère séparation de plan).
- **Surface** : les cartes services sont en `--surface-glauque` (vert nuit).
  Le verso de la carte de présentation est en `--surface-glauque-mid` (vert
  plus lumineux).
- **Spot** : orange uniquement pour CTA, REC, italiques d'emphase, numéros de
  service. Jamais en aplat de fond.
- **Bleu** : réservé au logo, à la signature, à un éventuel marquage de
  marque. Pas dans les composants courants.

---

## 3. Typographie

| Usage              | Famille              | Graisse / style        | Taille / suivi                    |
|--------------------|----------------------|------------------------|-----------------------------------|
| Titre hero (h1)    | Serif (ex. Fraunces) | 300, italique discret  | `clamp(44px, 6vw, 84px)`, ls -0.025em, lh 0.92 |
| Titre section (h2) | Serif                | 400                    | `clamp(28px, 3.4vw, 44px)`, ls -0.015em |
| Titre carte (h3)   | Serif                | 500                    | 20–24px, ls -0.01em               |
| Corps              | Sans (ex. Inter)     | 400                    | 15–17px, lh 1.55, couleur muted   |
| Eyebrow / méta     | Mono (JetBrains Mono)| 500                    | 11–12px, ls 0.18–0.22em, UPPERCASE|
| Tag / chip         | Mono                 | 600                    | 10–11px, ls 0.08em                |
| Timecode / REC     | Mono                 | 500                    | 11px, ls 0.08–0.14em              |

**Italique = accent orange.** Toujours. C'est la signature typographique : un
titre serif neutre avec un mot italique orange. Exemple :

> Films qui restent ***en tête.***

---

## 4. Layout — Site

### 4.1 Navigation (sticky)

- Hauteur ~64px, padding horizontal 40px
- Fond `color-mix(in oklab, var(--bg-night) 88%, transparent)` + `backdrop-filter: blur(14px) saturate(160%)`
- Bordure basse : `1px solid var(--line)`
- Logo à gauche en serif italique ou wordmark
- Liens centre/droite en sans 14px, opacité 0.78
- CTA "Devis →" : bouton pilule fond `--brand-orange`, texte `#1A1408`, padding 10px 18px, radius 999px

### 4.2 Hero

Grille 2 colonnes (1.1fr / 1fr), 60px de gap, padding 80px 40px.

**Colonne gauche (texte) :**
- Eyebrow mono : `— SHOWREEL · 2026`, couleur `--brand-orange`, précédé d'un trait 14px
- H1 serif léger : `Films qui restent en tête.` avec « en tête » en italique orange
- Sous-titre sans 18px, couleur muted, max 46ch
- Deux CTA : primaire orange "Voir le reel →" + ghost contour glauque "Nous écrire"

**Colonne droite (frame) :**
- Aspect-ratio 4/5
- Background : `linear-gradient(160deg, var(--surface-glauque-mid) 0%, var(--surface-glauque) 60%, var(--bg-night) 100%)`
- Badge "REC" en haut à gauche (mono 10px + pastille orange clignotante, animation 1.2s)
- Timecode "00:00:14:08" en bas à droite (mono, couleur blanche 85%)
- Border-radius 14px

### 4.3 Section Services

Fond `--bg-deep` (légèrement plus sombre que le hero pour marquer la séparation),
bordure haute en `--line`.

**Header de section :**
- À gauche : H2 serif `Ce qu'on fait, vraiment bien.` (avec « vraiment bien »
  en italique orange)
- À droite : compteur mono `4 services` couleur glauque

**Grille services** : 2 colonnes, gap 24px.

**Carte service (composant clé) :**
- Background : `--surface-glauque` (#2E4239)
- Bordure : `1px solid var(--line-glauque)`
- Border-radius 14px, padding 32px, min-height 280px
- Numéro mono `01` couleur orange, ls 0.16em, font-size 13px
- Titre serif 24px blanc
- Description sans 14px couleur `--glauque-300`
- Tags en bas : pilule contour orange (background: `rgba(243,107,31,.15)`,
  border: `1px solid rgba(243,107,31,.3)`, text: orange, padding 4px 10px, radius 999px)
- Hover : translateY(-4px), shadow `0 16px 40px rgba(0,0,0,.4)`

**Les 4 services à intégrer :**

1. **Pub réseaux sociaux** — Reels, TikTok, formats verticaux pensés pour la performance. Tags : `VERTICAL` `REELS` `TIKTOK`
2. **Shooting automobile** — Photo & vidéo voiture, en studio mobile ou décor. Tags : `ROLLING` `PHOTO`
3. **Intro animée** — 5 à 20 secondes sur mesure pour votre marque. Tags : `MOTION`
4. **Événementiel** — Aftermovie, multicam, captation live. Tags : `LIVE` `MULTICAM`

### 4.4 Autres sections (rappels)

- **Showreel** : bandeau plein, fond `--bg-night`, vignettes 16/9 avec
  corners glauque et timecodes orange.
- **Marquee/ticker** : fond `--surface-glauque-mid` (alternative au bleu
  saturé), texte blanc serif italique avec dots orange.
- **Témoignages** : grille de 3 cartes, fond `--surface-glauque`, guillemet
  géant orange en haut de chaque carte.
- **Pricing** : 3 plans, le central featured en `--surface-glauque-mid`
  (au lieu d'un bleu plein), pour rester dans la palette.
- **Footer** : `--bg-deep`, liens orange au hover, signature mono.

---

## 5. Carte de présentation des services

Format : **85 × 55 mm** (carte de visite standard européenne), recto/verso.

### 5.1 RECTO — "Le générique"

- **Fond** : `--bg-night` (#0E0E22)
- **Bordure imprimée** : 4 corners glauque (`--glauque-500`), traits de 1pt,
  longueur 14mm, placés à 8mm des bords — comme des repères de cadrage cinéma
- **Centre vertical** : signature en serif léger italique
  > Films *vivants.*

  (le mot italique en orange `--brand-orange`)
- **Haut gauche** : `Splice` (mono, ls 0.22em, glauque)
- **Haut droite** : `2026` (mono, glauque)
- **Bas gauche** : `Studio image & son`
- **Bas droite** : `FR · Lyon`

### 5.2 VERSO — "Les services"

- **Fond** : `--surface-glauque-mid` (#6B8779)
- **Haut** : `— SERVICES` en mono 8.5pt, ls 0.22em, blanc 70%
- **Centre** : liste en serif 22pt, ligne 1 :
  > Pub · Auto
  > Intro · ***Événementiel***

  (un mot par carte en italique orange — à varier selon le tirage / l'interlocuteur)
- **Bas** : coordonnées en mono 9pt blanc 85%
  - `contact@splice.studio`
  - `+33 6 — — · LYON`

### 5.3 Production

- Impression offset 350g, papier mat légèrement texturé
- Vernis sélectif optionnel sur les mots italiques orange (relief tactile)
- Tranche : tranche colorée orange ou glauque selon budget

---

## 6. Usage du vert glauque — règles

> Le glauque est une **surface secondaire**, jamais primaire. Il réchauffe le
> noir, sépare les plans, et offre un contraste doux au CTA orange.

✅ **À utiliser pour :**
- Background des cartes services
- Background du verso des cartes de visite / supports print
- Corners et liserés décoratifs
- Marquees / bandeaux ticker (alternative au bleu)
- Bordures faibles (`--line-glauque`)

❌ **À ne pas utiliser pour :**
- Background principal de page
- CTA / boutons d'action
- Texte principal
- Couleur de logo

---

## 7. Composants à livrer (checklist)

- [ ] `Nav` sticky avec backdrop-filter
- [ ] `Hero` 2 colonnes (texte + frame dégradé glauque)
- [ ] `Eyebrow` (mono + trait orange)
- [ ] `Btn` primary (orange) / ghost (contour glauque) / outline (blue)
- [ ] `ServiceCard` (surface glauque + titre serif + tags contour orange)
- [ ] `ProjectThumb` (grille bento, corners glauque, timecode orange)
- [ ] `Marquee` ticker (option glauque-mid)
- [ ] `Testimonial` (carte glauque + guillemet orange)
- [ ] `PricingPlan` standard + featured (en glauque-mid)
- [ ] `Footer` (fond deep, liens hover orange)
- [ ] `BusinessCard` recto + verso (composant print, page A4 4-up pour relecture)

---

## 8. Notes pour Claude Code

- Stack suggérée : **HTML + CSS** custom (ou Tailwind avec tokens exposés via
  `@theme`). Préférer les CSS custom properties pour les tokens couleur.
- Fonts à charger : **Fraunces** (300/400/500 + italics) + **Inter**
  (400/500/600) + **JetBrains Mono** (400/500/600). Via Google Fonts ou
  équivalent self-hosted.
- Animation à conserver : pulse du dot orange (clignote 1.2s ease-in-out
  infinite), animation de pulse du dot REC.
- Le mode **dark est natif** ici — pas de toggle clair/sombre à implémenter
  pour cette direction.
- Tous les contrastes texte/fond doivent passer **WCAG AA** (vérifier
  `--glauque-300` sur `--surface-glauque` qui est le combo le plus tendu).

---

*Fin du brief — Direction 03 · Cinéma Studio · Splice · 2026*

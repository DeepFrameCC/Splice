# Marketing psychology & insights — Splice Studio

> Principe : on exploite des biais réels, **honnêtement**. Pas de faux compteur,
> pas de fausse rareté, pas de dark pattern. La force de Splice = la transparence ;
> la trahir tuerait l'avantage.

## L'insight central (synthèse des phases)
Les leaders locaux (IOA, McFly) sont **opaques** : pas de prix, pas d'avis, ton
corporate froid. Donc le cerveau d'un prospect PME qui compare ressent du **risque**
et de l'**incertitude** chez eux. Toute la psychologie du site Splice doit réduire ce
risque : montrer les prix, les visages, les avis, le process. **On gagne en rassurant,
pas en gonflant.**

## Biais → où l'activer sur le site
| Biais | Levier concret (page) | État |
|---|---|---|
| **Preuve sociale** | Témoignages attribués au magasin (Pixel 404, CKCleanAuto45, Bistrot Croix Morin), logos partenaires (TrustSection), page `/avis`, vrais visages `/equipe` | ✅ en place — remonter `/avis` plus haut sur la home |
| **Autorité** | Vrai matériel (DaVinci, ZV-1), process en 4 étapes réel, schema `Person`, partenaire local Pixel 404 | ✅ |
| **Ancrage tarifaire** | Page `/tarifs` : afficher le palier le plus cher en premier ou marquer un palier « le plus populaire » | 🟡 à valider sur /tarifs |
| **Réciprocité** | Lead magnets gratuits (checklist, template brief) = on donne avant de demander | ✅ contenu prêt, opt-in à brancher |
| **Aversion au risque** | « Devis gratuit · sans engagement · réponse 24 h » répété aux points de décision | ✅ |
| **Proximité / in-group** | « Orléans · Tours », « on se déplace chez vous », même ville que Pixel 404 | ✅ |
| **Cognitive ease** | Copy stop-slop, CTA unique « Demander un devis », chargement rapide, sticky CTA mobile | ✅ (sticky ajouté sur la home) |
| **Engagement progressif** | Le template brief : petit engagement (remplir) → conversion plus probable | ✅ contenu prêt |
| **Rareté honnête** | Uniquement si vrai : « créneaux limités ce mois », « express 48 h ». **Jamais inventé.** | 🟡 seulement si réel |

## Quick wins psychologiques (priorité)
1. **Remonter la preuve sociale** : avis + logos avant la longue liste de services sur la home (les sceptiques cherchent la réassurance tôt).
2. **Ancrage /tarifs** : marquer le palier intermédiaire « le plus populaire » (effet de compromis : la majorité prend le milieu).
3. **Réciprocité** : exposer la checklist gratuite en bas d'article de blog et en footer.
4. **Chiffres honnêtes** : « 15 projets livrés », compteur galerie dynamique — vrais, donc crédibles. Ne jamais regonfler.

## /popups — recommandation (et l'arbitrage à valider)
Règles non négociables : **aucune popup sur mobile au chargement** (pénalité UX + Google), pas de discount inventé.

- **Exit-intent desktop** sur `/services/*` et `/blog/*` : proposer **le lead magnet gratuit** (« Avant de partir : la checklist des 10 points avant de tourner »), pas une remise. Réciprocité > pression.
- **Scroll-trigger 50% sur le blog** : encart inline discret vers la checklist, jamais un modal bloquant.
- **Bannière d'annonce** : seulement pour un vrai événement (lancement, créneau, partenariat Pixel 404).

**Arbitrage à trancher avant que je code les popups** : où vont les emails capturés ?
Options : audience Resend, ou une table `NewsletterSignup` en base + double opt-in.
Dis-moi laquelle et je branche l'opt-in + la popup exit-intent (desktop, honnête).

## Anti-patterns interdits (rappel)
Faux compteurs « 3 personnes regardent », fausses notes 5/5 sans avis réels, fausses
remises « -50% aujourd'hui », popups mobile au chargement, « 100% satisfaits » (déjà retiré).

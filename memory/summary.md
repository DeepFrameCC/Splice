# Résumé — Splice Studio
Dernière mise à jour : 2026-07-02
Stack : Next.js, TypeScript, Neon/PostgreSQL, Cloudflare Workers, Stripe
État : production
Dernière action : Refonte design des pages publiques (accueil, services, galerie) d'après les maquettes handoff + migration typographique Anton/Poppins → Outfit variable (voir drafts/feature-refonte-outfit-2026-07.md). Compilation, types et lint validés ; build complet non exécutable localement (secrets .dev.vars/.env absents de cette machine, la génération statique interroge la DB).
Prochaine action : vérifier visuellement la refonte (npm run dev ou preview) puis déployer ; nettoyer MonitorStage.tsx (plus consommé) et les df-lf-corners de app/services/[slug] ; corriger les 3 tests pricing préexistants qui échouent (options abonnement voixOff non comptées) ; faire relire le contrat PDF (lib/contrat-pdf.ts) par un professionnel du droit ; adhérer à un organisme de médiation puis remplir MEDIATEUR (app/mentions-legales/page.tsx)

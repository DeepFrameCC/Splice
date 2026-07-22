/**
 * Mode maintenance — passe à `false` pour rouvrir le site.
 * L'overlay floute tout le site public avec un message d'évolution.
 * Les routes /admin et /login restent accessibles (accès équipe).
 */
export const MAINTENANCE_MODE = true;

/** Préfixes de routes exemptés de l'overlay maintenance. */
export const MAINTENANCE_EXEMPT_PREFIXES = ["/admin", "/login"] as const;

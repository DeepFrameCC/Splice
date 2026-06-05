/**
 * Lightweight wrapper around Plausible's `window.plausible`.
 *
 * No-op when Plausible is not loaded (SSR, consent declined, or script blocked),
 * so callers never need to guard the call themselves and navigation is never blocked.
 *
 * @param event - Plausible custom event name (e.g. "CTA_Devis").
 * @param props - Optional flat string properties attached to the event.
 */
export const track = (event: string, props?: Record<string, string>): void => {
  if (typeof window === "undefined") return;

  // Plausible (privacy-first, déjà en place).
  if (typeof window.plausible === "function") {
    window.plausible(event, props ? { props } : undefined);
  }

  // Google Tag Manager / GA4. `dataLayer` n'existe que si GTM a été chargé,
  // c'est-à-dire après consentement analytics (cf. GoogleAnalytics). Le guard
  // `Array.isArray` rend donc le push automatiquement consent-gated.
  const dl = (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer;
  if (Array.isArray(dl)) {
    dl.push({ event, ...(props ?? {}) });
  }
};

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
  if (typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible(event, props ? { props } : undefined);
  }
};

interface Window {
  plausible: ((...args: unknown[]) => void) & { q?: unknown[]; init?: (opts?: Record<string, unknown>) => void; o?: Record<string, unknown> };
}

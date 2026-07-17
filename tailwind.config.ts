import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import tailwindTypography from "@tailwindcss/typography";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        df: {
          surface: "#1A1A2E",
          "surface-alt": "#15152A",
          blue: "#F36B1F",
          "blue-dark": "#C4550A",
          "blue-light": "#F9A06A",
          gold: "#F36B1F",
          "gold-soft": "#F9A06A",
          cream: "#0A0A1C",
          ink: "#0E0E22",
          night: "#0E0E22",
          glauque: "#2E4239",
          "glauque-mid": "#6B8779",
          "glauque-300": "#C4D2C5",
          "glauque-500": "#9DB5A6"
        },
        /* ── Design System "Swiss minimal" (Phase 1, additif) ──────────────
           Tokens SÉMANTIQUES adossés aux variables CSS de app/styles/tokens.css
           (source OKLCH). Aucune collision avec les df-* dark existants.
           Contrastes vérifiés WCAG AA — cf. commentaires tokens.css. */
        bg: "var(--color-bg)",                 /* page — blanc cassé chaud            */
        surface: {
          DEFAULT: "var(--color-surface)",     /* cards — blanc pur                   */
          2: "var(--color-surface-2)"          /* panneau creux / hover               */
        },
        ink: "var(--color-ink)",               /* texte principal (16.7:1 sur bg)     */
        muted: "var(--color-muted)",           /* texte secondaire (5.46:1, AA)       */
        line: {
          DEFAULT: "var(--color-line)",        /* hairline discrète                    */
          strong: "var(--color-line-strong)"   /* bordure visible (inputs)             */
        },
        brand: {
          DEFAULT: "var(--color-brand)",       /* accent/fill (texte INK dessus)      */
          hover: "var(--color-brand-hover)",   /* hover du fill                        */
          ink: "var(--color-brand-ink)",       /* TEXTE lien/petit sur clair (5.2:1)  */
          soft: "var(--color-brand-soft)"      /* tint de fond doux                    */
        },
        success: {
          DEFAULT: "var(--color-success)",
          ink: "var(--color-success-ink)"      /* texte (5.97:1, AA)                   */
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          ink: "var(--color-warning-ink)"      /* texte (5.49:1, AA)                   */
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          ink: "var(--color-danger-ink)"       /* texte (6.12:1, AA)                   */
        },
        ring: "var(--color-ring)"              /* focus ring (brand-ink, >3:1 non-txt)*/
      },
      /* Rayons Swiss namespacés (rounded-swiss-*) : n'écrasent pas rounded-sm/md/lg
         par défaut, utilisés par les pages dark. Échelle canonique = --radius-*. */
      borderRadius: {
        "swiss-sm": "var(--radius-sm)",
        "swiss-md": "var(--radius-md)",
        "swiss-lg": "var(--radius-lg)"
      },
      /* Ombres Swiss discrètes (shadow-swiss-*) : ne collisionnent pas avec les
         shadow-sm/md par défaut. */
      boxShadow: {
        "swiss-sm": "var(--shadow-sm)",
        "swiss-md": "var(--shadow-md)"
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "scale-pop": { "0%": { transform: "scale(1)" }, "100%": { transform: "scale(1.04)" } }
      },
      animation: {
        "fade-up": "fade-up .6s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "scale-pop": "scale-pop .25s ease-out forwards"
      }
    }
  },
  plugins: [tailwindAnimate, tailwindTypography]
} satisfies Config;

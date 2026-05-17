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
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
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

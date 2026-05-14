import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        df: {
          blue: "#1901AD",
          "blue-dark": "#0F0078",
          "blue-light": "#3B23E0",
          gold: "#FFBD59",
          "gold-soft": "#FFD89A",
          cream: "#FFF6E5",
          ink: "#0A0A23"
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
  plugins: [tailwindAnimate]
} satisfies Config;

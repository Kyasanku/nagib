import type { Config } from "tailwindcss";

// ── Light "paper studio" theme ──────────────────────────────
// Token NAMES are kept from the original build so components read cleanly:
//   ink   = the page surface (now light/paper tones)
//   ivory = type & foreground (now warm near-black)
//   gold  = the accent (now a bright tangerine — energetic, cute, modern)
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces (light)
        ink: {
          DEFAULT: "#f7f4ec", // base page
          800: "#ffffff", // cards / raised
          700: "#f1ede1", // subtle fill
          600: "#e8e2d2", // hover fill
          500: "#dbd4c1", // borders-strong
        },
        // Foreground / type (dark, warm)
        ivory: {
          DEFAULT: "#1c1a14",
          muted: "#615c50",
          dim: "#9a9484",
        },
        // Accent (bright tangerine)
        gold: {
          DEFAULT: "#f4531f",
          soft: "#db4517",
          deep: "#b8390f",
        },
        // A soft secondary for cute/techy touches
        mint: "#4fb8a4",
        sky: "#4a86e8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        cinematic: "0 24px 60px -24px rgba(28,26,20,0.22)",
        soft: "0 6px 24px -10px rgba(28,26,20,0.12)",
        glow: "0 14px 44px -12px rgba(244,83,31,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1) translate(0,0)" },
          "100%": { transform: "scale(1.1) translate(-1.5%, -1.5%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "ken-burns": "ken-burns 20s ease-out both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;

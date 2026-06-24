import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  important: true,
  theme: {
    fontFamily: {
      playfair: ["var(--font-playfair-display)", "serif"],
      inter: ["var(--font-inter)", "sans-serif"],
      nunito: ["var(--font-nunito)", "sans-serif"],
      sans: ["var(--font-inter)", "Inter", "Roboto", "sans-serif"],
    },
    dropShadow: {
      custom: "0px -4px 30px rgba(var(--primary),0.30)",
    },
    extend: {
      colors: {
        // RoomHub design system — Emerald / Teal theme
        brand: {
          DEFAULT: "#059669", // primary
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          400: "#34D399",
          500: "#10B981", // secondary
          600: "#059669",
          700: "#047857",
        },
        ink: {
          DEFAULT: "#1E293B", // headings
          soft: "#64748B",    // body text
          muted: "#94A3B8",
        },
        surface: {
          DEFAULT: "#FFFFFF", // card
          muted: "#F8FAFC",   // background
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      borderRadius: {
        xl2: "16px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.06)",
        card: "0 2px 8px rgba(16,24,40,0.06), 0 12px 28px rgba(16,24,40,0.06)",
        "card-hover": "0 8px 18px rgba(16,24,40,0.08), 0 20px 40px rgba(5,150,105,0.10)",
        focus: "0 0 0 3px rgba(5,150,105,0.18)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s cubic-bezier(0.4,0,0.2,1) both",
        "fade-in": "fade-in 0.3s ease both",
      },
    },
  },
  plugins: [],
}

export default config

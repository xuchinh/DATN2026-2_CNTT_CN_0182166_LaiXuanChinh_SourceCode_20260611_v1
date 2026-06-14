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
    },
    dropShadow: {
      custom: "0px -4px 30px rgba(var(--primary),0.30)",
    },
    extend: {},
  },
  plugins: [],
}

export default config

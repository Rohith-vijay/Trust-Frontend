/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
   extend: {
  colors: {
    // core brand colors extracted from logo
    primary: "#B07A3F",        // golden‑brown primary tone
    accent: "#F59E0B",         // warm orange accent
    warmBg: "#FFF8ED",         // soft cream background

    // legacy/utility names (kept for backward compatibility)
    trustBlue: "#1e3a5f",      // previously used deep blue
    warmCream: "#f9f6f0",      // earlier warm cream
    softGold: "#b37a3f",       // earlier muted gold
    logoBrown: "#8a5a2b",

    neutralLight: "#fafafa",
    transparentWhite: "rgba(255,255,255,0.85)",
    dark: "#1f2937",
    background: "#fafafa",
    "glass-bg": "rgba(255,255,255,0.75)",
  },
  backgroundImage: theme => ({
    'gold-radial':
      'radial-gradient(circle at center, ' + theme('colors.accent') + ' 0%, ' + theme('colors.transparentWhite') + ' 70%)',
    'logo-glow':
      'radial-gradient(circle at center, rgba(245,158,11,0.15) 0%, transparent 70%)',
  }),
  spacing: {
    '72': '18rem',
    '84': '21rem',
    '96': '24rem',
  },
  fontFamily: {
    heading: ["Poppins", "sans-serif"],
    body: ["Inter", "sans-serif"],
  },
},


  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

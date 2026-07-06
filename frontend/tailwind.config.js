/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stellar: {
          dark: '#0f172a',      // Slate 900
          card: '#1e293b',      // Slate 800
          border: '#334155',    // Slate 700
          text: '#f8fafc',      // Slate 50
          muted: '#94a3b8',     // Slate 400
          accent: '#38bdf8',    // Sky 400 (matches Stellar brand feel)
          success: '#10b981',   // Emerald 500
          warning: '#f59e0b',   // Amber 500
          error: '#ef4444',     // Red 500
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

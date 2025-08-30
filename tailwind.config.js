/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Inter',
          'Noto Sans',
          'Ubuntu',
          'Cantarell',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          royal: '#1a2a6c',
          gold: '#ffc857',
          ink: '#0b0f1a',
        },
        card: {
          dark: '#121929',
        },
        border: {
          dark: '#1f2a44',
        },
        royal: "#1E90FF",
        gold: "#FFD700",
        purple: "#8A2BE2",
        "bg-dark": "#080B12",
        "card-dark": "#0a0d14",
        "border-dark": "#1d2230",
      },
    },
  },
  plugins: [],
};
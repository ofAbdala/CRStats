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
        card: { dark: '#121929' },
        border: { dark: '#1f2a44' },
      },
    },
  },
  plugins: [],
};
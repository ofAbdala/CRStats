/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        royal: '#1E90FF',
        gold: '#FFD700',
        'bg-dark': '#080B12',
        'card-dark': '#0a0d14',
        'border-dark': '#1d2230'
      }
    }
  },
  plugins: []
};
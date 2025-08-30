// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif'
        ],
      },
      colors: {
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
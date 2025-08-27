/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Clash Royale theme colors
        'bg-primary': '#0a0e1a',
        'bg-secondary': '#1a1f2e',
        'bg-tertiary': '#252b3d',
        'card-dark': '#1e2332',
        'border': '#2d3748',
        'border-dark': '#1a202c',
        'text-primary': '#ffffff',
        'text-secondary': '#a0aec0',
        'text-muted': '#718096',
        'royal': '#1e90ff',
        'royal-light': '#4da6ff',
        'royal-dark': '#1873cc',
        'bg-dark': '#080B12',
        'gold': '#ffd700',
        'gold-light': '#ffed4e',
        'gold-dark': '#cc9900',
        'purple': '#8a2be2',
        'purple-light': '#a855f7',
        'purple-dark': '#6b21a8',
        'success': '#48bb78',
        'warning': '#ed8936',
        'error': '#f56565',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(30, 144, 255, 0.3)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-purple': '0 0 20px rgba(138, 43, 226, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
}
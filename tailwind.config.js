/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Clash Royale inspired colors
        royal: {
          DEFAULT: '#4A90E2',
          light: '#6BA3F0',
          dark: '#2E5A8A'
        },
        gold: {
          DEFAULT: '#F5C842',
          light: '#F7D666',
          dark: '#D4A017'
        },
        purple: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED'
        },
        // Deep.gg inspired dark theme
        'bg-primary': '#0F1419',
        'bg-secondary': '#1A1F2E',
        'bg-tertiary': '#252B3D',
        'surface': '#2A3441',
        'surface-hover': '#323A4A',
        'border': '#3A4553',
        'border-light': '#4A5568',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B8BCC8',
        'text-muted': '#8B92A5',
        // Status colors
        'success': '#10B981',
        'success-bg': '#064E3B',
        'danger': '#EF4444',
        'danger-bg': '#7F1D1D',
        'warning': '#F59E0B',
        'warning-bg': '#78350F'
      }
    }
  },
  plugins: []
};
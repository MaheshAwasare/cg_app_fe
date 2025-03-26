/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f2',
          100: '#c3ebe0',
          200: '#9fdecd',
          300: '#7bd2ba',
          400: '#57c5a7',
          500: '#33b894',
          600: '#1A9977',
          700: '#157a5f',
          800: '#105c47',
          900: '#0a3d2f',
        },
      },
    },
  },
  plugins: [],
};
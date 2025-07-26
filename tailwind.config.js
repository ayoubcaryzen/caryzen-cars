/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        status: {
          'pas-encore': '#e0f0ff',
          'en-cours': '#fff3e0',
          'termine': '#e0fbe0',
          'hors-cible': '#ffe0e0',
          'ne-pas-generer': '#f0f0f0'
        }
      }
    },
  },
  plugins: [],
}
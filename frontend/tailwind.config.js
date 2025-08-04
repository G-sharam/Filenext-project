/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',             // ← your index.html lives here
    './src/**/*.{js,jsx,ts,tsx}' // ← all your React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

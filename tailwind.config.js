/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require('@iconify/tailwind')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#7296e9',
        azul2: "#c5d5ff",
        azulProfundo: "#3333cf"
      },
      fontFamily: {
        'roboto-condensed': ['"Roboto Condensed Variable"', 'sans-serif'],
        'fira-sans': ['"Fira Sans"', 'sans-serif'],

      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    addDynamicIconSelectors()
  ],
};


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
        'primary': '#3B5E43',
        'primary-light': '#4A7454',
        'primary-dark': '#2C4733',
        'primary-bg': '#F5F7F5',
      },
      fontFamily: {
        sans: ['"Fira Sans Condensed"', 'sans-serif'],
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} 
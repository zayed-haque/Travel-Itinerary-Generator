/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          400: '#4fd1c5',
          500: '#38b2ac',
          600: '#319795',
          800: '#285e61',
          900: '#234e52',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}


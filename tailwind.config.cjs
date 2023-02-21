/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx, html}"],
  theme: {
    extend: {
      colors: {
        'gh': {
          'bg': '#21262d',
          'border': '#f0f6fc1a',
          'blue': '#58a6ff',
        }
      }
    },
  },
  plugins: [],
}

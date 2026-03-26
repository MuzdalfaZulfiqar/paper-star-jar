// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dusty-rose': '#e2b4bd',
        'sage': '#b5baaf',
        'parchment': '#f4f1ea',
        'charcoal': '#2c2c2c',
      },
      fontFamily: {
        // We'll use these in the CSS import next
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
const animate = require('tailwindcss-animate')
const base = require('../tailwind.config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  safelist: ['dark'],
  prefix: '',
  content: [
    './.vitepress/theme/**/*.{vue,js,ts,jsx,tsx}',
    './sidebar/*.md',
  ],
  theme: base.theme,
  plugins: [animate],
}

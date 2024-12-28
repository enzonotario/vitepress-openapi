const animate = require('tailwindcss-animate')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  safelist: ['dark'],
  prefix: '',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    ...(process.env.IS_DOCS
      ? [
          './docs/.vitepress/theme/**/*.{vue,js,ts,jsx,tsx}',
          './docs/sidebar/*.md',
        ]
      : []),
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        gray: colors.zinc,
        border: 'var(--vp-c-border)',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'var(--vp-c-bg)',
        foreground: 'var(--vp-c-text-1)',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'var(--vp-c-bg-alt)',
          foreground: 'var(--vp-c-text-2)',
        },
        accent: {
          DEFAULT: 'var(--vp-c-bg-alt)',
          foreground: 'var(--vp-c-text-1)',
        },
        popover: {
          DEFAULT: 'var(--vp-c-bg-elv)',
          foreground: 'var(--vp-c-text-2)',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
      },
    },
  },
  plugins: [animate],
}

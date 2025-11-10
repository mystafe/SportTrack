import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0ea5e9',
          dark: '#0284c7'
        }
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgb(0 0 0 / 0.06), 0 1px 3px 0 rgb(0 0 0 / 0.08)'
      }
    }
  },
  plugins: []
} satisfies Config;


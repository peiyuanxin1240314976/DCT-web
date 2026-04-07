import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--brand)',
        text: 'var(--text)',
        muted: 'var(--muted)'
      },
      boxShadow: {
        soft: 'var(--shadow)'
      }
    }
  }
} satisfies Config


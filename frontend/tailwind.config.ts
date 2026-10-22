import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060d1f',
          900: '#0a0f1e',
          800: '#0f172a',
          700: '#1e293b',
          600: '#273046',
          500: '#334155',
          400: '#475569',
        },
      },
      backgroundImage: {
        'gradient-card': 'linear-gradient(135deg, #1e293b 0%, #273046 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #0a0f1e 0%, #0f172a 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config

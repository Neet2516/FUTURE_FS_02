/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        newsprint: '#F9F9F7',
        foreground: '#111111',
        muted: '#E5E5E0',
        accent: '#CC0000',
        border: '#111111',
        neutral: {
          50: '#F9F9F7',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#111111',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lora"', 'Georgia', 'serif'],
        ui: ['"Inter"', 'system-ui', 'sans-serif'],
        data: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'headline-xl': ['6rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'headline-lg': ['4.5rem', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'headline-md': ['3rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'headline-sm': ['2rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'subhead': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px #111111',
        'hard-sm': '2px 2px 0px 0px #111111',
        'hard-lg': '6px 6px 0px 0px #111111',
        'hard-accent': '4px 4px 0px 0px #CC0000',
      },
      borderRadius: {
        'none': '0',
      },
      spacing: {
        'gutter': '1.5rem',
      },
    },
  },
  plugins: [],
}

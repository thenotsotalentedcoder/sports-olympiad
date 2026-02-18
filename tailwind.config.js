/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Gold accent — primary brand color
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Surface neutrals — warm stone
        surface: {
          0:   '#ffffff',
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", 'sans-serif'],
        sans:    ["'Source Sans 3'", 'system-ui', 'sans-serif'],
        mono:    ["'JetBrains Mono'", 'monospace'],
      },
      fontSize: {
        '2xs':        ['0.625rem',  { lineHeight: '1rem' }],
        'hero':       ['clamp(3.5rem,8vw,7rem)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-xl': ['clamp(2.5rem,5vw,4.5rem)', { lineHeight: '1.0' }],
        'display-lg': ['clamp(2rem,4vw,3.5rem)',   { lineHeight: '1.05' }],
      },
      letterSpacing: {
        'display': '-0.01em',
        'wide-xl': '0.15em',
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgb(0 0 0/0.06), 0 1px 2px -1px rgb(0 0 0/0.04)',
        'card-md': '0 4px 12px -2px rgb(0 0 0/0.08), 0 2px 6px -2px rgb(0 0 0/0.04)',
        'card-lg': '0 12px 32px -4px rgb(0 0 0/0.10), 0 4px 12px -4px rgb(0 0 0/0.06)',
        'card-xl': '0 24px 48px -8px rgb(0 0 0/0.12), 0 8px 20px -6px rgb(0 0 0/0.06)',
        'glow':    '0 0 0 3px rgb(217 119 6/0.20)',
        'glow-lg': '0 0 48px -4px rgb(217 119 6/0.35)',
        'gold':    '0 0 0 3px rgb(217 119 6/0.25)',
        'inner':   'inset 0 1px 0 0 rgb(255 255 255/0.5)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up':   'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':   'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'marquee':    'marquee 25s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                                to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.92)' },      to: { opacity: '1', transform: 'scale(1)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' },             '50%': { transform: 'translateY(-14px)' } },
        shimmer:   { from: { backgroundPosition: '-200% 0' },               to: { backgroundPosition: '200% 0' } },
        marquee:   { from: { transform: 'translateX(0)' },                  to: { transform: 'translateX(-50%)' } },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg,#0c0a09 0%,#1c1917 50%,#292524 100%)',
        'gradient-hero': 'linear-gradient(160deg,#0c0a09 0%,#1c1917 35%,#292524 70%,#44403c 100%)',
        'gradient-gold': 'linear-gradient(135deg,#b45309 0%,#d97706 50%,#f59e0b 100%)',
      },
    },
  },
  plugins: [],
};

import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-main)', 'sans-serif'],
        serif: ['Noto Serif SC', 'serif'],
      },
      colors: {
        'toon-yellow': 'var(--color-primary)',
        'toon-blue': 'var(--color-secondary)',
        'toon-red': 'var(--color-accent)',
        'toon-purple': 'var(--color-purple)',
        'toon-bg': 'var(--color-bg-page)',
        white: 'var(--color-bg-card)',
        black: 'var(--color-border)',
        'gray-900': 'var(--color-text)',
        'toon-ink': 'var(--color-text-on-brand)',
      },
      borderWidth: {
        2: 'calc(var(--border-width) * 0.5)',
        3: '3px',
        4: 'var(--border-width)',
      },
      borderRadius: {
        xl: 'var(--radius)',
        lg: 'calc(var(--radius) * 0.75)',
        '2xl': 'calc(var(--radius) * 1.5)',
        '3xl': 'calc(var(--radius) * 2)',
      },
      boxShadow: {
        toon: 'var(--shadow-normal)',
        'toon-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
        'toon-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'toon-hover': 'var(--shadow-hover)',
      },
      animation: {
        'pop-in': 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'slide-in-from-bottom-10': 'slideInFromBottom 0.3s ease-out',
        'slide-in-from-bottom-2': 'slideInFromBottom2 0.2s ease-out',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.95) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        slideInFromBottom: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInFromBottom2: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [typography],
};

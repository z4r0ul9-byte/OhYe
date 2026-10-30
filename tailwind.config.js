/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Aksen utama proyek: ungu/biru #5c5cff
        primary: {
          DEFAULT: '#5c5cff',
          50: '#eef0ff',
          100: '#e0e3ff',
          200: '#c6ccff',
          300: '#a3a8ff',
          400: '#8385ff',
          500: '#5c5cff',
          600: '#4a45e6',
          700: '#3c36c4',
          800: '#312d9e',
          900: '#2b297d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 220ms ease-out',
      },
    },
  },
  plugins: [],
}

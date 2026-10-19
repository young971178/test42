/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hud: ['sans-serif'],
      },
      keyframes: {
        'wander-0': { '0%, 100%': { transform: 'translate(0, 0)' }, '25%': { transform: 'translate(30px, 0)' }, '50%': { transform: 'translate(30px, -30px)' }, '75%': { transform: 'translate(0, -30px)' } },
        'wander-1': { '0%, 100%': { transform: 'translate(0, 0)' }, '25%': { transform: 'translate(-30px, 0)' }, '50%': { transform: 'translate(-30px, 30px)' }, '75%': { transform: 'translate(0, 30px)' } },
        'wander-2': { '0%, 100%': { transform: 'translate(0, 0)' }, '25%': { transform: 'translate(0, 30px)' }, '50%': { transform: 'translate(-30px, 30px)' }, '75%': { transform: 'translate(-30px, 0)' } },
        'wander-3': { '0%, 100%': { transform: 'translate(0, 0)' }, '25%': { transform: 'translate(0, -30px)' }, '50%': { transform: 'translate(30px, -30px)' }, '75%': { transform: 'translate(30px, 0)' } },
        'chibi-walk': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        'chibi-cheer': { '0%, 100%': { transform: 'translateY(0) scale(1.1)' }, '50%': { transform: 'translateY(-6px) scale(1.1)' } },
        'foot-l': { '0%, 100%': { transform: 'rotate(0deg)' }, '50%': { transform: 'rotate(-20deg)' } },
        'foot-r': { '0%, 100%': { transform: 'rotate(0deg)' }, '50%': { transform: 'rotate(20deg)' } },
      },
      animation: {
        'wander-0': 'wander-0 12s ease-in-out infinite',
        'wander-1': 'wander-1 14s ease-in-out infinite',
        'wander-2': 'wander-2 16s ease-in-out infinite',
        'wander-3': 'wander-3 13s ease-in-out infinite',
        'chibi-walk': 'chibi-walk 0.8s ease-in-out infinite',
        'chibi-cheer': 'chibi-cheer 0.6s ease-in-out infinite',
        'foot-l': 'foot-l 0.8s ease-in-out infinite',
        'foot-r': 'foot-r 0.8s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
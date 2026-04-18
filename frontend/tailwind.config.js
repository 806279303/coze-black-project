/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': {
          DEFAULT: '#050508',
          50: '#0a0a0f',
          100: '#0f0f16',
          200: '#14141d',
        },
        'accent': {
          cyan: '#00f5d4',
          purple: '#7b2cbf',
          pink: '#f72585',
        }
      },
      fontFamily: {
        'display': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 245, 212, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 245, 212, 0.2)' },
        }
      },
    },
  },
  plugins: [],
}

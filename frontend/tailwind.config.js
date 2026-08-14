/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Signal's signature blue
        signal: {
          blue: '#3a76f0',
          DEFAULT: '#3a76f0',
        },
        // Chat background colors
        chat: {
          bg: '#eef0f2', // Light grayish blue for chat background
          incoming: '#ffffff',
          outgoing: '#e7ffdb', // Light green for outgoing bubbles
        },
        // Sidebar colors
        sidebar: {
          bg: '#f9f9fa',
          hover: '#f0f0f0',
          active: '#e8e8e8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 1s infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neonCyan: '#00ffe7',
        neonPurple: '#7a5fff',
        neonPink: '#ff00cc',
        neonBlue: '#00f2ff',
        softSky: '#f0faff',
        spaceBlack: '#0a0a0a',
        spacePurple: '#1a0d2e',
        spaceBlue: '#16213e',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 10px #00ffe7',
        pinkGlow: '0 0 12px #ff00cc',
        purpleGlow: '0 0 15px #7a5fff',
        spaceGlow: '0 0 20px rgba(122, 95, 255, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          from: { boxShadow: '0 0 5px #00ffe7' },
          to: { boxShadow: '0 0 20px #00ffe7' },
        },
      },
    },
  },
  plugins: [],
}
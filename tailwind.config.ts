import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ide: {
          bg: '#1E1E1E',
          panel: '#252526',
          toolbar: '#2D2D30',
          border: '#3E3E42',
          text: '#D4D4D4',
          textDim: '#858585',
          accent: '#007ACC',
          success: '#4EC9B0',
          error: '#F48771',
          warning: '#CE9178',
        }
      },
      fontFamily: {
        mono: ['Monaco', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
} satisfies Config

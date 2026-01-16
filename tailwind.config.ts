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
          bg: 'var(--ide-bg, #1E1E1E)',
          panel: 'var(--ide-panel, #252526)',
          toolbar: 'var(--ide-toolbar, #2D2D30)',
          border: 'var(--ide-border, #3E3E42)',
          text: 'var(--ide-text, #D4D4D4)',
          textDim: 'var(--ide-textDim, #858585)',
          accent: 'var(--ide-accent, #007ACC)',
          success: 'var(--ide-success, #4EC9B0)',
          error: 'var(--ide-error, #F48771)',
          warning: 'var(--ide-warning, #CE9178)',
        }
      },
      fontFamily: {
        mono: ['Monaco', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
} satisfies Config

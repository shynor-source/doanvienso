/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        doan: {
          primary: '#161891',
          dark: '#0E1068',
          light: '#EEF0FB',
          accent: '#161891',
          accentLight: '#F4F5FC',
          grayBg: '#F5F7FB',
        }
      },
      boxShadow: {
        'mobile': '0 -2px 12px rgba(15, 23, 42, 0.06)',
        'card': '0 1px 4px rgba(22, 24, 145, 0.06), 0 4px 12px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}

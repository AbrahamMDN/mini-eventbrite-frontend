// Configuración de colores
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#b21e35',
          light: '#da1e37',
          dark: '#641220'
        },
        bg: {
          light: '#ffffff',
          dark: '#0b1220'
        },
        text: {
          light: '#0f172a',
          dark: '#e2e8f0'
        }
      },
      boxShadow: {
        soft: '0 8px 24px rgba(2, 6, 23, 0.08)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
}
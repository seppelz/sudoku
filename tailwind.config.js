const forms = require('@tailwindcss/forms')
const typography = require('@tailwindcss/typography')

module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f8ff',
          100: '#ebedff',
          200: '#d7dcff',
          300: '#abb5ff',
          400: '#7a88ff',
          500: '#4f5dff',
          600: '#2b35f4',
          700: '#1c24ce',
          800: '#181fa1',
          900: '#151c7f',
          950: '#0d1150',
        },
        neutral: {
          50: '#f5f6f7',
          100: '#e8ebee',
          200: '#d0d6dc',
          300: '#b1bac4',
          400: '#8894a4',
          500: '#65738a',
          600: '#4d5970',
          700: '#414a5c',
          800: '#363d4b',
          900: '#1f2430',
          950: '#10131b',
        },
        success: '#2f9b63',
        danger: '#d1435b',
        warning: '#d68f20',
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.25rem',
      },
      boxShadow: {
        panel: '0 20px 45px -18px rgba(24, 31, 161, 0.25)',
      },
    },
  },
  plugins: [forms, typography],
}

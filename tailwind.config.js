/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#062925',
          50: '#E6ECEC',
          100: '#CCDAD9',
          200: '#99B5B3',
          300: '#668F8C',
          400: '#336A66',
          500: '#062925',
          600: '#052421',
          700: '#041F1D',
          800: '#031A18',
          900: '#021514'
        },
        accent: {
          DEFAULT: '#F7C769',
          50: '#FEF9F0',
          100: '#FEF3E1',
          200: '#FCE7C3',
          300: '#FBDBA5',
          400: '#F9CF87',
          500: '#F7C769',
          600: '#F5BF5E',
          700: '#F4B753',
          800: '#F2AF48',
          900: '#F0A73D'
        }
      }
    },
  },
  plugins: [],
};
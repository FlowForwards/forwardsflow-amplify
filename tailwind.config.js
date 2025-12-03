/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef1ff',
          100: '#e0e4ff',
          200: '#c6ccff',
          300: '#a3a9ff',
          400: '#7b7eff',
          500: '#5652f7',
          600: '#3832e3',
          700: '#2f29c7',
          800: '#2724a1',
          900: '#24227f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0,0,0,.03), 0 2px 4px rgba(0,0,0,.05), 0 12px 24px rgba(0,0,0,.05)',
      }
    },
  },
  plugins: [],
}

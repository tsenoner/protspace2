/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      display: ['responsive'],
      minHeight: {
        custom: '32px'
      }
    }
  },
  plugins: []
};

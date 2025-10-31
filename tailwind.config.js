/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'up-down': '0 10px 20px rgba(0, 0, 0, 0.07), 0 6px 6px rgba(0, 0, 0, 0.04);',
      },
      screens: {
        xs: '303px',
        xxs: "396px"

      },
    },
  },
  plugins: [],
};

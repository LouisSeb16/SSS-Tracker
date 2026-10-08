/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#0F1419',
        primary: '#1D9BF0',
        muted: '#536471',
        border: '#CFD9DE',
        surface: '#F7F9F9',
        danger: '#F4212E',
      },
    },
  },
  plugins: [],
};

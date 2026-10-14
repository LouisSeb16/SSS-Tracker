const { colors } = require('./src/shared/theme/colors');
const { fonts } = require('./src/shared/theme/fonts');

// Spacing uses Tailwind's default 4px scale, which matches the Expo template scale:
// 0.5=2, 1=4, 2=8, 4=16, 6=24, 8=32, 16=64.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      // Large, soft corners. `card` for outer cards and tiles, `inner` for a card
      // nested inside another (smaller radius keeps the gap visually even).
      borderRadius: {
        inner: '20px',
        card: '28px',
      },
      fontFamily: {
        sans: [fonts.regular],
        'sans-medium': [fonts.medium],
        'sans-semibold': [fonts.semibold],
        'sans-bold': [fonts.bold],
        'sans-extrabold': [fonts.extrabold],
      },
    },
  },
  plugins: [],
};

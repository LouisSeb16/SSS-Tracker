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
      borderRadius: {
        control: '16px',
        card: '24px',
      },
      fontFamily: {
        inter: [fonts.regular],
        'inter-medium': [fonts.medium],
        'inter-semibold': [fonts.semibold],
        'inter-bold': [fonts.bold],
      },
    },
  },
  plugins: [],
};

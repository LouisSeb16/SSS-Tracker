// Single source of truth for the palette. CommonJS on purpose: tailwind.config.js
// (plain Node) and TypeScript code (icon and placeholder colors, which cannot take a
// className) both import this file.
//
// Neutrals follow the Expo template palette. The blue and the red are darkened so
// white text on them passes WCAG AA (4.5:1): primary 4.83:1, danger 5.21:1.
const colors = {
  background: '#FFFFFF',
  foreground: '#000000',
  surface: '#F0F0F3',
  'surface-pressed': '#E0E1E6',
  border: '#E0E1E6',
  muted: '#60646C',
  primary: '#2B6BE6',
  'primary-foreground': '#FFFFFF',
  danger: '#CE2C31',
};

module.exports = { colors };

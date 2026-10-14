// Single source of truth for the palette. CommonJS on purpose: tailwind.config.js
// (plain Node) and TypeScript code (icon colors, which cannot take a className) both
// import this file.
//
// Warm cream canvas, near-black ink, one vivid cyan accent and charcoal panels.
// Contrast (WCAG): ink on canvas 16.4, ink on accent 6.3, white on panel 9.2,
// muted on canvas 4.7, muted on card 5.4, panel-muted on panel 4.6, danger on canvas 4.8,
// accent-text on canvas 4.9. White on the bright accent is only 3.0, so text on accent
// fills is always ink, and `accent` is for fills and large numerals, never small text.
const colors = {
  canvas: '#F2EFE6',
  card: '#FFFFFF',
  ink: '#111111',
  muted: '#6B6A63',
  line: '#DDD9CC',
  accent: '#009FDB',
  'accent-text': '#006F9E',
  panel: '#484848',
  'panel-muted': '#B8B8B8',
  danger: '#C9252C',
};

module.exports = { colors };

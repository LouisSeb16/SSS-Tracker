// Inter Tight: a tighter-spaced Inter built for headlines and big numerals.
// React Native cannot pick a weight from one custom font family: every weight is a
// separate loaded font file with its own family name. Tailwind classes map to these
// names (font-sans, font-sans-medium, ...), so never use font-bold with this font...
const fonts = {
  regular: 'InterTight_400Regular',
  medium: 'InterTight_500Medium',
  semibold: 'InterTight_600SemiBold',
  bold: 'InterTight_700Bold',
  extrabold: 'InterTight_800ExtraBold',
};

module.exports = { fonts };

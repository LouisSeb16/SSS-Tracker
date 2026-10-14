// React Native cannot pick a weight from one custom font family: every weight is a
// separate loaded font file with its own family name. Tailwind classes map to these
// names (font-inter, font-inter-medium, ...), so never use font-bold with Inter.
const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

module.exports = { fonts };

// Bricolage Grotesque: a heavy, round grotesque with character, used for everything.
// React Native cannot pick a weight from one custom font family: every weight is a
// separate loaded font file with its own family name. Tailwind classes map to these
// names (font-sans, font-sans-medium, ...), so never use font-bold with this font.
const fonts = {
  regular: 'BricolageGrotesque_400Regular',
  medium: 'BricolageGrotesque_500Medium',
  semibold: 'BricolageGrotesque_600SemiBold',
  bold: 'BricolageGrotesque_700Bold',
  extrabold: 'BricolageGrotesque_800ExtraBold',
};

module.exports = { fonts };

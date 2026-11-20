// NFIL3D colour and type tokens (type per Brand Guidelines v1.2).
// Colour theme: bold yellow and clean white surfaces, both with black text
// (high-contrast style from the Everything3D card direction, Nov 2026).
const YELLOW = '#F7D347';
export const C = {
  mustard: YELLOW, // primary brand surfaces (hero, welcome, quiz cards)
  black: '#000000', // all text and the logo on yellow and white
  cream: '#F4F4F4', // neutral panels on white
  orange: YELLOW, // buy actions: yellow button, black text
  burnt: '#000000', // accents are black in this theme
  sand: '#FFF3C4', // soft yellow tint for status tags
  white: '#FFFFFF',
  divider: '#E6E6E6',
  muted: '#5E5E62', // secondary text, 6:1 on white
  success: '#1E6B34',
  danger: '#B42318',
};

export const F = {
  display: 'InterTight_900Black',
  heading: 'Inter_700Bold',
  label: 'Inter_600SemiBold',
  body: 'Inter_400Regular',
};

export const R = { sm: 12, md: 16, lg: 22, xl: 28 };

export const MAX_W = 560; // keeps the web build phone-width on desktop

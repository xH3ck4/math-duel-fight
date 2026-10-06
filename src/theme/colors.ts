/** Brand palette from Math Duel logo — navy / gold / red / blue arena look */
export const colors = {
  primary: '#1E4D8C',
  primaryDark: '#0F2A52',
  primaryLight: '#3B7BC8',
  secondary: '#F5C518',
  secondaryDark: '#E08900',
  accent: '#2B9B8A',
  accentLight: '#4DB6A8',
  success: '#2E9B4F',
  successBg: '#E4F7EA',
  error: '#E6392B',
  errorBg: '#FDE8E6',
  warning: '#F5C518',
  warningBg: '#FFF6D6',
  background: '#0F2A52',
  backgroundAlt: '#163A6B',
  surface: '#F7F4EC',
  surfaceMuted: '#E8EEF6',
  text: '#0F2A52',
  textSecondary: '#5A6F8A',
  textInverse: '#FFFFFF',
  border: '#C5D4E8',
  hpHigh: '#2E9B4F',
  hpMid: '#F5A623',
  hpLow: '#E6392B',
  combo: '#FF6A00',
  overlay: 'rgba(8, 20, 40, 0.72)',
  arenaTop: '#1A3F72',
  arenaMid: '#2A5A9A',
  arenaBottom: '#0B1C33',
  platform: '#1E3A5F',
  gold: '#F5C518',
  navy: '#0F2A52',
  fighterRed: '#E6392B',
  fighterBlue: '#2B6CB0',
  panelDark: 'rgba(10, 28, 55, 0.88)',
  panelLight: 'rgba(247, 244, 236, 0.96)',
  kai: '#2B6CB0',
  raka: '#E6392B',
  naya: '#E08900',
  zara: '#2B9B8A',
};

export const typography = {
  display: {
    fontSize: 36,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  button: {
    fontSize: 17,
    fontWeight: '800' as const,
    letterSpacing: 0.8,
  },
  question: {
    fontSize: 24,
    fontWeight: '800' as const,
  },
  hud: {
    fontSize: 12,
    fontWeight: '800' as const,
    letterSpacing: 1.2,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 999,
};

export const shadows = {
  soft: {
    shadowColor: '#061428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  medium: {
    shadowColor: '#061428',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
};

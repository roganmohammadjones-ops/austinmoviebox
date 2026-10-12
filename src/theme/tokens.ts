/**
 * MovieBox — Dark Cinematic Design Tokens
 * Adheres strictly to AGENT.md §2.3, DESIGN.md §13-§18, and BLUEPRINT.md §5.
 */

// ==========================================
// 1. Color Palette Tokens
// ==========================================

export const colors = {
  // Canonical Dark Cinematic Palette (DESIGN.md §14, AGENT.md §2.3)
  backgroundRoot: '#08090D',
  backgroundSecondary: '#111318',
  surfaceCard: '#141923',
  surfaceElevated: '#202736',
  surfaceContainer: '#141923',

  // Primary & Secondary Brand Accents
  accentPrimary: '#E50914', // Cinema Red (CTAs, hero actions, active states)
  accentSecondary: '#F5C518', // Rating Gold (Stars, IMDb badges, secondary highlights)
  cinemaRed: '#E50914',
  ratingGold: '#F5C518',

  // Text Hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',

  // Borders & Dividers
  borderDefault: '#202736',
  borderHighlight: '#2D3748',
  divider: 'rgba(255, 255, 255, 0.08)',

  // Feedback States
  success: '#36C98F',
  warning: '#F7B955',
  error: '#FF5C68',

  // Backward-Compatibility Aliases (for existing components & views)
  cinemaCanvas: '#08090D',
  raisedStage: '#141923',
  quietStage: '#202736',
  frameBorder: '#2D3748',
  primaryInk: '#FFFFFF',
  secondaryInk: '#9CA3AF',
  mutedInk: '#6B7280',
  cinemaAmber: '#F5C518',
  cinemaAmberLight: '#F5BE73',
  surfaceContainerLowest: '#08090D',
  surfaceContainerLow: '#111318',
  surfaceContainerHigh: '#202736',
  surfaceContainerHighest: '#292A2C',
  surfaceBright: '#38393B',
  onSurface: '#FFFFFF',
  onSurfaceVariant: '#9CA3AF',
} as const;

// ==========================================
// 2. Spacing Scale (4px / 8px Grid - DESIGN.md §16)
// ==========================================

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  space3xl: 32,
  space4xl: 40,
  space5xl: 48,
  screenPadding: 20,
} as const;

// ==========================================
// 3. Shape & Corner Radii (DESIGN.md §17)
// ==========================================

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  button: 12,
  input: 14,
  card: 16,
  surface: 20,
  sheet: 24,
  full: 9999,
} as const;

// ==========================================
// 4. Typography Scale (DESIGN.md §15)
// ==========================================

export const typography = {
  display: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700' as const,
  },
  screenTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  sectionHeading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700' as const,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  supporting: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  metadata: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  badge: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
  },
} as const;

// ==========================================
// 5. Gradients & Scrim Overlays (DESIGN.md §19, §55)
// ==========================================

export const gradients = {
  heroScrim: [
    'transparent',
    'rgba(8, 9, 13, 0.4)',
    'rgba(8, 9, 13, 0.85)',
    '#08090D',
  ] as const,
  backdropScrim: [
    'transparent',
    'rgba(8, 9, 13, 0.8)',
    '#08090D',
  ] as const,
  cardPosterScrim: [
    'transparent',
    'rgba(8, 9, 13, 0.85)',
  ] as const,
  accentGlow: [
    '#E50914',
    '#B20710',
  ] as const,
} as const;

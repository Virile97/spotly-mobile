export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const typography = {
  h1: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold },
  h2: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  h3: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular },
  bodySmall: { fontSize: fontSize.sm, fontWeight: fontWeight.regular },
  caption: { fontSize: fontSize.xs, fontWeight: fontWeight.regular },
} as const;

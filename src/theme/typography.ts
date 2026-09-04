import { Platform } from 'react-native'

function size(px: number) {
  return Platform.OS === 'android' ? Math.round(px * 0.875) : px
}

export const fontSize = {
  xs: size(12),
  sm: size(14),
  md: size(16),
  lg: size(20),
  xl: size(24),
  xxl: size(32),
}

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

export const typography = {
  h1: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold },
  h2: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  h3: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular },
  bodySmall: { fontSize: fontSize.sm, fontWeight: fontWeight.regular },
  caption: { fontSize: fontSize.xs, fontWeight: fontWeight.regular },
} as const

import { darkColors, lightColors, type ThemeColors } from './colors';
import { radius, spacing } from './spacing';
import { shadows } from './shadows';
import { fontSize, fontWeight, typography } from './typography';

export { darkColors, lightColors } from './colors';
export type { ThemeColors } from './colors';
export { radius, spacing } from './spacing';
export { shadows } from './shadows';
export { fontSize, fontWeight, typography } from './typography';

export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  typography: typeof typography;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
}

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  radius,
  shadows,
  typography,
  fontSize,
  fontWeight,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  radius,
  shadows,
  typography,
  fontSize,
  fontWeight,
};

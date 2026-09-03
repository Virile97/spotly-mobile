export const palette = {
  white: "#FFFFFF",
  black: "#000000",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
  blue500: "#3B82F6",
  blue600: "#2563EB",
  red500: "#EF4444",
  green500: "#22C55E",
  yellow500: "#EAB308",
  pink400: "#ea95e2",
  pink500: "#d05fc8"
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  primary: string;
  success: string;
  error: string;
  warning: string;
}

export const lightColors: ThemeColors = {
  background: palette.white,
  surface: palette.gray50,
  border: palette.gray200,
  text: palette.gray900,
  textSecondary: palette.gray500,
  primary: palette.blue600,
  success: palette.green500,
  error: palette.red500,
  warning: palette.yellow500
};

export const darkColors: ThemeColors = {
  background: palette.gray900,
  surface: palette.gray800,
  border: palette.gray700,
  text: palette.gray50,
  textSecondary: palette.gray400,
  primary: palette.blue500,
  success: palette.green500,
  error: palette.red500,
  warning: palette.yellow500
};

import { Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { palette } from '@/theme/colors';
import { fontFamily } from '@/theme/fonts';
import { radius, spacing } from '@/theme/spacing';
import { fontSize } from '@/theme/typography';

interface OnboardingButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: 'filled' | 'outline';
  style?: StyleProp<ViewStyle>;
}

export function OnboardingButton({ label, variant = 'filled', style, ...rest }: OnboardingButtonProps) {
  const isFilled = variant === 'filled';

  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.base, isFilled ? styles.filled : styles.outline, style]}
      {...rest}>
      <Text style={[styles.label, isFilled ? styles.labelFilled : styles.labelOutline]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  filled: {
    flex: 1,
    backgroundColor: palette.pink500,
  },
  outline: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  label: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  labelFilled: {
    color: palette.white,
  },
  labelOutline: {
    color: palette.white,
  },
});

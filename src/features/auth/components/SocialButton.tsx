import { Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native';

import { palette } from '@/theme/colors';
import { fontFamily } from '@/theme/fonts';
import { radius, spacing } from '@/theme/spacing';
import { fontSize } from '@/theme/typography';

interface SocialButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'solid' | 'outline';
}

export function SocialButton({ label, icon, variant = 'outline', style, ...rest }: SocialButtonProps) {
  const isSolid = variant === 'solid';

  return (
    <Pressable
      accessibilityRole="button"
      style={(state) => [
        styles.base,
        isSolid ? styles.solid : styles.outline,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.label, isSolid ? styles.labelSolid : styles.labelOutline]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  solid: {
    backgroundColor: palette.gray50,
  },
  outline: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  icon: {
    marginRight: spacing.sm,
  },
  label: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  labelSolid: {
    color: palette.gray900,
  },
  labelOutline: {
    color: palette.white,
  },
});

import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string
  variant?: 'primary' | 'secondary'
  loading?: boolean
  style?: StyleProp<ViewStyle>
}

export function Button({ label, variant = 'primary', loading, disabled, style, ...rest }: ButtonProps) {
  const { theme } = useAppTheme()
  const isPrimary = variant === 'primary'

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: isPrimary ? theme.colors.primary : theme.colors.surface,
          borderRadius: theme.radius.md,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? theme.colors.background : theme.colors.text} />
      ) : (
        <Text
          style={{
            color: isPrimary ? theme.colors.background : theme.colors.text,
            fontSize: theme.fontSize.md,
            fontWeight: theme.fontWeight.semibold,
          }}>
          {label}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

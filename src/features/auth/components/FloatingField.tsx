import type { ReactNode } from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

export const FLOATING_FIELD_HEIGHT = 56

interface FloatingFieldProps {
  label: string
  active: boolean
  error?: string
  accessory?: ReactNode
  onPress?: () => void
  children?: ReactNode
}

export function FloatingField({ label, active, error, accessory, onPress, children }: FloatingFieldProps) {
  const progress = useSharedValue(active ? 1 : 0)
  const isActive = useSharedValue(active)
  isActive.value = active

  useAnimatedReaction(
    () => isActive.value,
    (current, previous) => {
      if (current === previous) return
      progress.value = withTiming(current ? 1 : 0, { duration: 160 })
    }
  )

  const labelStyle = useAnimatedStyle(() => ({
    top: interpolate(progress.value, [0, 1], [18, 6]),
    fontSize: interpolate(progress.value, [0, 1], [fontSize.md, fontSize.xs]),
    opacity: interpolate(progress.value, [0, 1], [0.45, 0.6]),
  }))

  const field = (
    <View style={[styles.field, active && styles.fieldActive, error ? styles.fieldError : null]}>
      <Animated.Text style={[styles.label, labelStyle]} pointerEvents="none">
        {label}
      </Animated.Text>
      {children}
      {accessory ? <View style={styles.accessory}>{accessory}</View> : null}
    </View>
  )

  return (
    <View>
      {onPress ? (
        <Pressable accessibilityRole="button" onPress={onPress}>
          {field}
        </Pressable>
      ) : (
        field
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    minHeight: FLOATING_FIELD_HEIGHT,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: Platform.select({ android: radius.md, default: radius.lg }),
    paddingHorizontal: spacing.md,
    justifyContent: 'flex-end',
  },
  fieldActive: {
    borderColor: 'rgba(255,255,255,0.45)',
  },
  fieldError: {
    borderColor: palette.red500,
  },
  label: {
    position: 'absolute',
    left: spacing.md,
    color: palette.white,
    fontFamily: fontFamily.body,
  },
  accessory: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  error: {
    color: palette.red500,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.body,
    marginTop: spacing.xs,
    includeFontPadding: false,
  },
})

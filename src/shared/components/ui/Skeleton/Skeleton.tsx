import { useEffect, useState } from 'react'
import { Animated, StyleSheet, type ViewStyle } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'

interface SkeletonProps {
  width?: number | `${number}%`
  height?: number
  style?: ViewStyle
}

export function Skeleton({ width = '100%', height = 16, style }: SkeletonProps) {
  const { theme } = useAppTheme()
  const [opacity] = useState(() => new Animated.Value(0.4))

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius: theme.radius.sm,
          backgroundColor: theme.colors.surface,
          opacity,
        },
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  base: {},
})

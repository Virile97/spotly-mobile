import { Image } from 'expo-image'
import { StyleSheet, Text, View } from 'react-native'

import { useAppTheme } from '@/providers/ThemeProvider'

interface AvatarProps {
  uri?: string | null
  fallback: string
  size?: number
  backgroundColor?: string
  color?: string
}

export function Avatar({ uri, fallback, size = 40, backgroundColor, color }: AvatarProps) {
  const { theme } = useAppTheme()
  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 }

  if (uri) {
    return <Image source={{ uri }} style={dimensionStyle} contentFit="cover" />
  }

  return (
    <View
      style={[
        styles.fallback,
        dimensionStyle,
        { backgroundColor: backgroundColor ?? theme.colors.surface },
      ]}>
      <Text style={{ color: color ?? theme.colors.text, fontSize: size * 0.4 }}>
        {fallback.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

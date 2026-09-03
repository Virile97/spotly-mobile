import { StyleSheet, View } from 'react-native'
import { Marker } from 'react-native-maps'

import { useAppTheme } from '@/providers/ThemeProvider'

interface UserLocationMarkerProps {
  latitude: number
  longitude: number
}

export function UserLocationMarker({ latitude, longitude }: UserLocationMarkerProps) {
  const { theme } = useAppTheme()

  return (
    <Marker coordinate={{ latitude, longitude }} anchor={{ x: 0.5, y: 0.5 }}>
      <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
    </Marker>
  )
}

const styles = StyleSheet.create({
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
  },
})

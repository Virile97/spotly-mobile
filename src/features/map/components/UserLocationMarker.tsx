import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'
import { Marker } from 'react-native-maps'

interface UserLocationMarkerProps {
  latitude: number
  longitude: number
  heading?: number | null
}

export function UserLocationMarker({ latitude, longitude, heading }: UserLocationMarkerProps) {
  const rotation = heading ?? 0

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      anchor={{ x: 0.5, y: 0.55 }}
      flat
      tracksViewChanges>
      <View style={styles.wrap}>
        <View style={styles.halo} />
        <View style={[styles.puck, { transform: [{ rotate: `${rotation}deg` }] }]}>
          <Ionicons name="navigate" size={16} color="#1A73E8" style={styles.icon} />
        </View>
      </View>
    </Marker>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26,115,232,0.18)',
  },
  puck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
  icon: {
    transform: [{ rotate: '-45deg' }],
    marginTop: -1,
  },
})
